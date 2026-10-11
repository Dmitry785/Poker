using Microsoft.EntityFrameworkCore;

namespace Server.Domain
{
    public class Message
    {
        public Guid Id { get; set; }
        public User UserIdentify { get; set; }
        public Guid UserId { get; set; }
        public string Text { get; set; } = string.Empty;
        public MessageFile? File { get; set; }
        public DateTime Timestamp { get; set; } = DateTime.Now;
        public Message(User identify, string text)
        {
            Id = Guid.NewGuid();
            UserIdentify = identify;
            Text = text;
        }
        public Message()
        {
            Id = Guid.NewGuid();
        }
        public void AttachFile(string fileUrl, MessageFileType fileType)
        {
            File = new MessageFile(fileUrl, fileType);
        }
        public static string FileTypeToString(MessageFileType fileType)
        {
            switch (fileType)
            {
                case MessageFileType.File:
                    return "file";
                case MessageFileType.Picture:
                    return "picture";
            }
            return "undefined";
        }
    }
    [Owned]
    public class MessageFile
    {
        public string FileUrl { get; set; } = string.Empty;
        public MessageFileType FileType { get; set; }
        public MessageFile(string fileUrl, MessageFileType fileType)
        {
            FileUrl = fileUrl;
            FileType = fileType;
        }
    }
    public enum MessageFileType
    {
        File, 
        Picture
    }
}
