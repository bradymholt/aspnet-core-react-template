using System.ComponentModel.DataAnnotations;

namespace aspnetCoreReactTemplate.ViewModels
{
    public class UserRegistration
    {
        [Required]
        [EmailAddress]
        public string email { get; set; }

        [Required]
        [MinLength(8)]
        public string password { get; set; }
}
}
