using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace aspnetCoreReactTemplate
{
    /*
        Middleware that will rewrite (not redirect!) nested SPA page requests to the SPA root path.
        For SPA apps that are using client-side routing, a refresh or direct request for a nested path will
        be received by the server but the root path page should be actually be served because the client
        is responsible for routing, not the server.  Only those requests not prefixed with
        options.ApiPathPrefix and not containing a path extention (i.e. image.png, scripts.js) will
        be rewritten.

        (SpaFallbackOptions options):
            ApiPathPrefix - The api path prefix is what requests for the REST api begin with.  These
                            will be ignored and not rewritten.  So, if this is supplied as 'api',
                            any requests starting with 'api' will not be rewritten.
            RewritePath   - What path to rewrite to (usually '/')

        Examples:
            (options.ApiPathPrefix == "api", options.RewritePath="/")
            http://localhost:5000/api/auth/login => (no rewrite)
            http://localhost:5000/style.css => (no rewrite)
            http://localhost:5000/contacts => /
            http://localhost:5000/contacts/5/edit => /
    */


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
