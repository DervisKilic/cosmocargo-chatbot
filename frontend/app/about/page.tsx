"use client";

import React from "react";
import SpaceBackground from "@/components/SpaceBackground";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const About = () => {
  return (
    <SpaceBackground>
      <Header />

      <div className="container mx-auto px-4 py-16">
        <div className="space-card p-8 mb-10">
          <h1 className="text-4xl font-medium mb-6 space-gradient-text">
            Om CosmoCargo™
          </h1>

          <div className="prose prose-invert max-w-none">
            <p className="text-lg mb-4">
              CosmoCargo™ grundades år 2257 med visionen att revolutionera
              rymdlogistik och göra interplanetära leveranser så enkla som att
              skicka ett paket på jorden.
            </p>

            <h2 className="text-2xl font-medium mt-8 mb-4">Vår Historia</h2>
            <p className="mb-4">
              Det som började som ett litet fraktföretag med endast tre skepp i
              omloppsbana runt Mars har nu vuxit till galaxens mest betrodda
              logistikpartner med över 1000 rymdskepp och 9000 servicepunkter
              spridda över hela solsystemet och bortom.
            </p>

            <div className="relative rounded-lg overflow-hidden h-64 my-8">
              <div className="absolute inset-0 bg-gradient-to-r from-space-accent-blue/30 to-space-accent-purple/30 mix-blend-overlay z-10"></div>
              <div className="absolute inset-0 bg-space-dark/80"></div>
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <p className="text-2xl font-medium text-center space-gradient-text">
                  Levererar sedan 2257
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-medium mt-8 mb-4">Vårt Uppdrag</h2>
            <p className="mb-4">
              Vårt uppdrag är att koppla samman galaxens avlägsna hörn genom
              säkra, snabba och pålitliga leveranser. Vi tror på att
              rymdlogistik ska vara tillgänglig för alla, från individuella
              kolonister till stora interplanetära företag.
            </p>

            <h2 className="text-2xl font-medium mt-8 mb-4">Våra Värderingar</h2>
            <ul className="list-disc pl-6 mb-6">
              <li className="mb-2">
                <strong>Säkerhet:</strong> Vi prioriterar säkerheten för din
                last över allt annat, med avancerade skyddssystem och
                fullständig spårning.
              </li>
              <li className="mb-2">
                <strong>Innovation:</strong> Vi ligger alltid i framkant med den
                senaste rymdteknologin för att optimera rutter och minimera
                leveranstider.
              </li>
              <li className="mb-2">
                <strong>Hållbarhet:</strong> Vi är engagerade i att minska vårt
                kosmiska fotavtryck genom att använda förnybara energikällor och
                återvunna material.
              </li>
              <li className="mb-2">
                <strong>Kundfokus:</strong> Din tillfredsställelse är vårt
                främsta mål, med 24/7 kundtjänst på alla större planeter och
                stationer.
              </li>
            </ul>

            <h2 className="text-2xl font-medium mt-8 mb-4">Ledningsgrupp</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-card p-4">
                <h3 className="text-xl font-medium mb-2">Dr. Elara Vex</h3>
                <p className="text-sm text-space-text-secondary mb-2">
                  VD & Grundare
                </p>
                <p>
                  Tidigare styrelseledamot i Marskolonins handelskammare, med 30
                  års erfarenhet av interplanetär logistik.
                </p>
              </div>
              <div className="space-card p-4">
                <h3 className="text-xl font-medium mb-2">Zephyr Ando</h3>
                <p className="text-sm text-space-text-secondary mb-2">
                  Teknisk Direktör
                </p>
                <p>
                  Pionjär inom kvantnavigering och hyperrymdsdriftsoptimering.
                  Tidigare chefsingenjör på Saturn Orbital Labs.
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

export default About;
