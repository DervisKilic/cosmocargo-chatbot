using System.Text.Json.Serialization;

namespace CosmoCargo.Model
{
    public class User
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public UserRole Role { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Pilot-specific properties
        public string? Experience { get; set; } = null;
        public bool? IsActive { get; set; } = null;
        
        // Navigation properties
        public virtual ICollection<Shipment>? CustomerShipments { get; set; }
        public virtual ICollection<Shipment>? PilotShipments { get; set; }
    }
}
