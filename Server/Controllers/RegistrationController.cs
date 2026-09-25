using Microsoft.AspNetCore.Mvc;
using Server.Application.Services;

namespace Server.Controllers
{
    public class RegistrationController : Controller
    {
        [HttpGet("/reg")]
        public IActionResult Register(string nickname, bool isSpectator, [FromServices] RegisterService regService)
        {
            Console.WriteLine(nickname);
            var result = regService.Register(nickname, isSpectator);
            Console.WriteLine(nickname);
            if (result.Success)
                return Ok(result.Value);
            Console.WriteLine(nickname);
            return BadRequest(result.ErrorMessage);
        }
    }
}
