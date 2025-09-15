# 🚀 CosmoCargo™ – Den Intergalaktiska Fraktcentralen

## 🪐 Bakgrund

**CosmoCargo™** är den ledande aktören inom rymdlogistik, med leveranser till över 9000 rymdstationer och kolonier i hela galaxen, från de innersta månarna vid Jupiter till de yttre handelszonerna i Andromedatriangeln. Tusentals transporter koordineras dagligen genom ett sofistikerat bokningssystem som används av kunder, piloter och administratörer. Allt måste gå snabbt, säkert och smidigt i det intergalaktiska kaoset.

## 🛠️ Tech Stack

### Frontend
- React
- TypeScript
- Next.js
- Tanstack Query
- Tailwind CSS

### Backend
- .NET
- Minimal API
- REST
- Entity Framework
- PostgreSQL

### Infrastruktur
- Docker

## 🚀 Utveckling

### Förutsättningar
- Docker Desktop 3.4+
- Node.js 22+
- .NET SDK 9

### Kör lokalt

1. Starta hela systemet med Docker:
```bash
docker compose up --detach --build
```

2. Vänta på seedningen av databasen (tar ca 2min, endast första gången):
   - Se logg för `cosmocargo-backend-1` containern

3. Systemet är nu tillgängligt på:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

### Tips

Om du vill jobba med frontend:
1. Starta systemet enligt ovan
2. Stoppa frontend-containern `cosmocargo-frontend-1` (för att minska belastningen på din dator)
3. Kör: `cd frontend && npm run dev`
   - Frontend finns nu tillgängig på http://localhost:3001 (med hot reload)
  
Om du vill jobba med backend:
1. Starta systemet enligt ovan
2. Stoppa backend-containern `cosmocargo-backend-1` (för att förhindra konflikter i redan använda portar)
3. Kör: `cd backend && dotnet watch`
   - Backend finns nu tillgängig på http://localhost:5000 (med hot reload)

## 📄 Befintlig funktionalitet

Användare i systemet kan ha en av följande roller: **Kund**, **Pilot** eller **Admin**.

#### 👩‍🚀 Kund
- En kund kan skapa en frakt via formulär
- En kund kan se sina frakter

#### 🚀 Pilot
- En pilot kan se tilldelade frakter
- En pilot kan uppdatera fraktens status till: *Under Transport* eller *Levererad*

#### 🧑‍💼 Admin
- En admin kan se alla frakter
- En admin kan godkänna/neka frakter
- En admin kan tilldela en frakt till en pilot

---

# Uppgifter

Vi tänker oss att du kan lägga 4 timmar, eller mer om du känner för det, på en eller flera av uppgifterna nedan. Uppgifterna är medvetet luddiga/öppna för att tillåta kreativitet men skriv gärna om du avviker från exempel/specar i dokumentationen/readme.

## 📄 Uppgift 1: Galactic Cargo Declaration™ (Frontend/Backend/Fullstack)

Universum står inför ett handelskrig och intergalaktiska tullar kommer införas. CosmoCargo har anlitat dig för att ta fram ett system för tullhantering.

### Funktionalitet / Krav
- **Kund**: Fylla i ett valfritt tullformulär i samband med skapandet av en frakt
- **Admin**: Granskar formuläret
- **Pilot**: Ser om frakten är högriskklassad och om karantän behövs

### Formulär (exempel)

| Fält | Typ | Beskrivning |
|------|-----|-------------|
| `containsLifeforms`  | Innehåller levande varelser |
| `lifeformType` | (Om levande varelser) Beskrivning av art, intelligens, riskklass |
| `isPlasmaActive`  | Innehåller plasma-aktiva material |
| `plasmaStabilityLevel` | Stabilitetsskala (om plasmaaktiv) |
| `originPlanetLawsConfirmed` | Intygande om laglig export |
| `customsNotes` | Frivillig kommentar |

### Valideringsregler (exempel)

- `containsLifeforms === true` ⇒ `lifeformType` är obligatoriskt
- `isPlasmaActive === true` ⇒ `plasmaStabilityLevel` måste anges (1–10)
- `plasmaStabilityLevel < 4` ⇒ `quarantineRequired` måste vara true
- `originPlanetLawsConfirmed` måste vara ikryssad

### Automatiserad Riskbedömning (exempel)

Bygg en funktion som klassificerar risknivå baserat på tullformulär.

### Riskklassificering (exempel)

| Villkor | Risknivå |
|---------|----------|
| Plasmaaktiv + stabilitet < 5 + livsform | 🔴 Kritisk |
| Livsform + okänd art | 🔶 Hög |
| Plasmaaktiv med stabilitet 5–7 | 🟡 Medel |
| Inga specialegenskaper | 🟢 Låg |

---

## 📄 Uppgift 2: Intergalactic Chaos Engine™ (Backend/Fullstack)

I rymden kan allt gå fel. Ta rollen som Master of the Universe och bygg en Intergalactic Chaos Engine som slupmässigt genererar olika händelser som påverkar frakterna.

### Funktionalitet / Krav
- Var X:e sekund muteras en slumpmässig frakt baserat på en kaoshändelse
- Ta hänsyn till sannorlikheter
- Visa dessa i ett “Galactic Event Feed” för admins med tidsstämpel och påverkan (frontend), alternativt endast loggning (backend)

### Förslag på händelser

| Händelse | Effekt på frakt |
|---------|----------|
| Meteorstorm | Försening |
| Maskhål | Destination omdirigeras |
| Piratattack | Vikt ändras till 0 |
| Virus i biosensor | Livsformflagga ändras till “Instabil” |
| Svart hål nära rutten | Status ändras till “Försvunnen i svart hål”  |
| AI gör uppror | Pilot och destination ändras till "Okänd"  |

### Sannorlikhet

- Vissa frakttyper (beroende på kategori) har större sannolikhet att drabbas

## 📄 Uppgift 3: Intergalactic AI Support™ (Fullstack)

CosmoCargo vill kunna erbjudea sina kunder en tillgänglig och engegerande kanal för att snabbt få hjälp med supportärenden och guida användaren genom systemet. Du är anlitad för att implementera en chatbot som ska svara på kundernas vanligaste frågor.

### Funktionalitet / Krav
- Svara på frågor baserat på kundens fraktdata
- Svara på frågor om formulär eller regler

### Förslag på smart konversation (exempel)

| Fråga från användare | Svar från bot |
|---------|----------|
| "Vart är mitt paket?" | "Din frakt med ID SHIP-992 befinner sig vid Mars"  |
| "Hur fyller jag i tullformuläret?"  | "Jag kan guida dig! Har frakten plasmaaktivt innehåll?"  |
| "Vad betyder 'försvunnen i svart hål'?"  | "Det paketet kommer aldrig komma fram" |
| "Vad är risknivå 5?"  | "Ditt paket har ett faligt innehåll och det är hög risk för att något kommer gå fel" |

---

## ✅ Bedömningskriterier

- Funktionalitet & kravuppfyllnad
- Responsiv design
- Struktur & kodkvalitet
- Dokumentation
- Användning av lämpliga AI-verktyg
