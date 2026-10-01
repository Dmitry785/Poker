namespace Server.Domain
{
    public class User
    {
        public Guid Id { get; set; }
        public string Nickname { get; set; }
        public string Password { get; set; }
        public bool IsSpectator { get; set; }
        public DateTime RegistrationDate { get; set; } = DateTime.Now;
        public User(string nickname, bool isSpec, string pass)
        {
            Id = Guid.NewGuid();
            IsSpectator = isSpec;
            Nickname = nickname;
            Password = pass;
        }
    }
}
