using System.Net;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;

namespace aspnetCoreReactTemplate.Services
{
    public class EmailSender : IEmailSender
    {
        public EmailSender(IOptions<EmailSenderOptions> optionsAccessor)
        {
            Options = optionsAccessor.Value;
        }

        public EmailSenderOptions Options { get; }

        public async Task SendEmailAsync(string toEmail, string subject, string htmlMessage, string textMessage = null)
        {
            MailMessage mailMessage = new MailMessage();
            mailMessage.From = new MailAddress(this.Options.emailFromAddress, this.Options.emailFromName);
            mailMessage.To.Add(toEmail);
            mailMessage.Body = textMessage;
            mailMessage.BodyEncoding = Encoding.UTF8;
            mailMessage.Subject = subject;
            mailMessage.SubjectEncoding = Encoding.UTF8;

            if (!string.IsNullOrEmpty(htmlMessage))
            {
                AlternateView htmlView = AlternateView.CreateAlternateViewFromString(htmlMessage);
                htmlView.ContentType = new System.Net.Mime.ContentType("text/html");
                mailMessage.AlternateViews.Add(htmlView);
            }

            using (SmtpClient client = new SmtpClient(this.Options.host, this.Options.port))
            {
                client.UseDefaultCredentials = false;
                client.Credentials = new NetworkCredential(this.Options.username, this.Options.password);
                client.EnableSsl = true;
                await client.SendMailAsync(mailMessage);
            }
        }
    }
}
