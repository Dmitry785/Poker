namespace Server.Application.Services.Extensions
{
    public static class GameServiceExtensions
    {
        static public GameService WithPlayerAvailable(this GameService service, int playersAvailable)
        {
            service.AvailablePlayersCount = playersAvailable;
            return service;
        }
        static public GameService WithStartMoney(this GameService service, decimal startMoney)
        {
            service.StartMoney = startMoney;
            return service;
        }
    }
}
