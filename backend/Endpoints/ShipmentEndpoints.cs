using CosmoCargo.Model;
using CosmoCargo.Model.Queries;
using CosmoCargo.Services;
using CosmoCargo.Utils;
using System.Security.Claims;
namespace CosmoCargo.Endpoints
{
    public static class ShipmentEndpoints
    {
        public static async Task<IResult> GetShipments(
            IShipmentService shipmentService,
            [AsParameters] ShipmentsFilter filter,
            ClaimsPrincipal user)
        {
            var role = user.GetRole();
            var userId = user.GetUserId();

            PaginatedResult<Shipment> result;

            if (role == UserRole.Admin.ToString())
                result = await shipmentService.GetShipmentsAsync(filter);
            else if (role == UserRole.Pilot.ToString())
                result = await shipmentService.GetShipmentsByPilotIdAsync(userId, filter);
            else if (role == UserRole.Customer.ToString())
                result = await shipmentService.GetShipmentsByCustomerIdAsync(userId, filter);
            else
                return Results.Forbid();

            return Results.Ok(result);
        }

        public static async Task<IResult> GetShipmentById(
            Guid id,
            IShipmentService shipmentService,
            ClaimsPrincipal user)
        {
            var shipment = await shipmentService.GetShipmentByIdAsync(id);
            if (shipment == null)
                return Results.NotFound();

            var role = user.GetRole();
            var userId = user.GetUserId();

            if (role == UserRole.Admin.ToString())
                return Results.Ok(shipment);
            else if (role == UserRole.Pilot.ToString() && shipment.PilotId == userId)
                return Results.Ok(shipment);
            else if (role == UserRole.Customer.ToString() && shipment.CustomerId == userId)
                return Results.Ok(shipment);

            return Results.NotFound();
        }

        public static async Task<IResult> CreateShipment(
            CreateShipmentRequest request,
            IShipmentService shipmentService,
            ClaimsPrincipal user)
        {
            var userId = user.GetUserId();

            var shipment = new Shipment
            {
                Id = Guid.NewGuid(),
                CustomerId = userId,
                Sender = new ShipmentContact
                {
                    Name = request.Origin.Name,
                    Email = request.Origin.Email,
                    Planet = request.Origin.Planet,
                    Station = request.Origin.Station
                },
                Receiver = new ShipmentContact
                {
                    Name = request.Destination.Name,
                    Email = request.Destination.Email,
                    Planet = request.Destination.Planet,
                    Station = request.Destination.Station
                },
                Weight = request.Weight,
                Category = request.Category,
                Priority = request.Priority,
                Description = request.Description,
                HasInsurance = request.HasInsurance,
            };

            var createdShipment = await shipmentService.CreateShipmentAsync(shipment);
            return Results.Created($"/api/shipments/{createdShipment.Id}", createdShipment);
        }

        public static async Task<IResult> UpdateShipmentStatus(
            Guid id,
            UpdateShipmentStatusRequest request,
            IShipmentService shipmentService,
            ClaimsPrincipal user)
        {
            var role = user.GetRole();
            var userId = user.GetUserId();

            var shipment = await shipmentService.GetShipmentByIdAsync(id);
            if (shipment == null)
                return Results.NotFound();

            if (role == UserRole.Pilot.ToString() && shipment.PilotId != userId)
                return Results.Forbid();

            var updatedShipment = await shipmentService.UpdateShipmentStatusAsync(id, request.Status);
            if (updatedShipment == null)
                return Results.NotFound();

            return Results.Ok(updatedShipment);
        }

        public static async Task<IResult> AssignPilot(
            Guid id,
            AssignPilotRequest request,
            IShipmentService shipmentService,
            ClaimsPrincipal user)
        {
            var role = user.GetRole();
            if (role != UserRole.Admin.ToString())
                return Results.Forbid();

            var updatedShipment = await shipmentService.AssignPilotAsync(id, request.PilotId);
            if (updatedShipment == null)
                return Results.NotFound();

            return Results.Ok(updatedShipment);
        }
    }

    public class LocationDto
    {
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Planet { get; set; } = string.Empty;
        public string Station { get; set; } = string.Empty;
    }

    public class CreateShipmentRequest
    {
        public LocationDto Origin { get; set; } = new();
        public LocationDto Destination { get; set; } = new();
        public decimal Weight { get; set; }
        public string Category { get; set; } = string.Empty;
        public string Priority { get; set; } = string.Empty;
        public string? Description { get; set; }
        public bool HasInsurance { get; set; }
    }

    public class UpdateShipmentStatusRequest
    {
        public ShipmentStatus Status { get; set; }
    }

    public class AssignPilotRequest
    {
        public Guid PilotId { get; set; }
    }
}
