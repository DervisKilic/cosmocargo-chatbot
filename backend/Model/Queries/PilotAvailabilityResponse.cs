namespace CosmoCargo.Model.Queries
{
    public class PilotAvailabilityResponse
    {
        public bool IsAvailable { get; set; }
        public int ActiveShipments { get; set; }
        public int MaxShipments { get; set; }
    }
}
