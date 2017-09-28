using System.IO;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;

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

            BuildWebHost(config["serverBindingUrl"], args).Run();
        }

        public static IWebHost BuildWebHost(string serverBindingUrl, string[] args) =>
            WebHost.CreateDefaultBuilder(args)
            .UseContentRoot(Directory.GetCurrentDirectory())
            .UseUrls(serverBindingUrl)
                .UseStartup<Startup>()
                .Build();
    }
}
