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

      foreach(var entity in modelBuilder.Model.GetEntityTypes())
      {
        // Remove 'AspNet' prefix and convert table name from PascalCase to snake_case. E.g. AspNetRoleClaims -> role_claims
        entity.Relational().TableName = entity.Relational().TableName.Replace("AspNet", "").ToSnakeCase();

        // Convert column names from PascalCase to snake_case.
        foreach(var property in entity.GetProperties())
        {
          property.Relational().ColumnName = property.Name.ToSnakeCase();
        }
        
        // Convert primary key names from PascalCase to snake_case. E.g. PK_users -> pk_users
        foreach(var key in entity.GetKeys())
        {
          key.Relational().Name = key.Relational().Name.ToSnakeCase();
        }

        // Convert foreign key names from PascalCase to snake_case.
        foreach(var key in entity.GetForeignKeys())
        {
          key.Relational().Name = key.Relational().Name.ToSnakeCase();
        }
        
        // Convert index names from PascalCase to snake_case.
        foreach(var index in entity.GetIndexes())
        {
          index.Relational().Name = index.Relational().Name.ToSnakeCase();
        }
      }
      
    }

  }
}
