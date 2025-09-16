using System.Text.RegularExpressions;
using System.Linq;
using CosmoCargo.Endpoints;

namespace CosmoCargo.Utils
{
    public class ChatIntentResult
    {
        public Guid? MentionedId { get; set; }
        public bool IsWhereQuestion { get; set; }
        public bool IsContentQuestion { get; set; }
        public bool IsIdQuestion { get; set; }
        public bool HasPronounReference { get; set; }
        public bool WantsList { get; set; }
        public bool IsAllInfoRequest { get; set; }
        public bool WantsLatest { get; set; }
        public HashSet<ShipmentInfoField> RequestedFields { get; set; } = new();
        public bool HasShipmentCue { get; set; }
    }

    public enum ShipmentInfoField
    {
        SenderName,
        SenderEmail,
        SenderPlanet,
        SenderStation,
        ReceiverName,
        ReceiverEmail,
        ReceiverPlanet,
        ReceiverStation,
        Priority,
        HasInsurance,
        Description,
        Weight,
        Category,
        Status
    }

    public static class ChatIntentResolver
    {
        private static readonly Regex GuidRegex = new("[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}", RegexOptions.Compiled);
        private static readonly Regex WhereRegex = new("\\b(var|vart)\\s+.*\\b(frakt|paket)\\b", RegexOptions.IgnoreCase | RegexOptions.Compiled);
        private static readonly Regex ShipmentCueRegex = new("\\b(frakt|paket|leverans|leveranser)\\b", RegexOptions.IgnoreCase | RegexOptions.Compiled);
        private static readonly Regex PronounWhereRegex = new("\\b(var|vart)\\s*(är\\s+)?(den|det)\\b", RegexOptions.IgnoreCase | RegexOptions.Compiled);
        private static readonly Regex ContentRegex = new("\\b(inh(å|a)ller|inneh(å|a)ller|innehåll|vad\\s+inneh(å|a)ller)\\b", RegexOptions.IgnoreCase | RegexOptions.Compiled);
        private static readonly Regex PronounRegex = new("\\b(den|det|denna|detta)\\b", RegexOptions.IgnoreCase | RegexOptions.Compiled);
        private static readonly Regex LatestRegex = new("\\bsenaste\\b", RegexOptions.IgnoreCase | RegexOptions.Compiled);
        private static readonly Regex WantsListRegex = new("(lista|visa\\s+alla|visa\\s+all\\s*info|information\\s*only|översikt|oversikt)", RegexOptions.IgnoreCase | RegexOptions.Compiled);
        private static readonly Regex IdWordRegex = new("\\b(id)\\b", RegexOptions.IgnoreCase | RegexOptions.Compiled);
        private static readonly Regex AllInfoRegex = new("\\b(ge\\s+mig\\s+all(a)?\\s+(information|info)|visa\\s+all(a)?\\s+(information|info)|all\\s+information|all\\s+info|alla\\s+detaljer|alla\\s+uppgifter|ge\\s+mig\\s+information|visa\\s+information)\\b", RegexOptions.IgnoreCase | RegexOptions.Compiled);
        // Field-specific
        private static readonly Regex SenderWord = new("avs(ä|a)ndare(n|ns)?", RegexOptions.IgnoreCase | RegexOptions.Compiled);
        // Tolerera vanlig felskrivning "mottagren" och varianter på böjning
        private static readonly Regex ReceiverWord = new("(mottagare(n|ns)?|mottagren)", RegexOptions.IgnoreCase | RegexOptions.Compiled);
        // Tolka även "vem (är)" som en namnfråga när den kopplas med avsändare/mottagare/kund
        private static readonly Regex NameWord = new("(namn|\\bvem(\\s+är)?\\b)", RegexOptions.IgnoreCase | RegexOptions.Compiled);
        // "kunden" syftar oftast på beställaren (kunden). Mappa till avsändare som baseline.
        private static readonly Regex CustomerWord = new("\\bkund(en|ens)?\\b|customer", RegexOptions.IgnoreCase | RegexOptions.Compiled);
        private static readonly Regex EmailWord = new("(e-post|epost|email|mail)", RegexOptions.IgnoreCase | RegexOptions.Compiled);
        private static readonly Regex PlanetWord = new("planet", RegexOptions.IgnoreCase | RegexOptions.Compiled);
        private static readonly Regex StationWord = new("(rymdstation|station)", RegexOptions.IgnoreCase | RegexOptions.Compiled);
        private static readonly Regex PriorityWord = new("(prio|prioritet)", RegexOptions.IgnoreCase | RegexOptions.Compiled);
        private static readonly Regex InsuranceWord = new("(f(ö|o)rs(ä|a)kring|f(ö|o)rs(ä|a)krad|f(ö|o)rs(ä|a)krat|insurance)", RegexOptions.IgnoreCase | RegexOptions.Compiled);
        private static readonly Regex DescriptionWord = new("(beskrivning|description)", RegexOptions.IgnoreCase | RegexOptions.Compiled);
        private static readonly Regex WeightWord = new("(vikt|väger|tyngd|hur\\s+tung)", RegexOptions.IgnoreCase | RegexOptions.Compiled);
        private static readonly Regex CategoryWord = new("(kategori|last|inneh(å|a)ll)", RegexOptions.IgnoreCase | RegexOptions.Compiled);
        private static readonly Regex StatusWord = new("status", RegexOptions.IgnoreCase | RegexOptions.Compiled);

        public static ChatIntentResult Resolve(ChatRequest request)
        {
            var result = new ChatIntentResult();
            try
            {
                var allMessages = request.Messages ?? new List<ChatMessagePayload>();
                var userMessages = allMessages.Where(m => string.Equals(m.Role, "user", StringComparison.OrdinalIgnoreCase)).ToList();
                var lastUser = userMessages.LastOrDefault();
                if (lastUser != null)
                {
                    var text = lastUser.Content ?? string.Empty;
                    var match = GuidRegex.Match(text);

                    if (match.Success && Guid.TryParse(match.Value, out var gid))
                    {
                        result.MentionedId = gid;
                    }

                    // Ordinals ("frakt nr X") are no longer supported – require explicit ID or "senaste".

                    var mentionsLatest = LatestRegex.IsMatch(text);
                    result.WantsLatest = mentionsLatest;

                    // Classify intent (independent of id/ordinal presence)
                    var whereMatch = WhereRegex.IsMatch(text);
                    var pronounWhere = PronounWhereRegex.IsMatch(text);
                    if (whereMatch || pronounWhere)
                    {
                        result.IsWhereQuestion = true;
                    }

                    if (ContentRegex.IsMatch(text))
                    {
                        result.IsContentQuestion = true;
                    }

                    var pronounRef = PronounRegex.IsMatch(text);

                    // Shipment cue for this turn
                    var hasShipmentCue = ShipmentCueRegex.IsMatch(text);
                    result.HasShipmentCue = hasShipmentCue;

                    // Mark pronoun reference only if it relates to a shipment context or explicit shipment intents
                    bool hasShipmentIntent = result.IsWhereQuestion || result.IsContentQuestion || result.IsIdQuestion || result.IsAllInfoRequest || result.RequestedFields.Count > 0 || hasShipmentCue;
                    result.HasPronounReference = pronounWhere || (pronounRef && hasShipmentIntent);

                    // Ingen implicit default till senaste för generella frågor; endast när "senaste" nämns.

                    // If pronoun was used without explicit referent, look back through prior user messages
                    if (result.HasPronounReference && result.MentionedId == null && !result.WantsLatest && userMessages.Count > 1)
                    {
                        BackResolveFromHistory(userMessages, ref result);
                    }
                    // General fallback: only look back if current text signals shipment context or asks a shipment-specific intent
                    bool asksSpecificIntent = result.IsWhereQuestion || result.IsContentQuestion || result.IsIdQuestion || result.IsAllInfoRequest || result.RequestedFields.Count > 0;
                    if ((result.HasShipmentCue || asksSpecificIntent) && result.MentionedId == null && !result.WantsLatest && userMessages.Count > 1)
                    {
                        BackResolveFromHistory(userMessages, ref result);
                    }

                    // Detect ID question
                    if (IdWordRegex.IsMatch(text))
                    {
                        var hasRefWord = PronounRegex.IsMatch(text) || Regex.IsMatch(text, "\\b(frakt|paket)\\b", RegexOptions.IgnoreCase);
                        result.IsIdQuestion = hasRefWord || result.WantsLatest || result.MentionedId.HasValue;
                    }

                    // Wants list/overview
                    result.WantsList = WantsListRegex.IsMatch(text);
                    // Wants full information (shipment details)
                    result.IsAllInfoRequest = AllInfoRegex.IsMatch(text);

                    // Specific fields
                    var wantsSender = SenderWord.IsMatch(text) || CustomerWord.IsMatch(text);
                    var wantsReceiver = ReceiverWord.IsMatch(text);
                    if (NameWord.IsMatch(text))
                    {
                        if (wantsReceiver) result.RequestedFields.Add(ShipmentInfoField.ReceiverName);
                        if (wantsSender) result.RequestedFields.Add(ShipmentInfoField.SenderName);
                    }
                    if (EmailWord.IsMatch(text))
                    {
                        if (wantsReceiver) result.RequestedFields.Add(ShipmentInfoField.ReceiverEmail);
                        if (wantsSender) result.RequestedFields.Add(ShipmentInfoField.SenderEmail);
                    }
                    if (PlanetWord.IsMatch(text))
                    {
                        if (wantsReceiver) result.RequestedFields.Add(ShipmentInfoField.ReceiverPlanet);
                        if (wantsSender) result.RequestedFields.Add(ShipmentInfoField.SenderPlanet);
                    }
                    if (StationWord.IsMatch(text))
                    {
                        if (wantsReceiver) result.RequestedFields.Add(ShipmentInfoField.ReceiverStation);
                        if (wantsSender) result.RequestedFields.Add(ShipmentInfoField.SenderStation);
                    }
                    if (PriorityWord.IsMatch(text)) result.RequestedFields.Add(ShipmentInfoField.Priority);
                    if (InsuranceWord.IsMatch(text)) result.RequestedFields.Add(ShipmentInfoField.HasInsurance);
                    if (DescriptionWord.IsMatch(text)) result.RequestedFields.Add(ShipmentInfoField.Description);
                    if (WeightWord.IsMatch(text)) result.RequestedFields.Add(ShipmentInfoField.Weight);
                    if (CategoryWord.IsMatch(text)) result.RequestedFields.Add(ShipmentInfoField.Category);
                    if (StatusWord.IsMatch(text)) result.RequestedFields.Add(ShipmentInfoField.Status);

                    // If user asked for specific fields without explicit referent in this turn,
                    // back-resolve to last mentioned ID or "senaste" after fields have been detected.
                    if (result.RequestedFields.Count > 0 && result.MentionedId == null && !result.WantsLatest && userMessages.Count > 1)
                    {
                        BackResolveFromHistory(userMessages, ref result);
                    }

                    // If user asked for all info without explicit referent in this turn,
                    // back-resolve to last mentioned ID or "senaste" (so "senaste" carries over).
                    if (result.IsAllInfoRequest && result.MentionedId == null && !result.WantsLatest && userMessages.Count > 1)
                    {
                        BackResolveFromHistory(userMessages, ref result);
                    }

                    // Context carry-over: if current msg only provides a referent (id/ordinal/pronoun) with no explicit intent,
                    // inherit the last clear intent (where/id/contents/all-info/fields) from history.
                    bool currentHasNoExplicitIntent = !result.IsWhereQuestion && !result.IsContentQuestion && !result.IsIdQuestion
                        && !result.IsAllInfoRequest && result.RequestedFields.Count == 0;
                    bool hasExplicitReferent = result.MentionedId.HasValue || result.WantsLatest || result.HasPronounReference;
                    if (currentHasNoExplicitIntent && hasExplicitReferent && userMessages.Count > 1)
                    {
                        InheritLastIntentFromHistory(userMessages, ref result);
                    }
                }
            }
            catch { }
            return result;
        }

        private static void InheritLastIntentFromHistory(List<ChatMessagePayload> userMessages, ref ChatIntentResult result)
        {
            for (int i = userMessages.Count - 2; i >= 0; i--)
            {
                var prevText = userMessages[i].Content ?? string.Empty;
                // Where
                if (WhereRegex.IsMatch(prevText) || PronounWhereRegex.IsMatch(prevText))
                {
                    result.IsWhereQuestion = true;
                    return;
                }
                // ID
                if (IdWordRegex.IsMatch(prevText))
                {
                    result.IsIdQuestion = true;
                    return;
                }
                // Contents
                if (ContentRegex.IsMatch(prevText))
                {
                    result.IsContentQuestion = true;
                    return;
                }
                // All info
                if (AllInfoRegex.IsMatch(prevText))
                {
                    result.IsAllInfoRequest = true;
                    return;
                }
                // Field-specific
                var wantsSenderPrev = SenderWord.IsMatch(prevText) || CustomerWord.IsMatch(prevText);
                var wantsReceiverPrev = ReceiverWord.IsMatch(prevText);
                bool anyField = false;
                if (NameWord.IsMatch(prevText))
                {
                    if (wantsReceiverPrev) { result.RequestedFields.Add(ShipmentInfoField.ReceiverName); anyField = true; }
                    if (wantsSenderPrev) { result.RequestedFields.Add(ShipmentInfoField.SenderName); anyField = true; }
                }
                if (EmailWord.IsMatch(prevText))
                {
                    if (wantsReceiverPrev) { result.RequestedFields.Add(ShipmentInfoField.ReceiverEmail); anyField = true; }
                    if (wantsSenderPrev) { result.RequestedFields.Add(ShipmentInfoField.SenderEmail); anyField = true; }
                }
                if (PlanetWord.IsMatch(prevText))
                {
                    if (wantsReceiverPrev) { result.RequestedFields.Add(ShipmentInfoField.ReceiverPlanet); anyField = true; }
                    if (wantsSenderPrev) { result.RequestedFields.Add(ShipmentInfoField.SenderPlanet); anyField = true; }
                }
                if (StationWord.IsMatch(prevText))
                {
                    if (wantsReceiverPrev) { result.RequestedFields.Add(ShipmentInfoField.ReceiverStation); anyField = true; }
                    if (wantsSenderPrev) { result.RequestedFields.Add(ShipmentInfoField.SenderStation); anyField = true; }
                }
                if (PriorityWord.IsMatch(prevText)) { result.RequestedFields.Add(ShipmentInfoField.Priority); anyField = true; }
                if (InsuranceWord.IsMatch(prevText)) { result.RequestedFields.Add(ShipmentInfoField.HasInsurance); anyField = true; }
                if (DescriptionWord.IsMatch(prevText)) { result.RequestedFields.Add(ShipmentInfoField.Description); anyField = true; }
                if (WeightWord.IsMatch(prevText)) { result.RequestedFields.Add(ShipmentInfoField.Weight); anyField = true; }
                if (CategoryWord.IsMatch(prevText)) { result.RequestedFields.Add(ShipmentInfoField.Category); anyField = true; }
                if (StatusWord.IsMatch(prevText)) { result.RequestedFields.Add(ShipmentInfoField.Status); anyField = true; }
                if (anyField) return;
            }
        }

        private static void BackResolveFromHistory(List<ChatMessagePayload> userMessages, ref ChatIntentResult result)
        {
            for (int i = userMessages.Count - 2; i >= 0; i--)
            {
                var prevText = userMessages[i].Content ?? string.Empty;
                var guidMatch = GuidRegex.Match(prevText);
                if (guidMatch.Success && Guid.TryParse(guidMatch.Value, out var pgid))
                {
                    result.MentionedId = pgid;
                    return;
                }
                // Behåll endast ID eller "senaste" som referens bakåt
                if (LatestRegex.IsMatch(prevText))
                {
                    result.WantsLatest = true;
                    return;
                }
            }
        }
    }
}
