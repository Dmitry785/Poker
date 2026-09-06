using System.Xml.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Server.Application.Services;

namespace Server.Hubs
{
    public class ChatHub : Hub
    {
        public async Task Send(string message, [FromServices]RegisterService regService, [FromServices] ChatHistoryService chatService)
        {
            string ip = Context.GetHttpContext()?.Connection.RemoteIpAddress?.ToString() ?? "unknown";
            if (!chatService.CanSend(ip))
            {
                await Clients.Caller.SendAsync("Warning", "Too fast");
                return;
            }
            chatService.UpdateLastSend(ip);
            string name = ip == "unknown" ? "Anonimous" : (regService.GetNameByIp(ip) ?? "Anonimous");
            chatService.StoreMessage(name, message);
            await Clients.All.SendAsync("Receive", name, message);
        }
        public override async Task OnConnectedAsync()
        {
            await Clients.Others.SendAsync("Connected", Context.GetHttpContext()?.Connection.RemoteIpAddress?.ToString() ?? "Anonimous");
        }
        public async Task LoadAllMessages([FromServices]ChatHistoryService chatService)
        {
            Console.WriteLine("LoadAllMessages");
            await Clients.Caller.SendAsync("AllMessages", chatService.GetAllMessages());
        }
    }
}
