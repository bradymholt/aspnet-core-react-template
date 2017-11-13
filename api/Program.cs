using System.IO;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

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

            var host = BuildHost(config["serverBindingUrl"], args);
            using (var scope = host.Services.CreateScope())
            {
                var dbInitializer = scope.ServiceProvider.GetRequiredService<Models.IDefaultDbContextInitializer>();
                var env = scope.ServiceProvider.GetRequiredService<IHostingEnvironment>();
                // Apply any pending migrations
                dbInitializer.Migrate();
                if (env.IsDevelopment())
                {
                    // Seed the database in development mode
                    dbInitializer.Seed().GetAwaiter().GetResult();
                }
            }

            host.Run();
        }

        public static IWebHost BuildHost(string serverBindingUrl, string[] args) =>
            WebHost.CreateDefaultBuilder(args)
            .UseContentRoot(Directory.GetCurrentDirectory())
            .UseUrls(serverBindingUrl)
                .UseStartup<Startup>()
                .Build();
    }
}
