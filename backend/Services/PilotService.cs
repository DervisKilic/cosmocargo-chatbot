using CosmoCargo.Data;
using CosmoCargo.Model;
using CosmoCargo.Model.Exceptions;
using CosmoCargo.Model.Queries;
using Microsoft.EntityFrameworkCore;

namespace CosmoCargo.Services
{
    public class PilotService : IPilotService
    {
        private readonly AppDbContext _context;

        public PilotService(AppDbContext context)
        {
            _context = context;
        }

        private IQueryable<User> ApplyFilter(PilotsFilter filter)
        {
            var query = _context.Users
                .Where(u => u.Role == UserRole.Pilot)
                .AsQueryable();

            if (!string.IsNullOrEmpty(filter.Search))
            {
                query = query.Where(p =>
                    p.Name.Contains(filter.Search) ||
                    p.Email.Contains(filter.Search));
            }

            if (filter.IsActive.HasValue)
            {
                query = query.Where(p => p.IsActive == filter.IsActive.Value);
            }

            return query;
        }

        public async Task<PaginatedResult<User>> GetAllPilotsAsync(PilotsFilter filter)
        {
            var query = ApplyFilter(filter);
            
            var totalCount = await query.CountAsync();
            
            var pilots = await query
                .OrderBy(p => p.Name)
                .Skip((filter.Page - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToListAsync();

            return new PaginatedResult<User>(
                pilots,
                totalCount,
                filter.Page,
                filter.PageSize
            );
        }

        public async Task<User?> GetPilotByIdAsync(Guid id)
        {
            return await _context.Users
                .FirstOrDefaultAsync(u => u.Id == id && u.Role == UserRole.Pilot);
        }

        public async Task<bool> IsPilotAvailableAsync(Guid pilotId)
        {
            var activeShipments = await _context.Shipments
                .CountAsync(s => s.PilotId == pilotId && 
                                (s.Status == ShipmentStatus.Approved || 
                                 s.Status == ShipmentStatus.InTransit));

            return activeShipments < 3;
        }

        public async Task<int> GetPilotShipmentCountAsync(Guid pilotId)
        {
            return await _context.Shipments
                .CountAsync(s => s.PilotId == pilotId && 
                               (s.Status == ShipmentStatus.Approved || 
                                 s.Status == ShipmentStatus.InTransit));
        }

        public async Task UpdatePilotStatusAsync(Guid id, bool isActive)
        {
            var pilot = await _context.Users
                .FirstOrDefaultAsync(u => u.Id == id && u.Role == UserRole.Pilot);
                
            if (pilot == null)
                throw new NotFoundException("Pilot", id.ToString());
                
            pilot.IsActive = isActive;
            pilot.UpdatedAt = DateTime.UtcNow;
            
            await _context.SaveChangesAsync();
        }

        public async Task UpdatePilotAsync(Guid id, string name, string email, string? experience)
        {
            var pilot = await _context.Users
                .FirstOrDefaultAsync(u => u.Id == id && u.Role == UserRole.Pilot);
                
            if (pilot == null)
                throw new NotFoundException("Pilot", id.ToString());
                
            pilot.Name = name;
            pilot.Email = email;
            pilot.Experience = experience;
            pilot.UpdatedAt = DateTime.UtcNow;
            
            await _context.SaveChangesAsync();
        }

        public async Task<Guid> CreatePilotAsync(string name, string email, string? experience)
        {
            var pilot = new User
            {
                Id = Guid.NewGuid(),
                Name = name,
                Email = email,
                Experience = experience,
                Role = UserRole.Pilot,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            
            _context.Users.Add(pilot);
            await _context.SaveChangesAsync();
            return pilot.Id;
        }
    }
}
