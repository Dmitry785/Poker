using Microsoft.AspNetCore.Mvc;
using Server.Application.Services;

namespace Server.Controllers
{
    public class RegistrationController : Controller
    {
        [HttpGet("/reg")]
        public IActionResult Register(string nickname, bool isSpectator, [FromServices]RegisterService regService)
        {
            var result = regService.Register(nickname, isSpectator);
            if (result.Success)
                return Ok(result.Value);
            return BadRequest(result.ErrorMessage);
        }
    }
}
