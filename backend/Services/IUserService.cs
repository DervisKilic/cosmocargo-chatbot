using CosmoCargo.Model;

namespace CosmoCargo.Services
{
    public interface IUserService
    {
        Task<User?> GetUserByIdAsync(Guid id);
        Task<User?> GetUserByEmailAsync(string email);
        Task<bool> ValidateUserCredentialsAsync(string email, string password);
        Task<User?> UpdateUserAsync(Guid id, string name);
    }
} 