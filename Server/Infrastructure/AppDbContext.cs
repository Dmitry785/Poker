using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure.Internal;
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
            modelBuilder.Entity<Message>()
                .HasOne(m => m.UserIdentify)
                .WithMany()
                .HasForeignKey(m => m.UserId);
            modelBuilder.Entity<Message>().HasData([
                
            ]);
        }
        public void AddDefaultData()
        {
            Users.ExecuteDelete();
            Messages.ExecuteDelete();
            User user = new User("User 1", true, "1234");
            Message message = new Message(user, "This is default message created in OnModelCreating()");
            Users.Add(user);
            Messages.Add(message);
            SaveChanges();
        }
    }
}
