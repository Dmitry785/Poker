using System.Xml.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Server.Application.Services;
using Server.Requests;
using Server.Responses;

namespace Server.Hubs
{
    public class ChatHub : Hub
    {
        private ChatService _chatService;
        public ChatHub([FromServices]ChatService chatService)
        {
            _chatService = chatService;
        }
        public async Task Send(SendReuqest request, [FromServices]RegisterService regService)
        {
            var result = regService.GetUserRegisterInfoById(request.Id);
            if (!result.Success)
            {
                await Clients.Caller.SendAsync("Warning", "Неверный токен");
                return;
            }
            _chatService.StoreMessage(result.Value!.Nickname, request.Message);
            Console.WriteLine(request.Message);
            await Clients.All.SendAsync("NewMessage", new ChatMessageData(result.Value!.Nickname, request.Message));
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
