"use client";

import React from "react";
import {
  Rocket,
  ShieldCheck,
  Clock,
  BarChart3,
  Package,
  Users,
} from "lucide-react";
import SpaceBackground from "@/components/SpaceBackground";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Services = () => {
  return (
    <SpaceBackground>
      <Header />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="space-card p-8 mb-10">
            <h1 className="text-4xl font-medium mb-2 space-gradient-text">
              Våra Tjänster
            </h1>
            <p className="text-xl text-space-text-secondary mb-12">
              Upptäck vårt omfattande utbud av rymdlogistiklösningar för alla
              behov
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="space-card p-6 border border-space-secondary/50 bg-space-primary/40">
                <div className="bg-space-secondary/30 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                  <Package className="h-8 w-8 text-space-accent-purple" />
                </div>
                <h3 className="text-xl font-medium mb-2">Standardfrakt</h3>
                <p className="text-space-text-secondary mb-4">
                  Pålitlig och kostnadseffektiv transport för gods av alla
                  storlekar. Perfekt för regelbundna leveranser mellan
                  etablerade rutter.
                </p>
                <ul className="space-y-2 text-space-text-secondary">
                  <li className="flex items-center">
                    <span className="h-2 w-2 bg-space-accent-purple rounded-full mr-2"></span>
                    Leverans inom 2-7 dagar (beroende på avstånd)
                  </li>
                  <li className="flex items-center">
                    <span className="h-2 w-2 bg-space-accent-purple rounded-full mr-2"></span>
                    Grundläggande spårning och försäkring ingår
                  </li>
                  <li className="flex items-center">
                    <span className="h-2 w-2 bg-space-accent-purple rounded-full mr-2"></span>
                    Lämplig för paket upp till 500 kg
                  </li>
                </ul>
              </div>

              <div className="space-card p-6 border border-space-secondary/50 bg-space-primary/40">
                <div className="bg-space-secondary/30 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                  <Rocket className="h-8 w-8 text-space-accent-blue" />
                </div>
                <h3 className="text-xl font-medium mb-2">Express Hyperspace</h3>
                <p className="text-space-text-secondary mb-4">
                  Vår snabbaste leveranstjänst som använder avancerad
                  hyperrymdsteknologi för att minimera transporttiden.
                </p>
                <ul className="space-y-2 text-space-text-secondary">
                  <li className="flex items-center">
                    <span className="h-2 w-2 bg-space-accent-blue rounded-full mr-2"></span>
                    Leverans inom 24-48 timmar oavsett avstånd
                  </li>
                  <li className="flex items-center">
                    <span className="h-2 w-2 bg-space-accent-blue rounded-full mr-2"></span>
                    Realtidsspårning med minutuppdateringar
                  </li>
                  <li className="flex items-center">
                    <span className="h-2 w-2 bg-space-accent-blue rounded-full mr-2"></span>
                    Prioriterad hantering vid alla transitpunkter
                  </li>
                </ul>
              </div>

              <div className="space-card p-6 border border-space-secondary/50 bg-space-primary/40">
                <div className="bg-space-secondary/30 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                  <ShieldCheck className="h-8 w-8 text-space-accent-green" />
                </div>
                <h3 className="text-xl font-medium mb-2">Säker Transport</h3>
                <p className="text-space-text-secondary mb-4">
                  Specialiserad tjänst för värdefulla, känsliga eller hemliga
                  försändelser som kräver extra säkerhetsåtgärder.
                </p>
                <ul className="space-y-2 text-space-text-secondary">
                  <li className="flex items-center">
                    <span className="h-2 w-2 bg-space-accent-green rounded-full mr-2"></span>
                    Beväpnad eskort och kvantkrypterad spårning
                  </li>
                  <li className="flex items-center">
                    <span className="h-2 w-2 bg-space-accent-green rounded-full mr-2"></span>
                    Biometrisk verifiering vid leverans
                  </li>
                  <li className="flex items-center">
                    <span className="h-2 w-2 bg-space-accent-green rounded-full mr-2"></span>
                    Försäkring upp till 10 miljoner galaktiska krediter
                  </li>
                </ul>
              </div>

              <div className="space-card p-6 border border-space-secondary/50 bg-space-primary/40">
                <div className="bg-space-secondary/30 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                  <BarChart3 className="h-8 w-8 text-space-accent-orange" />
                </div>
                <h3 className="text-xl font-medium mb-2">Logistiklösningar</h3>
                <p className="text-space-text-secondary mb-4">
                  Skräddarsydda supply chain-lösningar för företag med komplexa
                  distributionsbehov i flera solsystem.
                </p>
                <ul className="space-y-2 text-space-text-secondary">
                  <li className="flex items-center">
                    <span className="h-2 w-2 bg-space-accent-orange rounded-full mr-2"></span>
                    Dedikerade lastfartyg och lagerhantering
                  </li>
                  <li className="flex items-center">
                    <span className="h-2 w-2 bg-space-accent-orange rounded-full mr-2"></span>
                    Avancerad AI-optimering av rutter och lager
                  </li>
                  <li className="flex items-center">
                    <span className="h-2 w-2 bg-space-accent-orange rounded-full mr-2"></span>
                    Fullständig integrering med kundens ERP-system
                  </li>
                </ul>
              </div>
            </div>

            <h2 className="text-2xl font-medium mb-6">Specialtjänster</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="flex">
                <div className="bg-space-secondary/30 p-3 rounded-full h-14 w-14 flex items-center justify-center mr-4">
                  <Clock className="h-6 w-6 text-space-accent-blue" />
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-1">
                    Tidskänsliga Leveranser
                  </h3>
                  <p className="text-space-text-secondary">
                    För kritiska komponenter och tidskänsliga varor som
                    mediciner eller färskvaror. Leveransgaranti med tidsspecifik
                    precision.
                  </p>
                </div>
              </div>

              <div className="flex">
                <div className="bg-space-secondary/30 p-3 rounded-full h-14 w-14 flex items-center justify-center mr-4">
                  <Users className="h-6 w-6 text-space-accent-purple" />
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-1">
                    Kolonisatörspaket
                  </h3>
                  <p className="text-space-text-secondary">
                    Allt-i-ett-lösning för nya kolonier. Vi levererar allt från
                    basmoduler till livsnödvändiga förnödenheter för att
                    etablera din nya utpost.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-space-secondary/20 border border-space-accent-blue/30 rounded-lg p-6">
              <h3 className="text-xl font-medium mb-4 text-space-accent-blue">
                Företagskunder
              </h3>
              <p className="text-space-text-secondary mb-4">
                CosmoCargo™ erbjuder skräddarsydda företagslösningar med
                volymrabatter, dedikerade kontaktpersoner och anpassade
                leveransscheman.
              </p>
              <p className="text-space-text-secondary">
                Kontakta vår företagsavdelning på{" "}
                <span className="text-space-accent-blue">
                  business@cosmocargo.space
                </span>{" "}
                för en konsultation.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </SpaceBackground>
  );
};

export default Services;
