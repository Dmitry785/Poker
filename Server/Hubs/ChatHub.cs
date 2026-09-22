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
            string? name = regService.GetNameByIp(Context.GetHttpContext()?.Connection.RemoteIpAddress?.ToString());
            await Clients.All.SendAsync("Receive", name is null ? "Anonimous" : name, message);
        }
        public override async Task OnConnectedAsync()
        {
            Console.WriteLine($"{Context.GetHttpContext()?.Connection.RemoteIpAddress?.ToString() ?? "unknown"} connected");
            await Clients.Others.SendAsync("Connected", Context.GetHttpContext()?.Connection.RemoteIpAddress?.ToString() ?? "Anonimous");
        }
    }
}
