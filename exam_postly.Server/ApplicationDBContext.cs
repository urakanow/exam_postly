using exam_postly.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace exam_postly.Server
{
    public class ApplicationDBContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<RefreshToken> RefreshTokens { get; set; }

        public ApplicationDBContext(DbContextOptions<ApplicationDBContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>().HasKey(user => user.Id);

            modelBuilder.Entity<RefreshToken>().HasKey(refreshToken => refreshToken.Id);
            modelBuilder.Entity<RefreshToken>()
                .HasOne(refreshToken => refreshToken.User)
                .WithMany(user => user.RefreshTokens)
                .HasForeignKey(refreshToken => refreshToken.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        }

    }
}
