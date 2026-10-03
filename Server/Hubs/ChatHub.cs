using System.Xml.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Server.Application.Services;
using Server.Domain;
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
        public async Task Send(SendTextMessageReuqest request, [FromServices]AuthenticationService regService)
        {
            var userResult = regService.GetUserById(request.id);
            if (!userResult.Success)
            {
                await Clients.Caller.SendAsync("Warning", "Неверный токен");
                return;
            }
            var message = new Message(userResult.Value!, request.text);
            _chatService.StoreMessage(message);
            await Clients.All.SendAsync("TextMessage", new ChatTextMessageData(message.UserIdentify.Nickname, message.Text, message.Timestamp));
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
