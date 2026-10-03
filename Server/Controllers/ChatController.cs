using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Server.Application.Services;
using Server.Domain;
using Server.Hubs;
using Server.Requests;
using Server.Responses;

namespace Server.Controllers
{
    [Route("/send")]
    public class ChatController : Controller
    {
        [HttpPost("text")]
        public async Task<IActionResult> SendMessage([FromBody]SendMessageReuqest request, [FromServices]IHubContext<ChatHub> hubContext, 
            [FromServices]AuthenticationService regService, [FromServices]ChatService chatService)
        {
            var userResult = regService.GetUserById(request.id);
            if (!userResult.Success)
                return BadRequest("Неверный токен");
            var message = new Message(userResult.Value!, request.text);
            chatService.StoreMessage(message);
            await hubContext.Clients.All.SendAsync("NewMessage", ChatMessageData.ConvertFromMessage(message));
            return Ok();
        }
    }
}
