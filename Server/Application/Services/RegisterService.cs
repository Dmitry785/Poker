namespace Server.Application.Services
{
    public class RegisterService
    {
        private readonly Dictionary<string, string> _users = new Dictionary<string, string>();
        public void Register(string ip, string name)
        {
            if(_users.TryGetValue(ip, out _))
                _users.Remove(ip);
            _users.Add(ip, name);
            Console.WriteLine($"{ip} registered as {name}");
        }
        public string? GetNameByIp(string? ip)
        {
            if (ip == null)
                return null;
            if(_users.TryGetValue(ip, out var name))
            {
                return name;
            }
            return null;
        }
    }
}
