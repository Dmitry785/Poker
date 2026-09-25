namespace Server.Domain
{
    public class Player
    {
        public string Nickname { get; set; }
        public decimal Balance {  get; set; }
        public Player(string nickname, decimal balance)
        {
            Nickname = nickname;
            Balance = balance;
        }
    }
}
