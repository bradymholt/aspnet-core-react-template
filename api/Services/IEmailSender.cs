using System.Threading.Tasks;

namespace aspnetCoreReactTemplate.Services
{
    public interface IEmailSender
    {
        Task SendEmailAsync(string toEmail, string subject, string htmlMessage, string textMessage = null);
    }
}
