using System;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.SpaServices.Webpack;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using vipper.Models;

namespace vipper
{
    public class Startup
    {
        public Startup(IHostingEnvironment env)
        {
            var builder = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                .AddEnvironmentVariables();

            if (!env.IsDevelopment())
            {
                // If not development, merge in release config
                builder.AddJsonFile($"appsettings.release.json", optional: true);
            }

            Configuration = builder.Build();
        }

        public IConfigurationRoot Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            // Configure Entity Framework with Postgres
            services.AddEntityFrameworkNpgsql()
                .AddDbContext<DefaultDbContext>(options => options.UseNpgsql(Configuration.GetConnectionString("defaultConnection")));

            // Configure Entity Framework Initializer for seeding
            services.AddTransient<IDefaultDbContextInitializer, DefaultDbContextInitializer>();

            // Configure Entity Framework Identity for Auth
            services.AddIdentity<ApplicationUser, IdentityRole>()
                .AddEntityFrameworkStores<DefaultDbContext>()
                .AddDefaultTokenProviders();

            // Configure OpenIddict for JSON Web Token (JWT) generation (Ref: http://capesean.co.za/blog/asp-net-5-jwt-tokens/)
            services.AddOpenIddict<ApplicationUser, IdentityRole, DefaultDbContext>()
                .DisableHttpsRequirement()
                .EnableTokenEndpoint("/api/auth/login")
                .AllowPasswordFlow()
                .AllowRefreshTokenFlow()
                .UseJsonWebTokens()
                .AddEphemeralSigningKey()
                .SetAccessTokenLifetime(TimeSpan.FromDays(1));

            // Add framework services
            services.AddMvc();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory, IDefaultDbContextInitializer databaseInitializer)
        {
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
                    ReactHotModuleReplacement = true,
                    ConfigFile = System.IO.Path.Combine(Configuration["webClientPath"], "webpack.config.js")
                });

                app.UseDeveloperExceptionPage();
                app.UseDatabaseErrorPage();
            }

            app.UseDefaultFiles();
            app.UseStaticFiles();

            // Configure OpenIddict (in lieu of app.UseIdentity())
            app.UseOpenIddict();

            // Use JWT Bearer Authentication (i.e. authenitcate with JWT in HTTP request header)
            app.UseJwtBearerAuthentication(new JwtBearerOptions
            {
                AutomaticAuthenticate = true,
                AutomaticChallenge = true,
                RequireHttpsMetadata = false,
                Audience = Configuration["url"],
                Authority = Configuration["url"]
            });

            app.UseMvc();
        }
    }
}
