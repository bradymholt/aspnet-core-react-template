using System.Threading.Tasks;
using MailKit.Net.Smtp;
using Microsoft.Extensions.Options;
using MimeKit;

namespace aspnetCoreReactTemplate.Services
{
    public class EmailSender : IEmailSender
    {
        public EmailSender(IOptions<EmailSenderOptions> optionsAccessor)
        {
            Options = optionsAccessor.Value;
        }

        public EmailSenderOptions Options { get; }

        public Task SendEmailAsync(string toEmail, string subject, string htmlMessage, string textMessage = null)
        {
            var mimeMessage = new MimeMessage();
            mimeMessage.From.Add(new MailboxAddress(this.Options.emailFromName, this.Options.emailFromAddress));
            mimeMessage.To.Add(new MailboxAddress(toEmail));
            mimeMessage.Subject = subject;

            var bodyBuilder = new BodyBuilder();
            bodyBuilder.HtmlBody = htmlMessage;
            bodyBuilder.TextBody = textMessage ?? htmlMessage;

            mimeMessage.Body = bodyBuilder.ToMessageBody();

            using (var client = new SmtpClient())
            {
                // For demo-purposes, accept all SSL certificates (in case the server supports STARTTLS)
                client.ServerCertificateValidationCallback = (s, c, h, e) => true;

                client.Connect(this.Options.host, this.Options.port, false);

                // Note: since we don't have an OAuth2 token, disable
                // the XOAUTH2 authentication mechanism.
                client.AuthenticationMechanisms.Remove("XOAUTH2");

                // Note: only needed if the SMTP server requires authentication
                if (!string.IsNullOrEmpty(this.Options.username))
                {
                    client.Authenticate(this.Options.username, this.Options.password);
                }

                client.Send(mimeMessage);
                client.Disconnect(true);
            }

            return Task.FromResult(0);
        }
    }
}
