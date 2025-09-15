using CosmoCargo.Model;
using CosmoCargo.Services;
using CosmoCargo.Utils;
using System.ComponentModel.DataAnnotations;
using System.Security.Claims;

namespace CosmoCargo.Endpoints
{
    public static class UserEndpoints
    {
        public static async Task<IResult> GetMe(
            IUserService userService,
            ClaimsPrincipal user)
        {
            var userId = user.GetUserId();
            var currentUser = await userService.GetUserByIdAsync(userId);
            if (currentUser == null)
                return Results.NotFound();

            return Results.Ok(new UserResponse
            {
                Id = currentUser.Id,
                Name = currentUser.Name,
                Email = currentUser.Email,
                Role = currentUser.Role,
                Experience = currentUser.Experience,
                IsActive = currentUser.IsActive,
                CreatedAt = currentUser.CreatedAt
            });
        }

        public static async Task<IResult> UpdateMe(
            UpdateUserRequest request,
            IUserService userService,
            ClaimsPrincipal user)
        {
            var userId = user.GetUserId();
            await userService.UpdateUserAsync(userId, request.Name);
            return Results.Ok();
        }
    }

    public class UpdateUserRequest
    {
        [Required]
        [MinLength(3)]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;
    }

    public class UserResponse
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public UserRole Role { get; set; }
        public string? Experience { get; set; }
        public bool? IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
    }
} 