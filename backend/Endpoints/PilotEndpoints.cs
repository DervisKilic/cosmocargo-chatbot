using CosmoCargo.Model;
using CosmoCargo.Model.Queries;
using CosmoCargo.Services;
using CosmoCargo.Utils;
using System.Security.Claims;

namespace CosmoCargo.Endpoints
{
    public static class PilotEndpoints
    {
        public static async Task<IResult> GetPilots(
            [AsParameters] PilotsFilter filter,
            IPilotService pilotService,
            ClaimsPrincipal user)
        {
            var role = user.GetRole();
            if (role != UserRole.Admin.ToString())
                return Results.Forbid();

            var pilots = await pilotService.GetAllPilotsAsync(filter);
            return Results.Ok(pilots);
        }

        public static async Task<IResult> GetPilotById(
            Guid id,
            IPilotService pilotService,
            ClaimsPrincipal user)
        {
            var role = user.GetRole();
            if (role != UserRole.Admin.ToString())
                return Results.Forbid();

            var pilot = await pilotService.GetPilotByIdAsync(id);
            if (pilot == null)
                return Results.NotFound();

            return Results.Ok(pilot);
        }

        public static async Task<IResult> GetPilotAvailability(
            Guid id,
            IPilotService pilotService,
            ClaimsPrincipal user)
        {
            var role = user.GetRole();
            if (role != UserRole.Admin.ToString())
                return Results.Forbid();

            var pilot = await pilotService.GetPilotByIdAsync(id);
            if (pilot == null)
                return Results.NotFound();

            var isAvailable = await pilotService.IsPilotAvailableAsync(id);
            var activeShipments = await pilotService.GetPilotShipmentCountAsync(id);
            
            return Results.Ok(new PilotAvailabilityResponse
            {
                IsAvailable = isAvailable,
                ActiveShipments = activeShipments,
                MaxShipments = 3
            });
        }

        public static async Task<IResult> UpdatePilotStatus(
            Guid id,
            UpdatePilotStatusRequest request,
            IPilotService pilotService)
        {
            await pilotService.UpdatePilotStatusAsync(id, request.IsActive);
            return Results.Ok();
        }

        public static async Task<IResult> UpdatePilot(
            Guid id,
            UpdatePilotRequest request,
            IPilotService pilotService)
        {
            await pilotService.UpdatePilotAsync(id, request.Name, request.Email, request.Experience);
            return Results.Ok();
        }

        public static async Task<IResult> CreatePilot(
            CreatePilotRequest request,
            IPilotService pilotService)
        {
            var id = await pilotService.CreatePilotAsync(request.Name, request.Email, request.Experience);
            return Results.Ok(id);
        }
    }

    public class UpdatePilotStatusRequest
    {
        public bool IsActive { get; set; }
    }

    public class UpdatePilotRequest
    {
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Experience { get; set; }
    }

    public class CreatePilotRequest
    {
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Experience { get; set; }
    }
} 