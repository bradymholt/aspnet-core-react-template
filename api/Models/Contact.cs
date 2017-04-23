using System.ComponentModel.DataAnnotations;

namespace aspnetCoreReactTemplate.Models
{
    public class Contact
    {
        public int contactId { get; set; }

        [Required]
        public string lastName { get; set; }
        [Required]
        public string firstName { get; set; }

        [MinLength(8)]
        public string phone { get; set; }

        [EmailAddress]
        [MinLength(8)]
        public string email { get; set; }
    }
}
