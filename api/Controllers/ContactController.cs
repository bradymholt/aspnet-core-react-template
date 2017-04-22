using System.Collections.Generic;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using aspnetCoreReactTemplate.Models;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System;

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
            return _context.Contacts;
        }

        // GET api/contacts/5
        [HttpGet("{id}", Name = "GetContact")]
        public string Get(int id)
        {
            return "value";
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
