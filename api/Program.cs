using System.IO;
using aspnetCoreReactTemplate.Models;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace aspnetCoreReactTemplate
{
  public class Program
  {
    public static void Main(string[] args)
    {
      var config = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json")
            .Build();

      var host = CreateHostBuilder(config, args).Build();
      using (var scope = host.Services.CreateScope())
      {
        var dbContext = scope.ServiceProvider.GetService<DefaultDbContext>();
        dbContext.Database.Migrate();

        var env = scope.ServiceProvider.GetRequiredService<IWebHostEnvironment>();
        if (env.IsDevelopment())
        {
          // Seed the database in development mode
          var dbInitializer = scope.ServiceProvider.GetRequiredService<Models.IDefaultDbContextInitializer>();
          dbInitializer.Seed().GetAwaiter().GetResult();
        }
      }

      host.Run();
    }

    public static IHostBuilder CreateHostBuilder(IConfigurationRoot config, string[] args) =>
      Host.CreateDefaultBuilder(args)
        .ConfigureLogging(logging =>
        {
          logging.ClearProviders();
          // Log to console (stdout) - in production stdout will be written to /var/log/{{app_name}}.out.log
          logging.AddConsole();
          logging.AddDebug();
        })
        .ConfigureWebHostDefaults(webBuilder =>
          {
            webBuilder
            .UseUrls(config["serverBindingUrl"])
            .UseStartup<Startup>();
          });
  }
}
