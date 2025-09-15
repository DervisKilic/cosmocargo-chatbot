using System.Diagnostics.CodeAnalysis;
using System.Security.Claims;

namespace CosmoCargo.Utils
{
    public static class EndpointExtensions
    {
        public static void Get(this WebApplication app, [StringSyntax("Route")] string pattern, Delegate handler, string[]? roles = null)
        {
            if (roles == null || roles.Length == 0)
            {
                app.MapGet(pattern, handler)
                .RequireAuthorization();
            }
            else
            {
                app.MapGet(pattern, handler)
                   .RequireAuthorization(policy => policy.RequireRole(roles));
            }
        }

        public static void Post(this WebApplication app, [StringSyntax("Route")] string pattern, Delegate handler, string[]? roles = null)
        {
            if (roles == null || roles.Length == 0)
            {
                app.MapPost(pattern, handler)
                   .RequireAuthorization();
            }
            else
            {
                app.MapPost(pattern, handler)
                   .RequireAuthorization(policy => policy.RequireRole(roles));
            }
        }

        public static void Put(this WebApplication app, [StringSyntax("Route")] string pattern, Delegate handler, string[]? roles = null)
        {
            if (roles == null || roles.Length == 0)
            {
                app.MapPut(pattern, handler)
                   .RequireAuthorization();
            }
            else
            {
                app.MapPut(pattern, handler)
                   .RequireAuthorization(policy => policy.RequireRole(roles));
            }
        }

        public static void PostAnonymous(this WebApplication app, [StringSyntax("Route")] string pattern, Delegate handler)
        {
            app.MapPost(pattern, handler);
        }

        public static void GetAnonymous(this WebApplication app, [StringSyntax("Route")] string pattern, Delegate handler)
        {
            app.MapGet(pattern, handler);
        }
    }
}
