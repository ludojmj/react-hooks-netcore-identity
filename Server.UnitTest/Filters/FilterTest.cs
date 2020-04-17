using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Abstractions;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;
using Server.ErrorHandling;

namespace Server.UnitTest.Filters
{
    public class FilterTest
    {
        [Fact]
        public void ModelValidationFilter_ShouldThrowArgumentException_IfModelIsInvalid()
        {
            // Arrange
            var validationFilter = new ModelValidationFilter();
            var modelState = new ModelStateDictionary();
            modelState.AddModelError("year", "invalid");

            var actionContext = new ActionContext(
                Mock.Of<HttpContext>(),
                Mock.Of<RouteData>(),
                Mock.Of<ActionDescriptor>(),
                modelState
            );
            var actionExecutingContext = new ActionExecutingContext(
                actionContext,
                new List<IFilterMetadata>(),
                new Dictionary<string, object>(),
                Mock.Of<Controller>()
            );

            // Act
            var exception = Record.Exception(() => validationFilter.OnActionExecuting(actionExecutingContext));

            // Assert
            Assert.IsType<ArgumentException>(exception);
            Assert.Equal("invalid", exception.Message);
        }

        [Fact]
        public void ErrorHandlerFilter_ShouldThrowException_IfIForgotSomething()
        {
            // Arrange
            var mockErrLogger = Mock.Of<ILogger<ErrorHandlerFilter>>();
            var mockEnv = Mock.Of<IWebHostEnvironment>(x => x.ContentRootPath == string.Empty);
            var errorFilter = new ErrorHandlerFilter(mockErrLogger, mockEnv);

            var actionContext = new ActionContext(
                Mock.Of<HttpContext>(),
                Mock.Of<RouteData>(),
                Mock.Of<ActionDescriptor>(),
                Mock.Of<ModelStateDictionary>()
            );

            var exceptionContext = new ExceptionContext(actionContext, Mock.Of<List<IFilterMetadata>>())
            {
                Exception = Mock.Of<Exception>()
            };

            // Act
            errorFilter.OnException(exceptionContext);

            // Assert
            Assert.IsType<BadRequestObjectResult>(exceptionContext.Result);
        }
    }
}
