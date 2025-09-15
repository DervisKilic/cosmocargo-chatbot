namespace CosmoCargo.Endpoints
{
    public static class HealthcheckEndpoints
    {
        public static IResult Ping()
        {
            return Results.Ok();
        }
    }
} 