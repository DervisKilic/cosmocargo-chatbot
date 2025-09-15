"use client";

import React from "react";
import { Button } from "./ui/button";
import { ArrowRight, Rocket } from "lucide-react";
import Link from "next/link";

const HeroSection = () => {
  return (
    <div className="relative min-h-[calc(100vh-80px)] flex items-center">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-space-secondary/40 text-space-accent-purple text-sm mb-6">
            <Rocket size={16} className="mr-2" />
            <span>Ledande inom rymdlogistik</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6">
            <span className="space-gradient-text">Intergalaktisk</span>
            <br />
            Fraktcentral
          </h1>

          <p className="text-xl text-space-text-secondary mb-8 max-w-2xl mx-auto">
            Tillförlitliga leveranser till över 9000 rymdstationer. Boka din
            nästa frakt med CosmoCargo™ idag.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/login">
              <Button className="space-button group">
                Logga in
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>

            <Link href="/services">
              <Button
                variant="outline"
                className="border-space-accent-blue text-space-accent-blue hover:bg-space-accent-blue/10"
              >
                Läs mer om våra tjänster
              </Button>
            </Link>
          </div>

          <div className="mt-12 flex items-center justify-center space-x-8">
            <div>
              <p className="text-3xl font-medium space-gradient-text">9000+</p>
              <p className="text-sm text-space-text-secondary">Destinationer</p>
            </div>
            <div>
              <p className="text-3xl font-medium space-gradient-text">24/7</p>
              <p className="text-sm text-space-text-secondary">Support</p>
            </div>
            <div>
              <p className="text-3xl font-medium space-gradient-text">99.9%</p>
              <p className="text-sm text-space-text-secondary">
                Framgångsrika leveranser
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-1/3 left-10 w-24 h-24 bg-space-accent-purple/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-10 w-32 h-32 bg-space-accent-blue/10 rounded-full blur-3xl"></div>
    </div>
  );
};

export default HeroSection;
