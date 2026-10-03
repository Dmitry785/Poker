namespace Server.Requests
{
    public record SendFileMessageReuqest(Guid id, string text, IFormFile formFile, string uploadType);
}
