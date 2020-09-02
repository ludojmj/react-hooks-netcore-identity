using System;
using System.Linq;
using Microsoft.AspNetCore.Mvc.Filters;

namespace Server.Shared
{
    public class ModelValidationFilter : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext context)
        {
            if (!context.ModelState.IsValid)
            {
                foreach (var err in context.ModelState.Values.SelectMany(value => value.Errors))
                {
                    throw new ArgumentException(err.ErrorMessage);
                }
            }

            base.OnActionExecuting(context);
        }
    }
}
