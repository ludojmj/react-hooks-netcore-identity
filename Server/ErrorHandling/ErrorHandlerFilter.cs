using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Server.Models;

namespace Server.ErrorHandling
{
    public class ErrorHandlerFilter : IExceptionFilter
    {
        private readonly ILogger _logger;
        private readonly IWebHostEnvironment _env;

        public ErrorHandlerFilter(ILogger<ErrorHandlerFilter> logger, IWebHostEnvironment env)
        {
            _logger = logger;
            _env = env;
        }

        public void OnException(ExceptionContext context)
        {
            _logger.LogCritical(context.Exception, "Error");
            var msg = context.Exception.InnerException == null
                ? context.Exception.Message
                : context.Exception.InnerException.Message;
            if (context.Exception is NotFoundException )
            {
                context.Result = new NotFoundObjectResult(new ErrorModel { Error = msg });
                return;
            }

            var error = new ErrorModel { Error = _env.IsDevelopment() ? msg : "An error occured. Please try again later." };
            context.Result = new BadRequestObjectResult(error);
        }
    }
}
