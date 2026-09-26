using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Server.Application.Services;
using Server.Hubs;
using Server.Requests;
using Server.Responses;

namespace Server.Controllers
{
    public class ChatController : Controller
    {
        public async Task<IActionResult> SendMessage(SendTextMessageReuqest request, IHubContext<ChatHub> hubContext, 
            [FromServices]RegisterService regService, [FromServices]ChatService chatService)
        {
            var result = regService.GetUserRegisterInfoById(request.Id);
            if (!result.Success)
                return BadRequest("Неверный токен");
            var message = chatService.StoreTextMessage(result.Value!, request.Message);
            await hubContext.Clients.All.SendAsync("NewMessage", new ChatMessageData(message.UserIdentify.Nickname, message.Text, message.Timestamp));
            return Ok();
        }
    }
}
