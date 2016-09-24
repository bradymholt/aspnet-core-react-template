using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using OpenIddict;

namespace vipper.Models
{
    public class ApplicationUser : OpenIddictUser
    {
        public string GivenName { get; set; }
    }
}