using Microsoft.AspNetCore.Mvc;
using Server.Application.Services;
using Server.Requests;

namespace Server.Controllers
{
    public class AuthenticationController : Controller
    {
        [HttpGet("/reg")]
        public IActionResult Register(RegisterRequest request, [FromServices] AuthenticationService regService)
        {
            var result = regService.Register(request.nickname, request.password, request.isSpectator);
            if (result.Success)
                return Ok(result.Value);
            return BadRequest(result.ErrorMessage);
        }
        public IActionResult Login(LoginRequest request, [FromServices]AuthenticationService regService)
        {
            var result = regService.Login(request.nickname, request.password);
            if (result.Success)
                return Ok(result.Value);
            return BadRequest(result.ErrorMessage);
        }
    }
}
