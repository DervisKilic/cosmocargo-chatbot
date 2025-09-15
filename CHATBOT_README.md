CosmoCargo – Chattbot (AI) Dokumentation

Undertiden jag gjorde kodtestet har jag använt LLM för kodgenerering men oftast behövt gå in och petat i koden för att
rätta till missförstånd och små logiska fel.

Översikt

- Syfte: Ge kunder snabba, korrekta och korta svar om deras frakter (läge, innehåll, ID, detaljer), samt vägleda i formulär och regler.
- Källa för sanning: Databasen via backend-tjänster. LLM används alltid för att formulera svaret, men får endast strukturerad DATA från DB.
- Roller: Chattbotten är endast tillgänglig för kundinloggade användare. Pilot/Admin blockeras.

Arkitektur (filer)

- Backend
  - backend/Endpoints/ChatbotEndpoints.cs: HTTP-endpoint för chatt (POST /api/chat). Hämtar data, bygger system‑prompt och skickar historik + ev. strukturerad DATA till Ollama.
  - backend/Utils/ChatIntentResolver.cs: Identifierar användarens avsikt (”var är…”, ”innehåller…”, ”ID?”, ”ge all info”, fältspecifika frågor m.m.).
  - backend/Utils/ChatPromptBuilder.cs: Bygger en bas‑prompt (svenska riktlinjer, regler) och exponerar svensk status‑text via ToSvStatus. Inga fraktlistor bäddas in i prompten.
- Frontend
  - frontend/src/components/ui/ChatbotButton.tsx: Flytande, responsiv chatt-knapp med chattfönster (client component). Använder askChat-servicen.
  - frontend/src/services/chat-service.ts: Anropar /api/chat med meddelandehistorik.

Flöde i backend

1. Behörighet och spärrar

   - Auth krävs för kundsvar. Pilot/Admin blockeras (403) i ChatbotEndpoints.cs.
   - Icke‑inloggade: alla fraktspecifika frågor besvaras med vänlig inloggnings‑uppmaning (via LLM), utan data‑läckage.

2. Intentigenkänning

   - ChatIntentResolver.Resolve plockar ut:
     - MentionedId (GUID i text), WantsLatest (”senaste”).
     - Flaggor: IsWhereQuestion, IsContentQuestion, IsIdQuestion, WantsList, IsAllInfoRequest.
     - Fältspecifika önskemål via RequestedFields (avsändare/mottagare: namn, e‑post, planet, station; paket: prioritet, försäkring, beskrivning, vikt, kategori; status).
   - Tolerant regex för svenska och vanliga stavfel (t.ex. ”inhåller”/”innehåller”).
   - Pronomen‑uppföljningar (”var är den?”, ”vad innehåller den?”) backar i historiken för att hitta föregående referens. Intent ärvs mellan meddelanden.
   - ”frakt nr X” stöds inte längre. Använd ”senaste” eller ett specifikt ID; vid ”nr X” guidar botten till ”senaste/ID”.

3. Val av frakt

   - Om ID nämns används den frakten. ”Senaste” används endast när användaren explicit skriver det.

4. Svara (alltid via LLM, grundat i DATA)

   - Var är min frakt? (location + statusSv)
   - Innehåll (kategori + vikt)
   - ID (exakt GUID)
   - All info (sammanställning av centrala fält)
   - Fältspecifika frågor (endast efterfrågade fält)
   - Lista/översikt (id, status, från→till) skickas som DATA när det uttrycks i frågan

5. LLM-användning
   - Bas‑prompten (svenska riktlinjer) + historik + ev. extra användarmeddelande med DATA.
   - Env: OLLAMA_URL (i Docker: http://ollama:11434), OLLAMA_MODEL (default: gemma3:12b), OLLAMA_CTX (1024), OLLAMA_NUM_PREDICT (256), OLLAMA_TEMPERATURE (0.2).
   - Hallucinationer minskas genom att alltid skicka exakt relevant DATA i ett separat meddelande.

API

- Endpoint: POST /api/chat
- Body (ex):
  {
  "messages": [
  { "role": "user", "content": "var är senaste frakten" }
  ]
  }
- Svar (ex):
  { "reply": "🚀 Under transport till Mars." }

Frontend – chattknapp och fönster

- Komponent: frontend/src/components/ui/ChatbotButton.tsx
  - Flytande knapp nere till höger.
  - Döljs på ”/” och ”/login”; döljs även för inloggade Pilot/Admin.
  - Använder askChat (service) som postar till /api/chat.

Konfiguration

- OLLAMA_URL (utanför Docker: http://localhost:11434; i Docker: http://ollama:11434)
- OLLAMA_MODEL (default: gemma3:12b)
- OLLAMA_CTX, OLLAMA_NUM_PREDICT, OLLAMA_TEMPERATURE
- CORS i Program.cs tillåter frontend på http://localhost:3000

Avvikelser mot exempel/spec i root‑README

- Risknivå: Exempeltexter nämner ”Risknivå 1–5…”. Denna egenskap finns inte i Shipment‑modellen. Chattbotten svarar inte med risknivå.

Testexempel (förslag)

- ”Var är senaste frakt?”
- ”Vad innehåller den?” (uppföljning)
- ”Vad har den för ID?”
- ”Ge mig all information om frakten”
- ”Vad är mottagarens e‑post?” / ”Avsändarens station?” / ”Har den försäkring?” / ”Vilken prioritet?”
- ”Vad betyder 'försvunnen i svart hål'?”
