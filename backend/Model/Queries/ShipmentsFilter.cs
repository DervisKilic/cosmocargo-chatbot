using System.Reflection;

namespace CosmoCargo.Model.Queries
{
    public class ShipmentsFilter : PaginationParams
    {
        public string? Search { get; set; }
        public ShipmentStatus? Status { get; set; }
    }
}
