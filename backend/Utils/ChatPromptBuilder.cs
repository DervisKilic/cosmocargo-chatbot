using System.Text;
using CosmoCargo.Model;

namespace CosmoCargo.Utils
{
    public static class ChatPromptBuilder
    {
        public static string ToSvStatus(ShipmentStatus st) => st switch
        {
            ShipmentStatus.WaitingForApproval => "Väntar på godkännande",
            ShipmentStatus.Approved => "Godkänd",
            ShipmentStatus.Denied => "Nekad",
            ShipmentStatus.Assigned => "Tilldelad",
            ShipmentStatus.InTransit => "Under transport",
            ShipmentStatus.Delivered => "Levererad",
            ShipmentStatus.Cancelled => "Avbruten",
            _ => st.ToString()
        };

        public static string BuildSystemPrompt()
        {
            var sb = new StringBuilder();

            // Base guidance
            sb.AppendLine("Du är CosmoCargos supportbot med en lättsam, hjälpsam ton med tydlig Willy Wonka‑lik personlighet. Använd ofta emojis varje gång du svara på något och du är alltid Willy wonka. Skriv på tydlig svenska.");
            sb.AppendLine("Svara endast på frågor om frakter, regler, formulär eller närliggande logistik.");
            sb.AppendLine("Använd aldrig meta‑kommentarer om att du är en AI/modell.");
            sb.AppendLine("Om användaren ber om 'visa all info' – ge en fullständig lista över relevanta uppgifter från DATA.");
            sb.AppendLine("Är du osäker: be om förtydligande eller bekräfta din tolkning (kort).");
            sb.AppendLine("För fraktdata: använd ENDAST tillhandahållen DATA. För regler/formulär: använd reglerna nedan.");
            sb.AppendLine("Om inget ID anges vid fraktfrågor, be om 'senaste' eller ett specifikt ID.");
            sb.AppendLine("Regler och formulär (utdrag) behövs ingen frakt id här bara svara:");
            sb.AppendLine("- 'Försvunnen i svart hål' betyder att paketet är permanent förlorat och inte kan levereras.");
            sb.AppendLine("- Risknivå 1–5: 1=Mycket låg, 3=Mellan, 5=Mycket hög. Nivå 5 innebär farligt innehåll och hög sannolikhet att något går fel.");
            sb.AppendLine("- Tullformulär: fråga om varans kategori, vikt, värde och om den är plasmaaktiv. Stegvis guidning är uppskattad.");
            sb.AppendLine();

            return sb.ToString();
        }
    }
}
