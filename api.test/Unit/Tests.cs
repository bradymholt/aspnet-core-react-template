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

            Assert.True(string.IsNullOrEmpty(contact.lastName));
            Assert.True(string.IsNullOrEmpty(contact.firstName));
            Assert.True(string.IsNullOrEmpty(contact.email));
            Assert.True(string.IsNullOrEmpty(contact.phone));
        }
    }
}
