# Build stage
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build

# Define build arguments
ARG ASPNETCORE_ENVIRONMENT
ARG CONNECTION_STRING

# Set environment variables
ENV ASPNETCORE_ENVIRONMENT=$ASPNETCORE_ENVIRONMENT
ENV ConnectionStrings__DefaultConnection=$CONNECTION_STRING

WORKDIR /src
COPY ["*.csproj", "./"]
RUN dotnet restore
COPY . .
RUN dotnet publish -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:9.0

# Define build arguments again for runtime stage
ARG ASPNETCORE_ENVIRONMENT
ARG CONNECTION_STRING

WORKDIR /app
COPY --from=build /app/publish .

# Set environment variables in runtime stage
ENV ASPNETCORE_ENVIRONMENT=$ASPNETCORE_ENVIRONMENT
ENV ConnectionStrings__DefaultConnection=$CONNECTION_STRING
ENV ASPNETCORE_URLS=http://+:5000
ENV ASPNETCORE_HTTP_PORTS=5000

ENTRYPOINT ["dotnet", "CosmoCargo.dll"]

EXPOSE 5000
