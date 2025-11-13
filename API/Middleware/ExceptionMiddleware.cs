
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace API.Middleware
{
    public class ExceptionMiddleware : IMiddleware
    {
        public async Task InvokeAsync(HttpContext context, RequestDelegate next)
        {
            try
            {
                // Pass control to the next middleware in the pipeline and await its completion.
                // Awaiting here ensures any exceptions thrown by downstream middleware or the request
                // handling logic bubble up to this try/catch so they can be translated into a
                // consistent HTTP response (e.g., validation errors -> 400). Do not omit `await`
                // — calling `next(context)` without awaiting can hide exc
                await next(context);    
            }
            catch (FluentValidation.ValidationException ex)
            {
                await HandleValidationException(context, ex);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
            }
        }

        private static async Task HandleValidationException(HttpContext context, FluentValidation.ValidationException ex)
        {
            var validationErrors = new Dictionary<string, string[]>();

            if (ex.Errors  is not null)
            {
                foreach (var error in ex.Errors) 
                {
                    if (validationErrors.TryGetValue(error.PropertyName, out var existingError))
                    {
                        validationErrors[error.PropertyName] = [.. existingError, error.ErrorMessage];  // same as existingError.Append(error.ErrorMessage).ToArray()
                    }
                    else
                    {
                        validationErrors[error.PropertyName] = [error.ErrorMessage];  // same as new[] { error.ErrorMessage };
                    }
                }
            }

            context.Response.StatusCode = StatusCodes.Status400BadRequest;

            var validationProblemDetails = new ValidationProblemDetails(validationErrors)
            {
                Status = StatusCodes.Status400BadRequest,
                Type = "ValidationFailure",
                Title = "Validation Error",
                Detail = "One or more validation errors has occurred"
            };

            await context.Response.WriteAsJsonAsync(validationProblemDetails);
        }
    }
}
