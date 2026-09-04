using Microsoft.AspNetCore.SignalR;

namespace Server.Hubs
{
    public class ChatHub : Hub
    {
        public async Task Send(string message, string sender)
        {
            await this.Clients.All.SendAsync("Receive", message, sender);
        }
    }
}
