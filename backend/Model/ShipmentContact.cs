using Microsoft.EntityFrameworkCore;

namespace CosmoCargo.Model
{
    public class ShipmentContact
    {
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Planet { get; set; } = string.Empty;
        public string Station { get; set; } = string.Empty;
    }
} 