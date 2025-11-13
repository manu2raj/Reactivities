using MediatR;
using Domain;
using Persistence;
using Application.Activities.DTOs;
using AutoMapper;
using FluentValidation;

namespace Application.Activities.Commands
{
    public class CreateActivity
    {
        public class Command : IRequest<string>
        {
            public required CreateActivityDto ActivityDto { get; set; }
        }

        public class Handler(AppDbContext context, IMapper mapper) : IRequestHandler<Command, string>
        {
            public async Task<string> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = mapper.Map<Activity>(request);

                context.Activities.Add(activity);

                await context.SaveChangesAsync(cancellationToken);

                return activity.Id;
            }
        }
    }
}
