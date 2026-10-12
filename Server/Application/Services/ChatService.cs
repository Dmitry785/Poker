using Server.Domain;
using Server.Infrastructure;

namespace Server.Application.Services
{
    public record ChatMessage(string Sender, string Message);
    public class ChatService
    {
        private readonly AppDbContext _context;
        public ChatService(AppDbContext context)
        {
            _context = context;
        }
        public void StoreMessage(Message message)
        {
            _context.Messages.Add(message);
            _context.SaveChanges();
        }
        public List<Message> GetAllMessages()
        {
            return _context.Messages.ToList();
        }
    }
}
