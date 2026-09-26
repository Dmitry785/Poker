namespace Server.Domain
{
    public class Message
    {
        public User UserIdentify { get; set; }
        public string Text { get; set; } = string.Empty;
        public string FileUrl { get; set; } = string.Empty;
        public string FileType { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; } = DateTime.Now;
        public Message(User identify, string text)
        {
            UserIdentify = identify;
            Text = text;
        }
    }
}
