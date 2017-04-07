using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace vipper.Models
{
    public class ApplicationUser: IdentityUser
    {
        public string GivenName { get; set; }
    }
}
