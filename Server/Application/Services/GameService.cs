using Server.Application.ResultApi;
using Server.Domain;

namespace Server.Application.Services
{
    public class GameService
    {
        public int AvailablePlayersCount { set; private get; }
        public decimal StartMoney { set; private get; }
        public List<Player> Players
        {
            get;
        } = new List<Player>();
        public Result AddPlayer(Player player)
        {
            if (AvailablePlayersCount <= Players.Count)
                return Result.Fail("Server is full");
            Players.Add(player);
            return Result.Ok();
        }
    }
}
