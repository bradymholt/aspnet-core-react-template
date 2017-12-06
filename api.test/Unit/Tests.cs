using Xunit;
using app = aspnetCoreReactTemplate;

namespace Tests.Unit
{
    public class Tests
    {
        [Fact]
        public void TestNewContactProperties()
        {
            var contact = new app.Models.Contact();

            Assert.True(string.IsNullOrEmpty(contact.LastName));
            Assert.True(string.IsNullOrEmpty(contact.FirstName));
            Assert.True(string.IsNullOrEmpty(contact.Email));
            Assert.True(string.IsNullOrEmpty(contact.Phone));
        }
    }
}
