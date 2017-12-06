using aspnetCoreReactTemplate.Extensions;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace aspnetCoreReactTemplate.Models
{
  public class DefaultDbContext : IdentityDbContext<ApplicationUser>
  {
    public DefaultDbContext(DbContextOptions<DefaultDbContext> options)
      : base(options)
    {
    }

    public DbSet<ApplicationUser> ApplicationUsers { get; set; }
    public DbSet<Contact> Contacts { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
      base.OnModelCreating(modelBuilder);

      // Replace table names
      foreach(var entity in modelBuilder.Model.GetEntityTypes())
      {

        entity.Relational().TableName = entity.Relational().TableName.Replace("AspNet", "").ToSnakeCase();

        // Replace column names
        foreach(var property in entity.GetProperties())
        {
          property.Relational().ColumnName = property.Name.ToSnakeCase();
        }

        foreach(var key in entity.GetKeys())
        {
          key.Relational().Name = key.Relational().Name.ToSnakeCase();
        }

        foreach(var key in entity.GetForeignKeys())
        {
          key.Relational().Name = key.Relational().Name.ToSnakeCase();
        }

        foreach(var index in entity.GetIndexes())
        {
          index.Relational().Name = index.Relational().Name.ToSnakeCase();
        }
      }
    }
  }
}
