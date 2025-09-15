using CosmoCargo.Data;
using CosmoCargo.Model;
using CosmoCargo.Model.Exceptions;
using Microsoft.EntityFrameworkCore;

namespace CosmoCargo.Services
{
    public class UserService : IUserService
    {
        private readonly AppDbContext _context;

        public UserService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<User?> GetUserByIdAsync(Guid id)
        {
            return await _context.Users.FindAsync(id);
        }

        public async Task<User?> GetUserByEmailAsync(string email)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task<bool> ValidateUserCredentialsAsync(string email, string password)
        {
            var user = await GetUserByEmailAsync(email);
            if (user == null)
                return false;

            return Utils.Crypto.HashPassword(password) == user.PasswordHash;
        }

        public async Task<User?> UpdateUserAsync(Guid id, string name)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
                throw new NotFoundException("User", id.ToString());

            user.Name = name;
            await _context.SaveChangesAsync();

            return user;
        }
    }
}
