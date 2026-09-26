namespace Server.Domain
{
    public class Player
    {
        public User UserIdentify { get; set; }
        public decimal Balance {  get; set; }
        public Player(User identify, decimal balance)
        {
            UserIdentify = identify;
            Balance = balance;
        }
    }
}
