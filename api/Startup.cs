using System;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.SpaServices.Webpack;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using aspnetCoreReactTemplate.Models;
using System.IdentityModel.Tokens.Jwt;
using aspnetCoreReactTemplate.Services;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Collections.Generic;

namespace aspnetCoreReactTemplate
{
    public class Startup
    {
        public IHostingEnvironment CurrentEnvironment { get; protected set; }
        public IConfiguration Configuration { get; }

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddEntityFrameworkNpgsql().AddDbContext<DefaultDbContext>(options =>
            {
                options.UseNpgsql(Configuration.GetConnectionString("defaultConnection"));
            });

            // Configure Entity Framework Initializer for seeding
            services.AddTransient<IDefaultDbContextInitializer, DefaultDbContextInitializer>();

            // Configure Entity Framework Identity for Auth
            services.AddIdentity<ApplicationUser, IdentityRole>()
            .AddEntityFrameworkStores<DefaultDbContext>()
            .AddDefaultTokenProviders();

            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            
            .AddJwtBearer(config =>
            {
                config.RequireHttpsMetadata = false;
                config.SaveToken = true;

                config.TokenValidationParameters = new TokenValidationParameters()
                {
                    ValidIssuer = Configuration["jwt:issuer"],
                    ValidAudience = Configuration["jwt:issuer"],
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["jwt:key"]))
                };
            });

            services.AddTransient<IEmailSender, EmailSender>();
            services.Configure<EmailSenderOptions>(Configuration.GetSection("email"));
            services.Configure<JwtOptions>(Configuration.GetSection("jwt"));

            // Add framework services
            services.AddMvc().AddJsonOptions(options =>
               {
                   options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
               });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory, IDefaultDbContextInitializer databaseInitializer)
        {
            // Log to console (stdout) - in production stdout will be written to /var/log/{{app_name}}.out.log
            loggerFactory.AddConsole(Configuration.GetSection("logging"));
            loggerFactory.AddDebug();

            // Apply any pending migrations
            // Do not call EnsureCreated() b/c it does not log to _EFMigrationsHistory table (Ref: https://github.com/aspnet/EntityFramework/issues/3875)
            databaseInitializer.Migrate();

            if (env.IsDevelopment())
            {
                databaseInitializer.Seed().GetAwaiter().GetResult();

                // Configure Webpack Middleware (Ref: http://blog.stevensanderson.com/2016/05/02/angular2-react-knockout-apps-on-aspnet-core/)
                //  - Intercepts requests for webpack bundles and routes them through Webpack - this prevents needing to run Webpack file watcher separately
                //  - Enables Hot module replacement (HMR)
                app.UseWebpackDevMiddleware(new WebpackDevMiddlewareOptions
                {
                    HotModuleReplacement = true,
                    HotModuleReplacementClientOptions = new Dictionary<string, string> {{ "reload", "true" }}, 
                    ReactHotModuleReplacement = true,
                    ConfigFile = System.IO.Path.Combine(Configuration["webClientPath"], "webpack.config.js")
                });

                app.UseDeveloperExceptionPage();
                app.UseDatabaseErrorPage();
            }

            // If not requesting /api*, rewrite to / so SPA app will be returned
            app.UseSpaFallback(new SpaFallbackOptions()
            {
                ApiPathPrefix = "/api",
                RewritePath = "/"
            });

            app.UseDefaultFiles();
            app.UseStaticFiles();

            app.UseForwardedHeaders(new ForwardedHeadersOptions
            {
                // Read and use headers coming from reverse proxy: X-Forwarded-For X-Forwarded-Proto
                // This is particularly important so that HttpContet.Request.Scheme will be correct behind a SSL terminating proxy
                ForwardedHeaders = ForwardedHeaders.XForwardedFor |
                ForwardedHeaders.XForwardedProto
            });

            app.UseAuthentication();
            app.UseMvc();
        }
    }
}
