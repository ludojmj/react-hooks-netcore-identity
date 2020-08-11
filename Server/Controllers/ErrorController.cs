using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;
using Server.Models;
using Server.ErrorHandling;

namespace Server.Controllers
{
    [Route("api/[controller]")]
    [ApiExplorerSettings(IgnoreApi = true)]
    public class ErrorController : ControllerBase
    {
        private readonly IWebHostEnvironment _env;

        public ErrorController(IWebHostEnvironment env)
        {
            _env = env;
        }

        public IActionResult Error()
        {
            var context = HttpContext.Features.Get<IExceptionHandlerFeature>();
            if (context == null)
            {
                return Ok();
            }

            var exception = context.Error;
            var msg = exception.InnerException == null
                ? exception.Message
                : exception.InnerException.Message;

            if (exception is NotFoundException)
            {
                return new NotFoundObjectResult(new ErrorModel { Error = msg });
            }

            var error = new ErrorModel { Error = _env.IsDevelopment() ? msg : "An error occured. Please try again later." };
            return new BadRequestObjectResult(error);
        }
    }
}
