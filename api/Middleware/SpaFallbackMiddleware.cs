using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace aspnetCoreReactTemplate
{
    public class SpaFallbackMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger _logger;
        private SpaFallbackOptions _options;

        public SpaFallbackMiddleware(RequestDelegate next, ILoggerFactory loggerFactory, SpaFallbackOptions options)
        {
            _next = next;
            _logger = loggerFactory.CreateLogger<SpaFallbackMiddleware>();
            _options = options;
        }

        public async Task Invoke(HttpContext context)
        {
            _logger.LogInformation("Handling request: " + context.Request.Path);

            // If request path starts with _apiPathPrefix and the path does not have an extension (i.e. .css, .js, .png)
            if (!context.Request.Path.Value.StartsWith(_options.ApiPathPrefix) && !context.Request.Path.Value.Contains("."))
            {
                _logger.LogInformation($"Rewriting path: {context.Request.Path} > {_options.RewritePath}");
                context.Request.Path = _options.RewritePath;
            }

            await _next.Invoke(context);
            _logger.LogInformation("Finished handling request.");
        }
    }

    public static class SpaFallbackExtensions
    {
        public static IApplicationBuilder UseSpaFallback(this IApplicationBuilder builder, SpaFallbackOptions options)
        {
            if (options == null)
            {
                options = new SpaFallbackOptions();
            }
            return builder.UseMiddleware<SpaFallbackMiddleware>(options);
        }
    }
}
