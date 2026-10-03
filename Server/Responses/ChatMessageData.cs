using Server.Domain;

namespace Server.Responses
{
    public record ChatMessageData(string sender, string text, string? fileUrl, string? fileType, DateTime timestamp)
    {
        public static ChatMessageData ConvertFromMessage(Message message)
        {
            if(message.File is null)
                return new ChatMessageData(message.UserIdentify.Nickname, message.Text, null, null, message.Timestamp);
            return new ChatMessageData(message.UserIdentify.Nickname, message.Text, message.File.FileUrl, Message.FileTypeToString(message.File.FileType), message.Timestamp);
        }
    }
}
