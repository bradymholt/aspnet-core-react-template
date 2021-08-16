using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using aspnetCoreReactTemplate.Models;
using aspnetCoreReactTemplate.Services;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Hosting;
using System.Text;

namespace aspnetCoreReactTemplate
{
  public class Startup
  {
    public IHostEnvironment CurrentEnvironment { get; protected set; }
    public IConfiguration Configuration { get; }

    public Startup(IConfiguration configuration)
    {
      Configuration = configuration;
    }

    // This method gets called by the runtime. Use this method to add services to the container.
    public void ConfigureServices(IServiceCollection services)
    {
      services.AddControllersWithViews();

      services.AddEntityFrameworkNpgsql().AddDbContext<DefaultDbContext>(options =>
      {
        options.UseNpgsql(Configuration.GetConnectionString("defaultConnection"));
      });

      // Configure Entity Framework Initializer for seeding
      services.AddTransient<IDefaultDbContextInitializer, DefaultDbContextInitializer>();

      services.AddDatabaseDeveloperPageExceptionFilter();

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
    }

    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    public void Configure(IApplicationBuilder app, IHostEnvironment env, ILoggerFactory loggerFactory)
    {
      // If not requesting /api*, rewrite to / so SPA app will be returned
      app.UseSpaFallback(new SpaFallbackOptions()
      {
        ApiPathPrefix = "/api",
        RewritePath = "/"
      });

      app.UseDefaultFiles();
      app.UseHttpsRedirection();
      app.UseStaticFiles();

      app.UseForwardedHeaders(new ForwardedHeadersOptions
      {
        // Read and use headers coming from reverse proxy: X-Forwarded-For X-Forwarded-Proto
        // This is particularly important so that HttpContet.Request.Scheme will be correct behind a SSL terminating proxy
        ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
      });

      app.UseRouting();

      app.UseAuthentication();
      app.UseAuthorization();

      app.UseEndpoints(endpoints =>
      {
        endpoints.MapControllerRoute(
            name: "default",
            pattern: "{controller=Home}/{action=Index}/{id?}");
      });

      if (env.IsDevelopment())
      {
        app.UseSpa(spa =>
        {
          spa.UseProxyToSpaDevelopmentServer("http://localhost:8080/");
        });

        app.UseDeveloperExceptionPage();
        app.UseMigrationsEndPoint();
      }

    }
  }
}
