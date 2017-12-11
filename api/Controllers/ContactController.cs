using System.Collections.Generic;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using aspnetCoreReactTemplate.Models;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System.Linq;

namespace aspnetCoreReactTemplate.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    public class ContactsController : Controller
    {
        private readonly DefaultDbContext _context;

        public ContactsController(DefaultDbContext context)
        {
            _context = context;
        }

        // GET api/contacts
        [HttpGet]
        public IEnumerable<Contact> Get()
        {
            return _context.Contacts.OrderBy((o)=> o.LastName);
        }

        // GET api/contacts/5
        [HttpGet("{id}", Name = "GetContact")]
        public Contact Get(int id)
        {
            return _context.Contacts.Find(id);
        }

        // GET api/contacts/?=
        [HttpGet("search")]
        public IEnumerable<Contact> Search(string q)
        {
            return _context.Contacts.
            Where((c)=> c.LastName.ToLower().Contains(q.ToLower()) || c.FirstName.ToLower().Contains(q.ToLower())).
            OrderBy((o) => o.LastName);
        }

        // POST api/contacts
        [HttpPost]
        public async Task<IActionResult> Post([FromBody]Contact model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.Contacts.Add(model);
            await _context.SaveChangesAsync();
            return CreatedAtRoute("GetContact", new { id = model.Id }, model);
        }

        // PUT api/contacts/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody]Contact model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            model.Id = id;
            _context.Update(model);
            await _context.SaveChangesAsync();
            return Ok();
        }

        // DELETE api/contacts/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var contact = new Contact() { Id = id };
            _context.Entry(contact).State = EntityState.Deleted;

            await _context.SaveChangesAsync();
            return Ok();
        }
    }
}
