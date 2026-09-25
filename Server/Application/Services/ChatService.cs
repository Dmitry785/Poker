namespace Server.Application.Services
{
    public record ChatMessage(string Sender, string Message);
    public class ChatService
    {
        public List<ChatMessage> Messages { get; } = new List<ChatMessage>();
        public void StoreMessage(string sender, string message)
        {
            Messages.Add(new ChatMessage(sender, message));
        }

    }
}
