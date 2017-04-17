using System.Threading.Tasks;

namespace aspnetCoreReactTemplate.Services
{
    public interface IEmailSender
    {
        Task SendEmailAsync(string email, string subject, string message);
    }
}
