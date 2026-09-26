using Server.Domain;

namespace Server.Application.Services
{
    public record ChatMessage(string Sender, string Message);
    public class ChatService
    {
        public List<Message> Messages { get; } = new List<Message>();
        public Message StoreTextMessage(User user, string text)
        {
            var message = new Message(user, text);
            Messages.Add(message);
            return message;
        }
    }
}
