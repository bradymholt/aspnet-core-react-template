using System.ComponentModel.DataAnnotations;

namespace aspnetCoreReactTemplate.Models
{
    public class Contact
    {
        public int contactId { get; set; }

        [Required]
        [MinLength(3)]
        public string lastName { get; set; }

        [Required]
        public string firstName { get; set; }

        public string phone { get; set; }

        [DataType(DataType.EmailAddress)]
        [StringLength(30, MinimumLength = 0)]
        public string email { get; set; }
    }
}
