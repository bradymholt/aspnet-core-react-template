using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using OpenIddict;

namespace vipper.Models
{
    public class DefaultDbContext : OpenIddictDbContext<ApplicationUser>
    {
        public DefaultDbContext() { }

        public DefaultDbContext(DbContextOptions<DefaultDbContext> options)
        : base(options)
        { }

        public DbSet<ApplicationUser> ApplicationUsers { get; set; }
        public DbSet<Contact> Contacts { get; set; }
    }
}