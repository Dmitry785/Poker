using Microsoft.EntityFrameworkCore;
using Server.Domain;

namespace Server.Infrastructure
{
    public class AppDbContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Message> Messages { get; set; }
        public AppDbContext(DbContextOptions<AppDbContext> options)
            :base(options)
        {

        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            User user = new User("User 1", true, "1234");
            modelBuilder.Entity<Message>()
                .HasOne(m => m.UserIdentify)
                .WithMany()
                .HasForeignKey(m => m.UserId);
            modelBuilder.Entity<User>().HasData([
                user
            ]);
            modelBuilder.Entity<Message>().HasData([
                new Message(user, "This is default message created in OnModelCreating()")
            ]);
        }
    }
}
