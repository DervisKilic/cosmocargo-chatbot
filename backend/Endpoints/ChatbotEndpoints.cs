using System.Globalization;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using CosmoCargo.Model;
using CosmoCargo.Model.Queries;
using CosmoCargo.Services;
using CosmoCargo.Utils;

namespace CosmoCargo.Endpoints
{
    public sealed class ChatbotLogCategory { }

    public static class ChatbotEndpoints
    {
        public static async Task<IResult> Chat(
            ChatRequest request,
            IShipmentService shipmentService,
            IHttpClientFactory httpClientFactory,
            IConfiguration config,
            ClaimsPrincipal user,
            ILogger<ChatbotLogCategory> logger)
        {
            // Disable chatbot for authenticated Pilot/Admin users
            try
            {
                if (user.Identity?.IsAuthenticated == true)
                {
                    var role = user.GetRole();
                    if (role == UserRole.Pilot.ToString() || role == UserRole.Admin.ToString())
                    {
                        return Results.StatusCode(403);
                    }
                }
            }
            catch { }
            string systemPrompt = string.Empty;
            object? llmData = null;
            string? llmInstruction = null;
            var intent = ChatIntentResolver.Resolve(request);
            Guid? mentionedId = intent.MentionedId;
            bool isWhereQuestion = intent.IsWhereQuestion;
            bool isContentQuestion = intent.IsContentQuestion;
            bool isIdQuestion = intent.IsIdQuestion;
            bool hasPronounReference = intent.HasPronounReference;
            bool wantsList = intent.WantsList;
            bool wantsLatest = intent.WantsLatest;

            // Add shipments for authenticated users (customer/pilot/admin filtered)
            if (user.Identity?.IsAuthenticated == true)
            {
                try
                {
                    var role = user.GetRole();
                    var userId = user.GetUserId();

                    var filter = new ShipmentsFilter { Page = 1, PageSize = wantsList ? 50 : 1 };
                    PaginatedResult<Shipment> shipments = await shipmentService.GetShipmentsByCustomerIdAsync(userId, filter);

                    // Helper to resolve a shipment by id; optionally default to latest
                    async Task<Shipment?> ResolveShipmentAsync(bool defaultToLatest)
                    {
                        Shipment? selected = null;
                        if (mentionedId.HasValue)
                        {
                            var sById = await shipmentService.GetShipmentByIdAsync(mentionedId.Value);
                            if (sById != null && sById.CustomerId == userId) selected = sById;
                        }
                        if (selected == null && shipments.Items.Any() && defaultToLatest)
                        {
                            // Latest first ordering
                            selected = shipments.Items.FirstOrDefault();
                        }
                        return selected;
                    }

                    // Answer "where is my shipment?" using DB data, and let LLM phrase it
                    if (isWhereQuestion)
                    {
                        var selected = await ResolveShipmentAsync(defaultToLatest: wantsLatest);

                        if (selected != null)
                        {
                            // Compute a concise location hint so LLM can state place first, then status
                            string location = selected.Status switch
                            {
                                ShipmentStatus.InTransit => $"Under transport till {selected.Receiver.Planet}",
                                ShipmentStatus.Approved => $"På {selected.Sender.Planet}, väntar på pilot",
                                ShipmentStatus.Assigned => $"På {selected.Sender.Planet}, väntar på avgång",
                                ShipmentStatus.WaitingForApproval => $"På {selected.Sender.Planet}, väntar på godkännande",
                                ShipmentStatus.Delivered => $"Levererad till {selected.Receiver.Planet}",
                                ShipmentStatus.Cancelled => $"På {selected.Sender.Planet}",
                                ShipmentStatus.Denied => $"På {selected.Sender.Planet}",
                                _ => $"Okänd plats"
                            };

                            var statusSv = ChatPromptBuilder.ToSvStatus(selected.Status);

                            llmInstruction = "Svara kort på svenska. Börja med var frakten är enligt DATA.location, och nämn sedan status enligt DATA.statusSv, om statusen är under transport säg att den är på väg annars är det kvar eller om den är leverarad så har den anlänt till destinationen. Station. Använd emojis om du vill. Endast utifrån DATA.";
                            llmData = new
                            {
                                intent = "where",
                                location,
                                status = selected.Status.ToString(),
                                statusSv,
                                sender = new { planet = selected.Sender.Planet, station = selected.Sender.Station },
                                receiver = new { planet = selected.Receiver.Planet, station = selected.Receiver.Station }
                            };
                        }
                        // No accessible shipments found
                        else
                        {
                            llmInstruction = "Be användaren specificera vilken frakt. Skriv på svenska.";
                            llmData = new { intent = "clarify", reason = "no-shipment-selected", allowed = new[] { "senaste", "id" } };
                        }
                    }

                    // If user asks about contents, answer directly from DB
                    if (isContentQuestion)
                    {
                        var selected = await ResolveShipmentAsync(defaultToLatest: wantsLatest);
                        if (selected != null)
                        {
                            llmInstruction = "Svara på svenska utifrån DATA (innehåll och vikt).";
                            llmData = new { intent = "contents", category = selected.Category, weightKg = selected.Weight };
                        }
                        else
                        {
                            llmInstruction = "Be användaren specificera vilken frakt: be dem skriva 'senaste' eller ange ett ID. Skriv på svenska, vänligt och kort.";
                            llmData = new { intent = "clarify", reason = "no-shipment-selected", allowed = new[] { "senaste", "id" } };
                        }
                    }
                    // If user asks for all information about a shipment, answer directly from DB
                    if (intent.IsAllInfoRequest)
                    {
                        var selected = await ResolveShipmentAsync(defaultToLatest: wantsLatest);
                        if (selected != null)
                        {
                            llmInstruction = "Ge en sammanställning på svenska av DATA (id, status, ursprung/destination, avsändare/mottagare, innehåll, vikt, prioritet, försäkring, beskrivning). Inga påhittade fält.";
                            llmData = new
                            {
                                intent = "all-info",
                                id = selected.Id,
                                status = selected.Status.ToString(),
                                sender = new { name = selected.Sender.Name, email = selected.Sender.Email, planet = selected.Sender.Planet, station = selected.Sender.Station },
                                receiver = new { name = selected.Receiver.Name, email = selected.Receiver.Email, planet = selected.Receiver.Planet, station = selected.Receiver.Station },
                                category = selected.Category,
                                weightKg = selected.Weight,
                                priority = selected.Priority,
                                hasInsurance = selected.HasInsurance,
                                description = selected.Description
                            };
                        }
                        else
                        {
                            llmInstruction = "Be användaren specificera vilken frakt. Skriv på svenska.";
                            llmData = new { intent = "clarify", reason = "no-shipment-selected", allowed = new[] { "senaste", "id" } };
                        }
                    }

                    // If user asks for specific fields, answer via LLM with grounded DATA
                    if (intent.RequestedFields.Any())
                    {
                        var selected = await ResolveShipmentAsync(defaultToLatest: wantsLatest);
                        if (selected != null)
                        {
                            llmInstruction = "Svara det som efterfrågas på svenska, utifrån DATA.";
                            llmData = new
                            {
                                intent = "fields",
                                requested = intent.RequestedFields.Select(f => f.ToString()).ToArray(),
                                sender = new { name = selected.Sender.Name, email = selected.Sender.Email, planet = selected.Sender.Planet, station = selected.Sender.Station },
                                receiver = new { name = selected.Receiver.Name, email = selected.Receiver.Email, planet = selected.Receiver.Planet, station = selected.Receiver.Station },
                                status = selected.Status.ToString(),
                                category = selected.Category,
                                weightKg = selected.Weight,
                                priority = selected.Priority,
                                hasInsurance = selected.HasInsurance,
                                description = selected.Description
                            };
                        }
                        else
                        {
                            llmInstruction = "Be användaren specificera vilken frakt: genom att ange ett ID. Skriv på svenska.";
                            llmData = new { intent = "clarify", reason = "no-shipment-selected", allowed = new[] { "senaste", "id" } };
                        }
                    }

                    // If user asks about the ID of a shipment (LLM phrases from DATA)
                    if (isIdQuestion)
                    {
                        var selected = await ResolveShipmentAsync(defaultToLatest: wantsLatest);
                        if (selected != null)
                        {
                            llmInstruction = "Svara med fraktens ID på svenska utifrån DATA.";
                            llmData = new { intent = "id", id = selected.Id };
                        }
                        else
                        {
                            llmInstruction = "Be användaren specificera vilken frakt. Skriv på svenska.";
                            llmData = new { intent = "clarify", reason = "no-shipment-selected", allowed = new[] { "senaste", "id" } };
                        }
                    }

                    // Fuide the user name the ID or "newest"
                    if (!mentionedId.HasValue && !wantsLatest)
                    {
                        llmInstruction = "Förklara kort att du kan visa 'senaste' frakten eller en specifik via ID. Svara på svenska och vänligt.";
                        llmData = new { intent = "clarify", reason = "ordinal-not-supported", allowed = new[] { "senaste", "id" } };
                    }

                    // If the user wants a list/overview, provide a grounded DATA list to LLM
                    if (wantsList)
                    {
                        var list = shipments.Items
                            .Select(s => new
                            {
                                id = s.Id,
                                status = s.Status.ToString(),
                                fromPlanet = s.Sender.Planet,
                                fromStation = s.Sender.Station,
                                toPlanet = s.Receiver.Planet,
                                toStation = s.Receiver.Station
                            })
                            .ToList();

                        llmInstruction = list.Any()
                            ? "Ge en kort svensk översikt av listan i DATA. Ta med ID, status och rutt (från→till)."
                            : "Svara kort på svenska att det inte finns några frakter att visa.";
                        llmData = new { intent = "list", shipments = list };
                    }

                    // If a shipment is referenced but no specific intent was asked, ask for clarification instead of calling LLM
                    if ((mentionedId.HasValue || wantsLatest)
                        && !isWhereQuestion && !isContentQuestion && !isIdQuestion
                        && !intent.IsAllInfoRequest && !intent.RequestedFields.Any())
                    {
                        var which = wantsLatest ? "den senaste frakten" : (mentionedId.HasValue ? $"frakten med ID {mentionedId.Value}" : "frakten");
                        llmInstruction = $"Fråga vad användaren vill veta om {which} (t.ex. ID, status eller innehåll). Svara på svenska och vänligt.";
                        llmData = new { intent = "clarify", reason = "no-specific-intent" };
                    }

                    // Build base system prompt without embedding shipment lists to minimize tokens
                    systemPrompt = ChatPromptBuilder.BuildSystemPrompt();
                }
                catch
                {
                    // If claims are missing/invalid, ignore shipment context gracefully
                }
            }
            else
            {
                // Not authenticated: for any shipment-specific request, let LLM respond with a login guidance (no data leakage)
                if (isWhereQuestion || isContentQuestion || isIdQuestion || intent.IsAllInfoRequest || intent.RequestedFields.Any() || wantsLatest || wantsList || mentionedId.HasValue)
                {
                    systemPrompt = ChatPromptBuilder.BuildSystemPrompt();
                    llmInstruction = "Informera användaren kort och vänligt på svenska att de måste logga in för att se fraktuppgifter. Tipsa om att ange ett ID efter inloggning eller skriva 'senaste'.";
                    llmData = new { intent = "not-authenticated", allowed = new[] { "senaste", "id" } };
                }
                else
                {
                    // Base prompt without user shipments for general questions
                    systemPrompt = ChatPromptBuilder.BuildSystemPrompt();
                }
            }

            // Compose messages for Ollama chat endpoint (non-streaming)
            var ollamaMessages = new List<object>
            {
                new { role = "system", content = systemPrompt }
            };

            foreach (var m in request.Messages ?? new List<ChatMessagePayload>())
            {
                var role = m.Role == "bot" || m.Role == "assistant" ? "assistant" : "user";
                ollamaMessages.Add(new { role, content = m.Content });
            }

            // Om vi har strukturerad data, lägg till en extra instruktion + DATA till modellen
            if (llmData != null)
            {
                var jsonData = JsonSerializer.Serialize(llmData);
                var instruction = llmInstruction ?? "Formulera ett svar på svenska utifrån DATA.";
                var content = $"{instruction}\nDATA:\n```json\n{jsonData}\n```";
                ollamaMessages.Add(new { role = "user", content });
            }

            // Configure safe defaults to reduce memory use
            var modelName = config["OLLAMA_MODEL"] ?? "gemma3:12b";
            int numCtx = 1024; if (int.TryParse(config["OLLAMA_CTX"], out var ctx)) numCtx = ctx;
            int numPredict = 256; if (int.TryParse(config["OLLAMA_NUM_PREDICT"], out var np)) numPredict = np;
            double temperature = 0.2; if (double.TryParse(config["OLLAMA_TEMPERATURE"], NumberStyles.Float, CultureInfo.InvariantCulture, out var t)) temperature = t;

            var body = new
            {
                model = modelName,
                messages = ollamaMessages,
                stream = false,
                options = new { num_ctx = numCtx, num_predict = numPredict, temperature = temperature }
            };

            var client = httpClientFactory.CreateClient();
            client.Timeout = TimeSpan.FromSeconds(120);
            var ollamaUrl = config["OLLAMA_URL"] ?? "http://ollama:11434";
            var req = new HttpRequestMessage(HttpMethod.Post, $"{ollamaUrl.TrimEnd('/')}/api/chat")
            {
                Content = new StringContent(JsonSerializer.Serialize(body), Encoding.UTF8, "application/json")
            };

            try
            {
                var resp = await client.SendAsync(req);
                var json = await resp.Content.ReadAsStringAsync();
                if (!resp.IsSuccessStatusCode)
                {
                    logger.LogWarning("Ollama returned non-success status {Status}: {Body}", (int)resp.StatusCode, json);
                    return Results.Problem(title: "Ollama fel", detail: json, statusCode: (int)resp.StatusCode);
                }

                using var doc = JsonDocument.Parse(json);
                string reply = string.Empty;
                if (doc.RootElement.TryGetProperty("message", out var messageEl) &&
                    messageEl.TryGetProperty("content", out var contentEl))
                {
                    reply = contentEl.GetString() ?? string.Empty;
                }
                else if (doc.RootElement.TryGetProperty("response", out var respEl))
                {
                    reply = respEl.GetString() ?? string.Empty;
                }

                return Results.Ok(new ChatResponse { Reply = reply });
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Failed contacting Ollama at {Url}", ollamaUrl);
                return Results.Problem(title: "Kunde inte kontakta Ollama", detail: ex.Message, statusCode: 500);
            }
        }
    }

    public class ChatRequest
    {
        public List<ChatMessagePayload>? Messages { get; set; }
    }

    public class ChatMessagePayload
    {
        public string Role { get; set; } = "user"; // user | assistant | bot
        public string Content { get; set; } = string.Empty;
    }

    public class ChatResponse
    {
        public string Reply { get; set; } = string.Empty;
    }
}
