using Microsoft.AspNetCore.Mvc;
using Server.Application.Services;
using Server.Domain;
using Server.Responses;

namespace Server.Controllers
{
    [Route("/load")]
    public class UpdateController : Controller
    {
        [HttpGet("chat")]
        public IActionResult LoadChat([FromServices]ChatService chatService)
        {
            return Ok(chatService.Messages.Select(x=>ChatMessageData.ConvertFromMessage(x)));
        }
    }
}
