using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace Server.Controllers
{
    public class HomeController : Controller
    {
        [HttpGet("/")]
        public IActionResult Index()
        {
            return Ok("Hello");
        }
    }
}
