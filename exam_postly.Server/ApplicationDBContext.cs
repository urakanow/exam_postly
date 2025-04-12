using exam_postly.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace exam_postly.Server
{
    public class ApplicationDBContext : DbContext
    {
        public DbSet<User> Users { get; set; }

        public ApplicationDBContext(DbContextOptions<ApplicationDBContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>().HasIndex(user => user.Id);
        }

    }
}
