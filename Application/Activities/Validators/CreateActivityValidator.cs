using Application.Activities.Commands;
using FluentValidation;

namespace Application.Activities.Validators
{

    /// <summary>
    /// Validator for the <see cref="CreateActivity.Command"/> request.
    /// </summary>
    /// <remarks>
    /// Validates the properties of the enclosed <see cref="CreateActivityDto"/> instance.
    /// Currently enforces:
    /// - <see cref="CreateActivityDto.Title"/> must not be empty.
    /// - <see cref="CreateActivityDto.Description"/> must not be empty.
    /// Implemented using the <see cref="FluentValidation.AbstractValidator{T}"/> base class.
    /// </remarks>
    /// <seealso cref="CreateActivity.Command"/>
    /// <seealso cref="CreateActivityDto"/>
    public class CreateActivityValidator : AbstractValidator<CreateActivity.Command>
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="CreateActivityValidator"/> class
        /// and registers the validation rules for the request DTO.
        /// </summary>
        public CreateActivityValidator()
        {
            // Ensure the Title of the activity is provided.
            RuleFor(x => x.ActivityDto.Title)
                .NotEmpty()
                .WithMessage("Title is required");

            // Ensure the Description of the activity is provided.
            RuleFor(x => x.ActivityDto.Description)
                .NotEmpty()
                .WithMessage("Description is required");
        }
    }
}
