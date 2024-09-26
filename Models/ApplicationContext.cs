using Microsoft.EntityFrameworkCore;

namespace CSVParser.Models;
public class ApplicationContext : DbContext
{
    public ApplicationContext(DbContextOptions<ApplicationContext> options)
        : base(options)
    {
    }

    public DbSet<Person> Persons { get; set; }
}