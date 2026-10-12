using System.Xml.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Server.Application.Services;
using Server.Domain;
using Server.Infrastructure;
using Server.Requests;
using Server.Responses;

namespace Server.Hubs
{
    public class ChatHub : Hub
    {
        private readonly AppDbContext _context;
        public ChatHub(AppDbContext context)
        {
            _context = context;
        }
        public async Task Send(SendMessageReuqest request, [FromServices]AuthenticationService regService)
        {
            var userResult = regService.GetUserById(request.id);
            if (!userResult.Success)
            {
                await Clients.Caller.SendAsync("Warning", "Неверный токен");
                return;
            }
            var message = new Message(userResult.Value!, request.text);
            _context.Messages.Add(message);
            _context.SaveChanges();
            await Clients.All.SendAsync("NewMessage", ChatMessageData.ConvertFromMessage(message));
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
