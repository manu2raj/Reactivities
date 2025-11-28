using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Persistence
{
    public class AppDbContext(DbContextOptions options) : IdentityDbContext<User>(options)
    {
        public required DbSet<Activity> Activities { get; set; }

        public DbSet<ActivityAttendee> ActivityAttendees { get; set; }

        /* 
        Pseudocode / Plan (step-by-step):
        1. Provide a clear, detailed comment block describing the purpose of the OnModelCreating override:
           - Explain that it configures the join entity ActivityAttendee.
           - State the composite primary key and the two relationships (to User and to Activity).
        2. Use fluent API to configure the ActivityAttendee entity in a single, grouped lambda:
           - Set composite primary key on (ActivityId, UserId).
           - Configure the relationship from ActivityAttendee to User:
               a. ActivityAttendee.HasOne(a => a.User)
               b. .WithMany(u => u.Activities)
               c. .HasForeignKey(a => a.UserId)
               d. Add an explicit DeleteBehavior and a comment explaining the choice.
           - Configure the relationship from ActivityAttendee to Activity:
               a. ActivityAttendee.HasOne(a => a.Activity)
               b. .WithMany(act => act.Attendees)
               c. .HasForeignKey(a => a.ActivityId)
               d. Add an explicit DeleteBehavior and a comment.
        3. Keep the call to base.OnModelCreating(builder).
        4. Provide XML documentation for the method and inline comments for each configuration line so other developers understand intent.
        */

        /**
         <summary>
         Configures EF Core model mappings for the application's domain types.
         
         Specifically configures the many-to-many join entity <c>ActivityAttendee</c>:
         - Declares a composite primary key composed of <c>ActivityId</c> and <c>UserId</c>.
         - Configures the relationship between <c>ActivityAttendee</c> and <c>User</c>:
           Each ActivityAttendee references one User; a User can participate in many activities.
         - Configures the relationship between <c>ActivityAttendee</c> and <c>Activity</c>:
           Each ActivityAttendee references one Activity; an Activity can have many attendees.
         
         Note: Using explicit join entity mapping (rather than EF Core implicit many-to-many)
         allows additional properties on <c>ActivityAttendee</c> (e.g. IsHost, JoinedAt).
         </summary>
        */
        protected override void OnModelCreating(ModelBuilder builder)
        {
            // Preserve Identity configuration
            base.OnModelCreating(builder);

            // Configure the join entity 'ActivityAttendee' in one place for clarity.
            builder.Entity<ActivityAttendee>(entity =>
            {
                // Composite primary key ensures uniqueness per (ActivityId, UserId).
                entity.HasKey(a => new { a.ActivityId, a.UserId });

                /*
                // Relationship: ActivityAttendee -> User (many ActivityAttendees to one User)
                // - ActivityAttendee.User is the navigation to the principal.
                // - User.Activities is the collection navigation back to ActivityAttendee entries.
                // - HasForeignKey ensures UserId is the FK column.
                // - DeleteBehavior.Cascade will remove join rows when the principal is deleted.
                //   Use Restrict/SetNull if you want different semantics; choose based on domain rules.
                */
                entity.HasOne(a => a.User)
                      .WithMany(u => u.Activities)
                      .HasForeignKey(a => a.UserId);
                //.OnDelete(DeleteBehavior.Cascade);
                /*
                // Relationship: ActivityAttendee -> Activity (many ActivityAttendees to one Activity)
                // - ActivityAttendee.Activity is the navigation to the principal Activity.
                // - Activity.Attendees is the collection navigation back to ActivityAttendee entries.
                // - HasForeignKey ensures ActivityId is the FK column.
                */
                entity.HasOne(a => a.Activity)
                      .WithMany(act => act.Attendees)
                      .HasForeignKey(a => a.ActivityId);
                      //.OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}
