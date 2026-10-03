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
        public async Task<IActionResult> SendTextMessage([FromBody]SendTextMessageReuqest request, [FromServices]IHubContext<ChatHub> hubContext, 
            [FromServices]AuthenticationService regService, [FromServices]ChatService chatService)
        {
            var userResult = regService.GetUserById(request.id);
            if (!userResult.Success)
                return BadRequest("Неверный токен");
            var message = new Message(userResult.Value!, request.text);
            chatService.StoreMessage(message);
            await hubContext.Clients.All.SendAsync("TextMessage", new ChatTextMessageData(message.UserIdentify.Nickname, message.Text, message.Timestamp));
            return Ok();
        }
        [HttpPost("picture")]
        public async Task<IActionResult> SendPictureMessage([FromBody]SendFileMessageReuqest request, 
            [FromServices]IHubContext<ChatHub> hubContext, 
            [FromServices]AuthenticationService regService,
            [FromServices]ChatService chatService)
        {
            var user = regService.GetUserById(request.id);
            if (!user.Success)
                return BadRequest("Неверный токен");
            if (request.formFile == null || request.formFile.Length == 0)
                return BadRequest("Нет файла");
            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "Static", $"{Guid.NewGuid()}_{DateTime.Now.ToFileTimeUtc()}.jpg");
            using(FileStream fs = new FileStream(filePath, FileMode.Create))
            {
                await request.formFile.CopyToAsync(fs);
            }
            var message = new Message(user.Value!, request.text);
            message.AttachFile(filePath, MessageFileType.Picture);
            chatService.StoreMessage(message);
            await hubContext.Clients.All.SendAsync("FileMessage", new ChatFileMessageData(message.UserIdentify.Nickname, request.text,
                message.File!.FileUrl, Message.FileTypeToString(message.File!.FileType), message.Timestamp));
            return Ok();
        }
    }
}
