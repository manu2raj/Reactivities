
using Application.Core;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using System.Text.Json;

namespace API.Middleware
{
    /// <summary>
    /// Middleware that captures exceptions thrown by downstream middleware and request handlers,
    /// translates them into consistent JSON HTTP responses, and logs server errors.
    /// </summary>
    /// <remarks>
    /// - Registered as an <see cref="IMiddleware"/> so instances can be dependency-injected.
    /// - Handles FluentValidation.ValidationException specially to return a 400 with
    ///   <see cref="ValidationProblemDetails"/> populated with individual property errors.
    /// - All other exceptions are logged and translated into a 500 response containing an
    ///   <see cref="AppException"/> payload (with stack trace included only in development).
    /// - Important: <see cref="InvokeAsync"/> awaits <c>next(context)</c> so downstream exceptions
    ///   propagate into this middleware's try/catch. Calling <c>next(context)</c> without awaiting
    ///   can hide exceptions and must be avoided.
    /// </remarks>
    /// <param name="logger">Logger used to record server-side errors.</param>
    /// <param name="env">Host environment used to determine if detailed errors should be returned.</param>
    public class ExceptionMiddleware(ILogger<Exception> logger, IHostEnvironment env) : IMiddleware
    {
        /// <summary>
        /// Invoked by the ASP.NET pipeline for each request.
        /// Wraps the remainder of the pipeline in a try/catch to translate exceptions.
        /// </summary>
        /// <param name="context">HTTP context for the current request.</param>
        /// <param name="next">Delegate to execute the next middleware in the pipeline.</param>
        /// <returns>A <see cref="Task"/> representing the asynchronous operation.</returns>
        public async Task InvokeAsync(HttpContext context, RequestDelegate next)
        {
            try
            {
                // Pass control to the next middleware in the pipeline and await its completion.
                // Awaiting here ensures any exceptions thrown by downstream middleware or the request
                // handling logic bubble up to this try/catch so they can be translated into a
                // consistent HTTP response (e.g., validation errors -> 400). Do not omit `await`
                // — calling `next(context)` without awaiting can hide exceptions thrown later in the pipeline.
                await next(context);
            }
            catch (FluentValidation.ValidationException ex)
            {
                // Translate validation exceptions to a 400 with ValidationProblemDetails.
                await HandleValidationException(context, ex);
            }
            catch (Exception ex)
            {
                // Handle all other exceptions as internal server errors.
                await HandleException(context, ex);
            }
        }

        /// <summary>
        /// Handles unexpected exceptions by logging and returning an <see cref="AppException"/> JSON payload.
        /// </summary>
        /// <param name="context">Current HTTP context.</param>
        /// <param name="ex">The exception that was thrown.</param>
        /// <returns>A task that completes when the response has been written.</returns>
        private async Task HandleException(HttpContext context, Exception ex)
        {
            logger.LogError(ex, ex.Message);
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = StatusCodes.Status500InternalServerError;

            // Only include stack trace when running in development to avoid leaking internals.
            var response = env.IsDevelopment() ?
                new AppException(context.Response.StatusCode, ex.Message, ex.StackTrace)
                : new AppException(context.Response.StatusCode, ex.Message, null);

            var options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };

            var json = JsonSerializer.Serialize(response, options);

            await context.Response.WriteAsync(json);
        }

        /// <summary>
        /// Converts FluentValidation validation exceptions into a 400 response with a
        /// <see cref="ValidationProblemDetails"/> body mapping property names to error messages.
        /// </summary>
        /// <param name="context">Current HTTP context.</param>
        /// <param name="ex">The validation exception containing one or more failures.</param>
        /// <returns>A task that completes when the response has been written.</returns>
        private static async Task HandleValidationException(HttpContext context, FluentValidation.ValidationException ex)
        {
            var validationErrors = new Dictionary<string, string[]>();

            if (ex.Errors is not null)
            {
                foreach (var error in ex.Errors)
                {
                    if (validationErrors.TryGetValue(error.PropertyName, out var existingError))
                    {
                        // Append the new error message to the existing array for this property.
                        validationErrors[error.PropertyName] = [.. existingError, error.ErrorMessage];  // same as existingError.Append(error.ErrorMessage).ToArray()
                    }
                    else
                    {
                        // First error for this property.
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
