using Microsoft.AspNetCore.Mvc;
using Server.Application.Services;

namespace Server.Controllers
{
    public class RegistrationController : Controller
    {
        [HttpGet("/reg")]
        public IActionResult Register(string nickname, [FromServices]RegisterService regService)
        {
            string? ip = Request.HttpContext.Connection.RemoteIpAddress?.ToString();
            if (ip is null)
                return BadRequest();
            regService.Register(ip, nickname);
            return Ok();
        }
    }
}
