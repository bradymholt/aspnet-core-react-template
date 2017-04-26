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
        DefaultDbContext _context;

        public ContactsController(DefaultDbContext context)
        {
            _context = context;
        }

        // GET api/contacts
        [HttpGet]
        public IEnumerable<Contact> Get()
        {
            return _context.Contacts.OrderBy((o)=> o.lastName);
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
            Where((c)=> c.lastName.Contains(q) || c.firstName.Contains(q)).
            OrderBy((o) => o.lastName);
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
            return CreatedAtRoute("GetContact", new { id = model.contactId }, model);
        }

        // PUT api/contacts/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody]Contact model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            model.contactId = id;
            _context.Update(model);
            await _context.SaveChangesAsync();
            return Ok();
        }

        // DELETE api/contacts/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            Contact contact = new Contact() { contactId = id };
            _context.Entry(contact).State = EntityState.Deleted;

            await _context.SaveChangesAsync();
            return Ok();
        }
    }
}
