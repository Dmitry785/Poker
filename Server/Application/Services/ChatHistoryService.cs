using Microsoft.AspNetCore.Mvc;
using Server.Connection.DTO;

namespace Server.Application.Services
{

    public class ChatHistoryService
    {
        private Dictionary<string, DateTime> _lastSend = new Dictionary<string, DateTime>();
        private List<Message> _messages = new List<Message>();
        private int _lastSendAllowanceSecondsInterval = -1;
        public List<Message> GetAllMessages()
        {
            return _messages;
        }
        public void StoreMessage(string sender, string message)
        {
            _messages.Add(new Message(sender, message));
        }
        public void UpdateLastSend(string ip)
        {
            if(_lastSend.ContainsKey(ip))
                _lastSend[ip] = DateTime.Now;
            else
                _lastSend.Add(ip, DateTime.Now);
        }
        public bool CanSend(string ip)
        {
            if (_lastSendAllowanceSecondsInterval == -1)
                return true;
            if(_lastSend.TryGetValue(ip, out DateTime date))
            {
                Console.WriteLine((DateTime.Now - date).Seconds);
                Console.WriteLine((DateTime.Now - date).Seconds > _lastSendAllowanceSecondsInterval);
                return (DateTime.Now - date).Seconds > _lastSendAllowanceSecondsInterval;
            }
            Console.WriteLine("true");
            return true;
        }
    }
}
