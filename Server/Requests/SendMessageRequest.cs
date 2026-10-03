namespace Server.Requests
{
    public record SendMessageReuqest(Guid id, string text, IFormFile? formFile, string? uploadType);
}
