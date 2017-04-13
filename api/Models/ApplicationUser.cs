using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace aspnetCoreReactTemplate.Models
{
    public class ApplicationUser: IdentityUser
    {
        public string GivenName { get; set; }
    }
}
