using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace aspnetCoreReactTemplate.Models
{
    public class DefaultDbContextInitializer : IDefaultDbContextInitializer
    {
        private readonly DefaultDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;

        public DefaultDbContextInitializer(DefaultDbContext context, UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager)
        {
            _userManager = userManager;
            _context = context;
            _roleManager = roleManager;
        }

        public bool EnsureCreated()
        {
            return _context.Database.EnsureCreated();
        }

        public void Migrate()
        {
            _context.Database.Migrate();
        }

        public async Task Seed()
        {
            var email = "user@test.com";
            if (await _userManager.FindByEmailAsync(email) == null)
            {
                var user = new ApplicationUser
                {
                    UserName = email,
                    Email = email,
                    EmailConfirmed = true,
                    GivenName = "John Doe"
                };

                await _userManager.CreateAsync(user, "P2ssw0rd!");
            }

            if (_context.Contacts.Any())
            {
                foreach (var u in _context.Contacts)
                {
                    _context.Remove(u);
                }
            }

            _context.Contacts.Add(new Contact() { lastName = "Finkley", firstName = "Adam", phone = "555-555-5555", email = "adam@somewhere.com" });
            _context.Contacts.Add(new Contact() { lastName = "Biles", firstName = "Steven", phone = "555-555-5555", email = "sbiles@somewhere.com" });
            _context.SaveChanges();
        }
    }

    public interface IDefaultDbContextInitializer
    {
        bool EnsureCreated();
        void Migrate();
        Task Seed();
    }
}
