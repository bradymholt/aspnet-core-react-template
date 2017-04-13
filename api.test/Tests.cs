using Xunit;

namespace Tests
{
    public class Tests
    {
        [Fact]
        public void Test1()
        {
            var contact = new aspnetCoreReactTemplate.Models.Contact();
            Assert.True(string.IsNullOrEmpty(contact.Email));
        }
    }
}
