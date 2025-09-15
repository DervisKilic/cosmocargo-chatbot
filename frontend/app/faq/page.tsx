"use client";

import React from "react";
import SpaceBackground from "@/components/SpaceBackground";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Search } from "lucide-react";

const FAQ = () => {
  return (
    <SpaceBackground>
      <Header />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="space-card p-8 mb-10">
            <h1 className="text-4xl font-medium mb-6 space-gradient-text">
              Vanliga frågor
            </h1>

            <div className="relative mb-10">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-space-text-secondary" />
              </div>
              <input
                type="text"
                className="space-input w-full pl-10"
                placeholder="Sök bland vanliga frågor..."
              />
            </div>

            <div className="space-y-8">
              <div className="border-b border-space-secondary pb-6">
                <h3 className="text-xl font-medium mb-3">
                  Hur spårar jag min frakt?
                </h3>
                <p className="text-space-text-secondary">
                  Du kan spåra din frakt genom att logga in på ditt
                  CosmoCargo™-konto och navigera till &quot;Pågående Leveranser&quot;
                  eller genom att ange ditt spårningsnummer i spårningsverktyget
                  på vår hemsida. Vi erbjuder realtidsuppdateringar med exakt
                  position och beräknad ankomsttid.
                </p>
              </div>

              <div className="border-b border-space-secondary pb-6">
                <h3 className="text-xl font-medium mb-3">
                  Vad händer om min frakt skadas under transport?
                </h3>
                <p className="text-space-text-secondary">
                  Alla frakter genom CosmoCargo™ är automatiskt försäkrade upp
                  till 10,000 galaktiska krediter. För mer värdefulla
                  försändelser rekommenderar vi vår premiumförsäkring som täcker
                  upp till 1,000,000 galaktiska krediter. I händelse av skada,
                  kontakta vår kundsupport inom 14 standarddagar efter leverans.
                </p>
              </div>

              <div className="border-b border-space-secondary pb-6">
                <h3 className="text-xl font-medium mb-3">
                  Hur lång tid tar en leverans?
                </h3>
                <p className="text-space-text-secondary">
                  Leveranstiden beror på avståndet mellan ursprung och
                  destination, samt vald fraktmetod. Våra standardleveranser
                  mellan närliggande planeter tar vanligtvis 2-5 dagar, medan
                  interstellära frakter kan ta 7-21 dagar. För brådskande behov
                  erbjuder vi vår &quot;Hyperspace Express&quot; som kan leverera inom
                  samma system på under 24 timmar.
                </p>
              </div>

              <div className="border-b border-space-secondary pb-6">
                <h3 className="text-xl font-medium mb-3">
                  Kan jag skicka levande organismer?
                </h3>
                <p className="text-space-text-secondary">
                  Ja, CosmoCargo™ erbjuder specialiserade biostasiskapslar för
                  transport av levande organismer. Observera att alla livsformer
                  måste deklareras korrekt och överensstämma med interplanetära
                  karantänsregler. Vissa restriktioner kan gälla för specifika
                  arter. Kontakta vår kundtjänst för mer information.
                </p>
              </div>

              <div className="border-b border-space-secondary pb-6">
                <h3 className="text-xl font-medium mb-3">
                  Vilka betalningsmetoder accepterar ni?
                </h3>
                <p className="text-space-text-secondary">
                  Vi accepterar alla större interplanetära valutor, inklusive
                  Galaktiska Krediter, Lunara Tokens och Marsiska Denarer. Vi
                  stöder också kryptovalutor som SolarCoin och AsteroidChain.
                  Betalning kan genomföras via kvantöverföring,
                  bioidentifikation eller traditionell digitala metoder.
                </p>
              </div>

              <div className="border-b border-space-secondary pb-6">
                <h3 className="text-xl font-medium mb-3">
                  Kan jag ändra leveransadress efter att frakten har skickats?
                </h3>
                <p className="text-space-text-secondary">
                  Ja, adressändringar kan göras upp till 12 timmar innan
                  beräknad leverans till planebaserade destinationer, och upp
                  till 48 timmar för rymdstationer och kolonier. En mindre
                  omdirigieringsavgift kan tillkomma beroende på den nya
                  destinationen.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </SpaceBackground>
  );
};

export default FAQ;
