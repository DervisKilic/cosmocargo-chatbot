namespace CosmoCargo.Model
{
    public class Shipment
    {
        public Guid Id { get; set; }
        public Guid CustomerId { get; set; }
        public Guid? PilotId { get; set; }
        public ShipmentContact Sender { get; set; } = new();
        public ShipmentContact Receiver { get; set; } = new();
        
        // Package information
        public decimal Weight { get; set; }
        public string Category { get; set; } = string.Empty;
        public string Priority { get; set; } = string.Empty;
        public string? Description { get; set; }
        public bool HasInsurance { get; set; }
        
        // Status and tracking
        public ShipmentStatus Status { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        // Navigation properties
        public virtual User Customer { get; set; } = null!;
        public virtual User? Pilot { get; set; }
    }
}
