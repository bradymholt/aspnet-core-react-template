using System.Collections.Generic;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using vipper.Models;

namespace vipper.Controllers
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
