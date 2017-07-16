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
using AspNet.Security.OpenIdConnect.Primitives;
using aspnetCoreReactTemplate.Services;
using Microsoft.AspNetCore.HttpOverrides;

namespace aspnetCoreReactTemplate
{
    public class Startup
    {
        public IHostingEnvironment CurrentEnvironment { get; protected set; }
        public IConfigurationRoot Configuration { get; }

        public Startup(IHostingEnvironment env)
        {
            this.CurrentEnvironment = env;

            var builder = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                .AddEnvironmentVariables();

            Configuration = builder.Build();
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddEntityFrameworkNpgsql().AddDbContext<DefaultDbContext>(options =>
            {
                options.UseNpgsql(System.Environment.ExpandEnvironmentVariables(Configuration.GetConnectionString("defaultConnection")));
                options.UseOpenIddict();
            });

            // Configure Entity Framework Initializer for seeding
            services.AddTransient<IDefaultDbContextInitializer, DefaultDbContextInitializer>();

            // Configure Entity Framework Identity for Auth
            services.AddIdentity<ApplicationUser, IdentityRole>(o =>
            {
                // Do not 302 redirect when Unauthorized; just return 401 status code (ref: http://stackoverflow.com/a/38801130/626911)
                o.Cookies.ApplicationCookie.AutomaticChallenge = false;
            })
            .AddEntityFrameworkStores<DefaultDbContext>()
            .AddDefaultTokenProviders();

            // Configure Identity to use the same JWT claims as OpenIddict instead
            // of the legacy WS-Federation claims it uses by default (ClaimTypes),
            // which saves you from doing the mapping in your authorization controller.
            services.Configure<IdentityOptions>(options =>
            {
                options.ClaimsIdentity.UserNameClaimType = OpenIdConnectConstants.Claims.Name;
                options.ClaimsIdentity.UserIdClaimType = OpenIdConnectConstants.Claims.Subject;
                options.ClaimsIdentity.RoleClaimType = OpenIdConnectConstants.Claims.Role;
                options.SignIn.RequireConfirmedEmail = true;
            });

            // Configure OpenIddict for JSON Web Token (JWT) generation (Ref: http://capesean.co.za/blog/asp-net-5-jwt-tokens/)
            // Register the OpenIddict services.
            // Note: use the generic overload if you need
            // to replace the default OpenIddict entities.
            services.AddOpenIddict(options =>
            {
                // Register the Entity Framework stores.
                options.AddEntityFrameworkCoreStores<DefaultDbContext>();

                // Register the ASP.NET Core MVC binder used by OpenIddict.
                // Note: if you don't call this method, you won't be able to
                // bind OpenIdConnectRequest or OpenIdConnectResponse parameters.
                options.AddMvcBinders();

                // Enable the token endpoint (required to use the password flow).
                options.EnableTokenEndpoint("/api/auth/login");

                // Allow client applications to use the grant_type=password flow.
                options.AllowPasswordFlow();

                // During development, you can disable the HTTPS requirement.
                options.DisableHttpsRequirement();

                options.AllowRefreshTokenFlow();
                options.UseJsonWebTokens();
                options.AddEphemeralSigningKey();
                options.SetAccessTokenLifetime(TimeSpan.FromDays(1));
            });

            services.AddTransient<IEmailSender, EmailSender>();
            services.Configure<EmailSenderOptions>(Configuration.GetSection("email"));

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

            // Register the validation middleware, that is used to decrypt
            // the access tokens and populate the HttpContext.User property.
            app.UseOAuthValidation();


            JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear();
            JwtSecurityTokenHandler.DefaultOutboundClaimTypeMap.Clear();

            // Use JWT Bearer Authentication (i.e. authenitcate with JWT in HTTP request header)
            app.UseJwtBearerAuthentication(new JwtBearerOptions
            {
                AutomaticAuthenticate = true,
                AutomaticChallenge = true,
                RequireHttpsMetadata = false,
                Audience = "resource-server",
                Authority = Configuration["frontEndUrl"]
            });

            app.UseOpenIddict();
            app.UseIdentity();
            app.UseMvc();
        }
    }
}
