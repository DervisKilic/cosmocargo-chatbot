"use client";

import { useEffect } from "react";
import Link from "next/link";
import SpaceBackground from "@/components/SpaceBackground";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { RefreshCcw, Home } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

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
              <RefreshCcw className="h-10 w-10 text-space-warning" />
            </div>

            <h1 className="text-5xl font-medium mb-2">Oj då!</h1>
            <p className="text-2xl font-medium mb-4 space-gradient-text">
              Kosmiskt fel
            </p>
            <p className="text-space-text-secondary mb-8">
              Ett oväntat fel har uppstått i vår rymdnavigeringsmatris. Vi
              beklagar besväret.
            </p>

            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 justify-center">
              <Button onClick={() => reset()} className="space-button">
                <RefreshCcw className="mr-2 h-4 w-4" />
                Försök igen
              </Button>
              <Link href="/">
                <Button variant="outline" className="space-button-secondary">
                  <Home className="mr-2 h-4 w-4" />
                  Tillbaka till hemstationen
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </SpaceBackground>
  );
}
