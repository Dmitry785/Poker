using Server.Domain;

namespace Server.Application.Services
{
    public record ChatMessage(string Sender, string Message);
    public class ChatService
    {
        public List<Message> Messages { get; } = new List<Message>();
        public void StoreMessage(Message message)
        {
            Messages.Add(message);
        }
    }
}
