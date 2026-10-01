namespace Server.Requests
{
    public record RegisterRequest(string nickname, string password, bool isSpectator);

}
