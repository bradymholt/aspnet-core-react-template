using System;
using System.Text.RegularExpressions;

namespace aspnetCoreReactTemplate.Services
{
    public class JwtOptions
    {
        public string key { get; set; }
        public string issuer { get; set; }
    }
}
