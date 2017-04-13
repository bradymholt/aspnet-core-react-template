namespace aspnetCoreReactTemplate
{
    public class SpaFallbackOptions
    {
        public SpaFallbackOptions()
        {
            this.ApiPathPrefix = "/api";
            this.RewritePath = "/";
        }
        public string ApiPathPrefix { get; set; }
        public string RewritePath { get; set; }
    }
}
