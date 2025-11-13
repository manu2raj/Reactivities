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
                .WithMessage("Title is required")
                .MaximumLength(100).WithMessage("Title must not exceed 100 characters");

            // Ensure the Description of the activity is provided.
            RuleFor(x => x.ActivityDto.Description)
                .NotEmpty()
                .WithMessage("Description is required");

            RuleFor(x => x.ActivityDto.Date)
                .GreaterThan(DateTime.UtcNow).WithMessage("Date must be in the future");

            // Ensure the Category of the activity is provided.
            RuleFor(x => x.ActivityDto.Category)
                .NotEmpty()
                .WithMessage("Category is required");

            // Ensure the City of the activity is provided.
            RuleFor(x => x.ActivityDto.City)
                .NotEmpty()
                .WithMessage("City is required");

            // Ensure the Venue of the activity is provided.
            RuleFor(x => x.ActivityDto.Venue)
                .NotEmpty()
                .WithMessage("Venue is required");

            // Ensure the Latitue of the activity is provided.
            RuleFor(x => x.ActivityDto.Latitude)
                .NotEmpty()
                .WithMessage("Latitude is required")
                .InclusiveBetween(-90,90)
                .WithMessage("Latitude must be in between -90 and 90");

            // Ensure the Longitude of the activity is provided.
            RuleFor(x => x.ActivityDto.Longitude)
                .NotEmpty()
                .WithMessage("Longitude is required")
                .InclusiveBetween(-180, 180)
                .WithMessage("Longiture must be in between -180 and 180");
        }
    }
}
