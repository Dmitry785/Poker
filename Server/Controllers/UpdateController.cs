using Microsoft.AspNetCore.Mvc;
using Server.Application.Services;
using Server.Responses;

namespace Server.Controllers
{
    public class UpdateController : Controller
    {
        [HttpGet("/load/chat")]
        public IActionResult LoadChat([FromServices]ChatService chatService)
        {
            return Ok(chatService.Messages.Select(x=>new ChatTextMessageData(x.UserIdentify.Nickname, x.Text, x.Timestamp)));
        }
    }
}
