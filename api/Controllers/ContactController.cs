using System.Collections.Generic;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using aspnetCoreReactTemplate.Models;

namespace aspnetCoreReactTemplate.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    public class ContactsController : Controller
    {
        DefaultDbContext _context;

        public ContactsController(DefaultDbContext context)
        {
            _context = context;
        }

        // GET api/values
        [HttpGet]
        public IEnumerable<Contact> Get()
        {
            /* Example:
              GET /api/Contacts
              Authorization: Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IlFXR0RUU09US1JPX1VJRTlBQlRYRk5PVVdZRUhHVENNNzRPQzEyWkoiLCJ0eXAiOiJKV1QifQ.eyJzdWIiOiIyNTZiNzVjZi0zNTI0LTQ3ZmMtODkyOC02N2U3YmU0Yzg1MzYiLCJuYW1lIjoidXNlckB0ZXN0LmNvbSIsInJvbGUiOiJ0ZXN0cm9sZSIsImp0aSI6ImI3OTM2YzViLWFlMGUtNGFkYS05Y2NmLTU0ODI0ZTZlMjNjOSIsInVzYWdlIjoiYWNjZXNzX3Rva2VuIiwiYXVkIjoicmVzb3VyY2Utc2VydmVyIiwibmJmIjoxNDkxNzY0NTcwLCJleHAiOjE0OTE4NTA5NzAsImlhdCI6MTQ5MTc2NDU3MCwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo1MDAwLyJ9.kS58PUy0dlnC1Rb0VNa19aWnUM6l4b1GQaIUmUGYg53sZoFcPA2dSGVhbOKpghobGpr6abXPrSaBraWI7YC0PefnzGJx0wkFe7Pt7JLQ8G8vkkcrjBaDLWekC2zRrSDyzg2tRjDF5GrtmIDz4ZEHZ88DwOUiewXVBg3Dko8-v6pU6W5AV9XHeENU7HK1yjHAoUUjm_12uF1_JpKsHrya9HpKgTCpQ8FcHSY0z2c0AMaBe1W2RQomvtZtv6V-fxMT_5_KdPLQHa3qelu50MCbPKVjpg3WI2MaqmAYHgb4ap1Mme6Y351D0ZGLebHoYN161C28zaEs_Qfq0JivteorAQ
            */

            return _context.Contacts;
            //return new string[] { "value1", "value2" };
        }

        // GET api/values/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/values
        [HttpPost]
        public void Post([FromBody]string value)
        {
            //this.TryValidateModel()
            //if (ModelState.IsValid){

            //}

        }

        // PUT api/values/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/values/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
