"use client";

import Link from "next/link";
import SpaceBackground from "@/components/SpaceBackground";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Home, AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <SpaceBackground>
      <Header />

      <main className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center px-4">
        <div className="space-card p-8 max-w-lg w-full text-center relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-space-accent-purple/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-space-accent-blue/20 rounded-full blur-3xl"></div>

          <div className="relative z-10">
            <div className="mx-auto w-20 h-20 bg-space-secondary rounded-full flex items-center justify-center mb-6">
              <AlertTriangle className="h-10 w-10 text-space-danger" />
            </div>

            <h1 className="text-5xl font-medium mb-2">404</h1>
            <p className="text-2xl font-medium mb-4 space-gradient-text">
              Lost in Space
            </p>
            <p className="text-space-text-secondary mb-8">
              Det ser ut som att du har färdats till okänt territorium. Denna
              koordinat existerar inte i vår kosmiska karta.
            </p>

            <Link href="/">
              <Button className="space-button">
                <Home className="mr-2 h-4 w-4" />
                Återvänd till hemstationen
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </SpaceBackground>
  );
}
