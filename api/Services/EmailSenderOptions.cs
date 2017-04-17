
namespace aspnetCoreReactTemplate.Services
{
    public class EmailSenderOptions
    {
        public Smtp smtp { get; set; }
    }

    public class Smtp
    {
        public string host { get; set; }
        public int port { get; set; }
        public string username { get; set; }
        public string password { get; set; }

        public string fromName { get; set; }
        public string fromEmail { get; set; }
    }
}
