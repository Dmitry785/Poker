namespace Server.Domain
{
    public class User
    {
        public Guid Id { get; set; }
        public string Nickname { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public bool IsSpectator { get; set; }
        public DateTime RegistrationDate { get; set; } = DateTime.UtcNow;
        public User(string nickname, bool isSpec, string pass)
        {
            Id = Guid.NewGuid();
            IsSpectator = isSpec;
            Nickname = nickname;
            Password = pass;
        }
        public User()
        {
            Id = Guid.NewGuid();
        }
    }
}
