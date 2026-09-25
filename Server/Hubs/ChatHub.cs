using System.Xml.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Server.Application.Services;

namespace Server.Hubs
{
    public class ChatHub : Hub
    {
        public async Task Send(string message, [FromServices]RegisterService regService)
        {
        }
        public override async Task OnConnectedAsync()
        {
            Console.WriteLine($"{Context.GetHttpContext()?.Connection.RemoteIpAddress?.ToString() ?? "unknown"} connected");
        }
        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            Console.WriteLine($"{Context.GetHttpContext()?.Connection.RemoteIpAddress?.ToString() ?? "unknown"} disconnected");
        }
    }
}
