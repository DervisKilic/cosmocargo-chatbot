using CosmoCargo.Model;
using CosmoCargo.Model.Queries;

namespace CosmoCargo.Services
{
    public interface IPilotService
    {
        Task<PaginatedResult<User>> GetAllPilotsAsync(PilotsFilter filter);
        Task<User?> GetPilotByIdAsync(Guid id);
        Task<bool> IsPilotAvailableAsync(Guid pilotId);
        Task<int> GetPilotShipmentCountAsync(Guid pilotId);
        Task UpdatePilotStatusAsync(Guid id, bool isActive);
        Task UpdatePilotAsync(Guid id, string name, string email, string? experience);
        Task<Guid> CreatePilotAsync(string name, string email, string? experience);
    }
} 