using CosmoCargo.Model;
using Microsoft.EntityFrameworkCore;
using System.Collections.Concurrent;
using Npgsql;

namespace CosmoCargo.Data
{
    public static class DbInitializer
    {
        private static int TotalCustomers = Random.Shared.Next(200_000, 300_000);
        private static int TotalPilots = Random.Shared.Next(100_000, 200_000);
        private static int TotalAdmins = Random.Shared.Next(50_000, 100_000);
        private static int TotalShipments = Random.Shared.Next(6_000_000, 8_000_000);

        private static readonly ConcurrentDictionary<string, byte> _takenEmails = new ConcurrentDictionary<string, byte>();
        private static Guid DemoCustomerId;
        private static Guid DemoPilotId;
        private static Guid DemoAdminId;
        private const int BatchSize = 200_000;
        private const int MaxRetries = 3;
        private const int MaxDegreeOfParallelism = 5;
        private const int DeadlockRetryDelay = 2000;
        private static readonly string[] _origins =
        [
            "Jorden,Stockholmsstationen",
            "Jorden,Göteborgsstationen",
            "Jorden,Malmöstationen",
            "Jorden,Alfastationen",
            "Jorden,Betastationen",
            "Jorden,Gammastationen",
            "Mars,Olympusstationen",
            "Mars,Bas Ett",
            "Månen,Koloni Alfa",
            "Titan,Forskningsstation",
            "Europa,Ishamnen",
            "Ganymedes,Utpost",
            "Callisto,Gruvanläggning",
            "Io,Forskningsbas",
            "Enceladus,Station"
        ];


        private static readonly string[] _destinations =
        [
            "Mars,Olympusstationen",
            "Mars,Bas Ett",
            "Månen,Koloni Alfa",
            "Titan,Forskningsstation",
            "Europa,Is-hamnen",
            "Ganymedes,Utpost",
            "Callisto,Gruvanläggning",
            "Io,Forskningsbas",
            "Enceladus,Station",
            "Triton,Forskningsbas",
            "Pluto,Station",
            "Charon,Utpost",
            "Ceres,Gruvanläggning",
            "Vesta,Forskningsstation",
            "Pallas,Koloni"
        ];


        private static readonly string[] _categories =
        [
            "Vetenskaplig utrustning", "Medicinska förnödenheter", "Byggmaterial",
            "Livsmedel", "Gruvutrustning", "Forskningsprover",
            "Reservdelar", "Personliga tillhörigheter", "Industriella maskiner",
            "Vattenförsörjning", "Syrgastuber", "Bränsleceller",
            "Elektronik", "Råmaterial", "Jordbruksprodukter"
        ];

        private static readonly string[] _priorities = ["Low", "Normal", "High", "Urgent"];

        private static readonly string[] _firstNames =
        [
            "Erik", "Anna", "Maria", "Johan", "Anders", "Karin", "Lars", "Sofia",
            "Mikael", "Emma", "Per", "Lisa", "Karl", "Eva", "Peter", "Linda",
            "Andreas", "Sara", "Thomas", "Jenny", "Daniel", "Maria", "Fredrik",
            "Emma", "Magnus", "Anna", "Jonas", "Sofia", "Martin", "Karin"
        ];

        private static readonly string[] _lastNames =
        [
            "Andersson", "Johansson", "Karlsson", "Nilsson", "Eriksson", "Larsson",
            "Olsson", "Persson", "Svensson", "Gustafsson", "Pettersson", "Jonsson",
            "Jansson", "Hansson", "Bengtsson", "Jönsson", "Lindberg", "Jakobsson",
            "Magnusson", "Olofsson", "Lindström", "Lindqvist", "Lindgren", "Axelsson",
            "Berg", "Bergström", "Lundberg", "Lundgren", "Lundqvist", "Mattsson"
        ];

        private static readonly string[] _experienceLevels =
        [
            "1 year", "2 years", "3 years", "4 years", "5 years", "6 years",
            "7 years", "8 years", "9 years", "10 years", "11 years", "12 years",
            "13 years", "14 years", "15 years", "16 years", "17 years", "18 years",
            "19 years", "20 years"
        ];

        private static readonly string[] _industries =
        [
            "logistics", "space transport", "interplanetary shipping", "cargo management",
            "space logistics", "freight forwarding", "supply chain", "transportation",
            "space operations", "cargo operations", "shipping management", "space navigation",
            "cargo handling", "space logistics management", "interplanetary operations"
        ];

        private static string GenerateUniqueEmail(string firstName, string lastName, string domain)
        {
            var baseEmail = $"{firstName.ToLower()}.{lastName.ToLower()}";
            var email = $"{baseEmail}@{domain}";
            var counter = 2;

            while (!_takenEmails.TryAdd(email, 0))
            {
                email = $"{baseEmail}.{counter}@{domain}";
                counter++;
            }

            return email;
        }

        private static void Log(string message)
        {
            Console.WriteLine($"[{DateTime.Now:HH:mm:ss}] {message}");
        }

        public static async Task InitializeAsync(IServiceProvider serviceProvider)
        {
            using var scope = serviceProvider.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

            // Apply migrations
            await context.Database.ExecuteSqlRawAsync(@"
                CREATE TABLE IF NOT EXISTS ""__EFMigrationsHistory"" (
                    ""MigrationId"" character varying(150) NOT NULL,
                    ""ProductVersion"" character varying(32) NOT NULL,
                    CONSTRAINT ""PK___EFMigrationsHistory"" PRIMARY KEY (""MigrationId"")
                );
            ");
            await context.Database.MigrateAsync();

            if (await context.Users.AnyAsync())
                return;

            Log("DATABASE: Start seeding");

            await SeedDemoUsers(serviceProvider);
            await SeedCustomers(serviceProvider);
            await SeedPilots(serviceProvider);
            await SeedAdmins(serviceProvider);
            await SeedShipments(serviceProvider);

            Log("DATABASE: Seeding completed!");
        }

        private static async Task BulkInsertUsersAsync(AppDbContext context, User[] users)
        {
            var connection = (NpgsqlConnection)context.Database.GetDbConnection();
            if (connection.State != System.Data.ConnectionState.Open)
                await connection.OpenAsync();

            using var writer = await connection.BeginBinaryImportAsync(
                "COPY users (id, name, email, password_hash, role, experience, is_active, created_at, updated_at) FROM STDIN (FORMAT BINARY)");

            foreach (var user in users)
            {
                await writer.StartRowAsync();
                await writer.WriteAsync(user.Id);
                await writer.WriteAsync(user.Name);
                await writer.WriteAsync(user.Email);
                await writer.WriteAsync(user.PasswordHash);
                await writer.WriteAsync((int)user.Role);
                await writer.WriteAsync(user.Experience);
                await writer.WriteAsync(user.IsActive);
                await writer.WriteAsync(user.CreatedAt);
                await writer.WriteAsync(user.UpdatedAt);
            }

            await writer.CompleteAsync();
        }

        private static async Task BulkInsertShipmentsAsync(AppDbContext context, Shipment[] shipments)
        {
            var connection = (NpgsqlConnection)context.Database.GetDbConnection();
            if (connection.State != System.Data.ConnectionState.Open)
                await connection.OpenAsync();

            // Set optimal settings for bulk copy
            await using var cmd = new NpgsqlCommand("SET synchronous_commit TO OFF", connection);
            await cmd.ExecuteNonQueryAsync();

            using var writer = await connection.BeginBinaryImportAsync(
                "COPY shipments (id, customer_id, pilot_id, sender_name, sender_email, sender_planet, sender_station, receiver_name, receiver_email, receiver_planet, receiver_station, weight, category, priority, description, has_insurance, status, created_at, updated_at) FROM STDIN (FORMAT BINARY)");

            foreach (var shipment in shipments)
            {
                await writer.StartRowAsync();
                await writer.WriteAsync(shipment.Id);
                await writer.WriteAsync(shipment.CustomerId);
                await writer.WriteAsync(shipment.PilotId);
                await writer.WriteAsync(shipment.Sender.Name);
                await writer.WriteAsync(shipment.Sender.Email);
                await writer.WriteAsync(shipment.Sender.Planet);
                await writer.WriteAsync(shipment.Sender.Station);
                await writer.WriteAsync(shipment.Receiver.Name);
                await writer.WriteAsync(shipment.Receiver.Email);
                await writer.WriteAsync(shipment.Receiver.Planet);
                await writer.WriteAsync(shipment.Receiver.Station);
                await writer.WriteAsync(shipment.Weight);
                await writer.WriteAsync(shipment.Category);
                await writer.WriteAsync(shipment.Priority);
                await writer.WriteAsync(shipment.Description);
                await writer.WriteAsync(shipment.HasInsurance);
                await writer.WriteAsync((int)shipment.Status);
                await writer.WriteAsync(shipment.CreatedAt);
                await writer.WriteAsync(shipment.UpdatedAt);
            }

            await writer.CompleteAsync();
        }

        private static async Task SeedDemoUsers(IServiceProvider serviceProvider)
        {
            Log("Starting to seed demo customers");

            using var scope = serviceProvider.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

            DemoCustomerId = Guid.NewGuid();
            DemoPilotId = Guid.NewGuid();
            DemoAdminId = Guid.NewGuid();

            var random = new Random(Environment.TickCount);

            var demoUsers = new List<User>
            {
                new User
                {
                    Id = DemoCustomerId,
                    Name = "Demo Customer",
                    Email = GenerateUniqueEmail("demo", "customer", "example.com"),
                    PasswordHash = Utils.Crypto.HashPassword("mKv2P8dXrL9F"),
                    Role = UserRole.Customer,
                    Experience = null,
                    IsActive = null,
                    CreatedAt = DateTime.UtcNow.AddDays(-random.Next(0, 365))
                },
                new User
                {
                    Id = DemoPilotId,
                    Name = "Demo Pilot",
                    Email = GenerateUniqueEmail("demo", "pilot", "example.com"),
                    PasswordHash = Utils.Crypto.HashPassword("zH7yB3tR5wQ9s"),
                    Role = UserRole.Pilot,
                    Experience = null,
                    IsActive = null,
                    CreatedAt = DateTime.UtcNow.AddDays(-random.Next(0, 365))
                },
                new User
                {
                    Id = DemoAdminId,
                    Name = "Demo Admin",
                    Email = GenerateUniqueEmail("demo", "admin", "example.com"),
                    PasswordHash = Utils.Crypto.HashPassword("eT4xD6cV2gN8p"),
                    Role = UserRole.Admin,
                    Experience = null,
                    IsActive = null,
                    CreatedAt = DateTime.UtcNow.AddDays(-random.Next(0, 365))
                },
            };

            await context.Users.AddRangeAsync(demoUsers);
            await context.SaveChangesAsync();

            Log($"> Processed {demoUsers.Count:N0} demo users");

            Log("Demo customers seeded!");
        }

        private static async Task SeedCustomers(IServiceProvider serviceProvider)
        {
            Log($"Starting to seed {TotalCustomers:N0} customers");
            var batches = (int)Math.Ceiling((double)TotalCustomers / BatchSize);
            var options = new ParallelOptions { MaxDegreeOfParallelism = MaxDegreeOfParallelism };
            await Parallel.ForEachAsync(Enumerable.Range(0, batches), options, async (batch, ct) =>
            {
                using var scope = serviceProvider.CreateScope();
                var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

                var batchSize = Math.Min(BatchSize, TotalCustomers - batch * BatchSize);
                var users = new User[batchSize];
                var now = DateTime.UtcNow;
                var random = new Random(Environment.TickCount + batch * 1000);

                // Pre-generate all random data for the batch
                var firstNameIndices = new int[batchSize];
                var lastNameIndices = new int[batchSize];
                var experienceIndices = new int[batchSize];
                var industryIndices = new int[batchSize];
                var isActiveFlags = new bool[batchSize];
                var createdAts = new DateTime[batchSize];
                var emails = new string[batchSize];

                for (int i = 0; i < batchSize; i++)
                {
                    firstNameIndices[i] = random.Next(_firstNames.Length);
                    lastNameIndices[i] = random.Next(_lastNames.Length);
                    experienceIndices[i] = random.Next(_experienceLevels.Length);
                    industryIndices[i] = random.Next(_industries.Length);
                    isActiveFlags[i] = random.Next(100) < 95;
                    createdAts[i] = now.AddDays(-random.Next(0, 365));
                    emails[i] = GenerateUniqueEmail(
                        _firstNames[firstNameIndices[i]],
                        _lastNames[lastNameIndices[i]],
                        "example.com"
                    );
                }

                for (int i = 0; i < batchSize; i++)
                {
                    var userNumber = batch * BatchSize + i + 1;
                    var experience = $"{_experienceLevels[experienceIndices[i]]} in {_industries[industryIndices[i]]}";

                    users[i] = new User
                    {
                        Id = Guid.NewGuid(),
                        Name = $"{_firstNames[firstNameIndices[i]]} {_lastNames[lastNameIndices[i]]}",
                        Email = emails[i],
                        PasswordHash = Utils.Crypto.HashPassword($"Customer{userNumber}"),
                        Role = UserRole.Customer,
                        Experience = experience,
                        IsActive = isActiveFlags[i],
                        CreatedAt = createdAts[i]
                    };
                }

                for (int retry = 0; retry < MaxRetries; retry++)
                {
                    try
                    {
                        using var transaction = await context.Database.BeginTransactionAsync();
                        try
                        {
                            await BulkInsertUsersAsync(context, users);
                            await transaction.CommitAsync();
                            break;
                        }
                        catch
                        {
                            await transaction.RollbackAsync();
                            throw;
                        }
                    }
                    catch (Exception ex) when (IsDeadlockException(ex) && retry < MaxRetries - 1)
                    {
                        Log($"> Deadlock detected on customer batch {batch + 1}, retry {retry + 1}");
                        await Task.Delay(DeadlockRetryDelay * (retry + 1));
                    }
                    catch (Exception ex) when (retry < MaxRetries - 1)
                    {
                        Log($"> Retry {retry + 1} for customer batch {batch + 1} due to: {ex.Message}");
                        await Task.Delay(1000 * (retry + 1));
                    }
                }

                Log($"> Processed {Math.Min((batch + 1) * BatchSize, TotalCustomers):N0} customers");
            });

            Log("Customer seeding completed!");
        }

        private static bool IsDeadlockException(Exception ex)
        {
            return ex is PostgresException pgEx && pgEx.SqlState == "40P01";
        }

        private static async Task SeedPilots(IServiceProvider serviceProvider)
        {
            Log($"Starting to seed {TotalPilots:N0} pilots");
            var batches = (int)Math.Ceiling((double)TotalPilots / BatchSize);
            var options = new ParallelOptions { MaxDegreeOfParallelism = MaxDegreeOfParallelism };
            await Parallel.ForEachAsync(Enumerable.Range(0, batches), options, async (batch, ct) =>
            {
                using var scope = serviceProvider.CreateScope();
                var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

                var batchSize = Math.Min(BatchSize, TotalPilots - batch * BatchSize);
                var users = new User[batchSize];
                var now = DateTime.UtcNow;
                var random = new Random(Environment.TickCount + batch * 1000);

                // Pre-generate all random data for the batch
                var firstNameIndices = new int[batchSize];
                var lastNameIndices = new int[batchSize];
                var experienceIndices = new int[batchSize];
                var isActiveFlags = new bool[batchSize];
                var createdAts = new DateTime[batchSize];
                var emails = new string[batchSize];

                for (int i = 0; i < batchSize; i++)
                {
                    firstNameIndices[i] = random.Next(_firstNames.Length);
                    lastNameIndices[i] = random.Next(_lastNames.Length);
                    experienceIndices[i] = random.Next(_experienceLevels.Length);
                    isActiveFlags[i] = random.Next(100) < 90;
                    createdAts[i] = now.AddDays(-random.Next(0, 365));
                    emails[i] = GenerateUniqueEmail(
                        _firstNames[firstNameIndices[i]],
                        _lastNames[lastNameIndices[i]],
                        "cosmocargo.com"
                    );
                }

                for (int i = 0; i < batchSize; i++)
                {
                    var userNumber = batch * BatchSize + i + 1;
                    var experience = $"{_experienceLevels[experienceIndices[i]]} of space piloting";

                    users[i] = new User
                    {
                        Id = Guid.NewGuid(),
                        Name = $"{_firstNames[firstNameIndices[i]]} {_lastNames[lastNameIndices[i]]}",
                        Email = emails[i],
                        PasswordHash = Utils.Crypto.HashPassword($"Pilot{userNumber}"),
                        Role = UserRole.Pilot,
                        Experience = experience,
                        IsActive = isActiveFlags[i],
                        CreatedAt = createdAts[i]
                    };
                }

                for (int retry = 0; retry < MaxRetries; retry++)
                {
                    try
                    {
                        using var transaction = await context.Database.BeginTransactionAsync();
                        try
                        {
                            await BulkInsertUsersAsync(context, users);
                            await transaction.CommitAsync();
                            break;
                        }
                        catch
                        {
                            await transaction.RollbackAsync();
                            throw;
                        }
                    }
                    catch (Exception ex) when (IsDeadlockException(ex) && retry < MaxRetries - 1)
                    {
                        Log($"> Deadlock detected on pilot batch {batch + 1}, retry {retry + 1}");
                        await Task.Delay(DeadlockRetryDelay * (retry + 1));
                    }
                    catch (Exception ex) when (retry < MaxRetries - 1)
                    {
                        Log($"> Retry {retry + 1} for pilot batch {batch + 1} due to: {ex.Message}");
                        await Task.Delay(1000 * (retry + 1));
                    }
                }

                Log($"> Processed {Math.Min((batch + 1) * BatchSize, TotalPilots):N0} pilots");
            });

            Log("Pilot seeding completed!");
        }

        private static async Task SeedAdmins(IServiceProvider serviceProvider)
        {
            Log($"Starting to seed {TotalAdmins:N0} admins");
            var batches = (int)Math.Ceiling((double)TotalAdmins / BatchSize);
            var options = new ParallelOptions { MaxDegreeOfParallelism = MaxDegreeOfParallelism };
            await Parallel.ForEachAsync(Enumerable.Range(0, batches), options, async (batch, ct) =>
            {
                using var scope = serviceProvider.CreateScope();
                var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

                var batchSize = Math.Min(BatchSize, TotalAdmins - batch * BatchSize);
                var users = new User[batchSize];
                var now = DateTime.UtcNow;
                var random = new Random(Environment.TickCount + batch * 1000);

                // Pre-generate all random data for the batch
                var firstNameIndices = new int[batchSize];
                var lastNameIndices = new int[batchSize];
                var experienceIndices = new int[batchSize];
                var isActiveFlags = new bool[batchSize];
                var createdAts = new DateTime[batchSize];
                var emails = new string[batchSize];

                for (int i = 0; i < batchSize; i++)
                {
                    firstNameIndices[i] = random.Next(_firstNames.Length);
                    lastNameIndices[i] = random.Next(_lastNames.Length);
                    experienceIndices[i] = random.Next(_experienceLevels.Length);
                    isActiveFlags[i] = random.Next(100) < 98;
                    createdAts[i] = now.AddDays(-random.Next(0, 365));
                    emails[i] = GenerateUniqueEmail(
                        _firstNames[firstNameIndices[i]],
                        _lastNames[lastNameIndices[i]],
                        "cosmocargo.com"
                    );
                }

                for (int i = 0; i < batchSize; i++)
                {
                    var userNumber = batch * BatchSize + i + 1;
                    var experience = $"{_experienceLevels[experienceIndices[i]]} in space logistics management";

                    users[i] = new User
                    {
                        Id = Guid.NewGuid(),
                        Name = $"{_firstNames[firstNameIndices[i]]} {_lastNames[lastNameIndices[i]]}",
                        Email = emails[i],
                        PasswordHash = Utils.Crypto.HashPassword($"Admin{userNumber}"),
                        Role = UserRole.Admin,
                        Experience = experience,
                        IsActive = isActiveFlags[i],
                        CreatedAt = createdAts[i]
                    };
                }

                for (int retry = 0; retry < MaxRetries; retry++)
                {
                    try
                    {
                        using var transaction = await context.Database.BeginTransactionAsync();
                        try
                        {
                            await BulkInsertUsersAsync(context, users);
                            await transaction.CommitAsync();
                            break;
                        }
                        catch
                        {
                            await transaction.RollbackAsync();
                            throw;
                        }
                    }
                    catch (Exception ex) when (IsDeadlockException(ex) && retry < MaxRetries - 1)
                    {
                        Log($"> Deadlock detected on admin batch {batch + 1}, retry {retry + 1}");
                        await Task.Delay(DeadlockRetryDelay * (retry + 1));
                    }
                    catch (Exception ex) when (retry < MaxRetries - 1)
                    {
                        Log($"> Retry {retry + 1} for admin batch {batch + 1} due to: {ex.Message}");
                        await Task.Delay(1000 * (retry + 1));
                    }
                }

                Log($"> Processed {Math.Min((batch + 1) * BatchSize, TotalAdmins):N0} admins");
            });

            Log("Admin seeding completed!");
        }

        private static async Task SeedShipments(IServiceProvider serviceProvider)
        {
            Log($"Starting to seed {TotalShipments:N0} shipments");

            using var scope = serviceProvider.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

            // Pre-fetch all IDs in a single query and cache them
            var customerIds = await context.Users
                .Where(u => u.Role == UserRole.Customer)
                .Select(u => u.Id)
                .ToListAsync();

            var pilotIds = await context.Users
                .Where(u => u.Role == UserRole.Pilot)
                .Select(u => u.Id)
                .ToListAsync();

            var statuses = Enum.GetValues<ShipmentStatus>();

            // Pre-calculate all possible combinations to avoid repeated calculations
            var origins = _origins.Select(o => o.Split(',')).ToArray();
            var destinations = _destinations.Select(d => d.Split(',')).ToArray();
            var nameCombinations = _firstNames.SelectMany(f => _lastNames.Select(l => $"{f} {l}")).ToArray();

            // Pre-generate all possible weights, categories, and priorities
            var weights = Enumerable.Range(50, 951).Select(w => (decimal)w).ToArray();
            var categories = _categories.ToArray();
            var priorities = _priorities.ToArray();

            var batches = (int)Math.Ceiling((double)TotalShipments / BatchSize);
            var options = new ParallelOptions { MaxDegreeOfParallelism = MaxDegreeOfParallelism };

            await Parallel.ForEachAsync(Enumerable.Range(0, batches), options, async (batch, ct) =>
            {
                using var scope = serviceProvider.CreateScope();
                var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                var random = new Random(Environment.TickCount + batch * 1000);

                var batchSize = Math.Min(BatchSize, TotalShipments - batch * BatchSize);
                var shipments = new Shipment[batchSize];
                var now = DateTime.UtcNow;

                // Pre-generate all random data for the batch
                var randomData = new (int originIndex, int destIndex, int senderNameIndex, int receiverNameIndex,
                                    int weightIndex, int categoryIndex, int priorityIndex, bool hasInsurance,
                                    ShipmentStatus status, DateTime createdAt, DateTime updatedAt)[batchSize];

                for (int i = 0; i < batchSize; i++)
                {
                    var scheduledDate = now.AddDays(random.Next(-365, 365));
                    var createdAt = scheduledDate.AddDays(-random.Next(1, 30));
                    var updatedAt = createdAt.AddDays(random.Next(0, 30));
                    var status = statuses[random.Next(statuses.Length)];

                    randomData[i] = (
                        random.Next(origins.Length),
                        random.Next(destinations.Length),
                        random.Next(nameCombinations.Length),
                        random.Next(nameCombinations.Length),
                        random.Next(weights.Length),
                        random.Next(categories.Length),
                        random.Next(priorities.Length),
                        random.Next(100) < 70,
                        status,
                        createdAt,
                        updatedAt
                    );
                }

                // Create shipments using pre-generated data
                var senderContact = new ShipmentContact();
                var receiverContact = new ShipmentContact();

                for (int i = 0; i < batchSize; i++)
                {
                    var data = randomData[i];
                    var origin = origins[data.originIndex];
                    var destination = destinations[data.destIndex];

                    // Reuse the same contact objects
                    senderContact.Name = nameCombinations[data.senderNameIndex];
                    senderContact.Email = "sender.shipment@example.com";
                    senderContact.Planet = origin[0];
                    senderContact.Station = origin[1];

                    receiverContact.Name = nameCombinations[data.receiverNameIndex];
                    receiverContact.Email = "receiver.shipment@example.com";
                    receiverContact.Planet = destination[0];
                    receiverContact.Station = destination[1];

                    shipments[i] = new Shipment
                    {
                        Id = Guid.NewGuid(),
                        CustomerId = random.Next(100) < 5 ? DemoCustomerId : customerIds[random.Next(customerIds.Count)],
                        PilotId = data.status == ShipmentStatus.Assigned
                            || data.status == ShipmentStatus.InTransit
                            || data.status == ShipmentStatus.Delivered ? (random.Next(100) < 5 ? DemoPilotId : pilotIds[random.Next(pilotIds.Count)]) : null,
                        Sender = senderContact,
                        Receiver = receiverContact,
                        Weight = weights[data.weightIndex],
                        Category = categories[data.categoryIndex],
                        Priority = priorities[data.priorityIndex],
                        Description = "Sample shipment",
                        HasInsurance = data.hasInsurance,
                        Status = data.status,
                        CreatedAt = data.createdAt,
                        UpdatedAt = data.updatedAt
                    };
                }

                for (int retry = 0; retry < MaxRetries; retry++)
                {
                    try
                    {
                        using var transaction = await context.Database.BeginTransactionAsync();
                        try
                        {
                            await BulkInsertShipmentsAsync(context, shipments);
                            await transaction.CommitAsync();
                            break;
                        }
                        catch
                        {
                            await transaction.RollbackAsync();
                            throw;
                        }
                    }
                    catch (Exception ex) when (IsDeadlockException(ex) && retry < MaxRetries - 1)
                    {
                        Log($"> Deadlock detected on shipment batch {batch + 1}, retry {retry + 1}");
                        await Task.Delay(DeadlockRetryDelay * (retry + 1));
                    }
                    catch (Exception ex) when (retry < MaxRetries - 1)
                    {
                        Log($"> Retry {retry + 1} for shipment batch {batch + 1} due to: {ex.Message}");
                        await Task.Delay(1000 * (retry + 1));
                    }
                }

                Log($"> Processed {Math.Min((batch + 1) * BatchSize, TotalShipments):N0} shipments");
            });

            Log("Shipment seeding completed!");
        }
    }
}
