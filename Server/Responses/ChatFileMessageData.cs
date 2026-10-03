namespace Server.Responses
{
    public record ChatFileMessageData(string sender, string text, string fileUrl, string fileType, DateTime timestamp);
}
