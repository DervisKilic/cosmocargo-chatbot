"use client";

import SpaceBackground from "@/components/SpaceBackground";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import FeatureList from "@/components/FeatureList";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <SpaceBackground>
        <Header />
        <HeroSection />
        <FeatureList />
        <Footer />
      </SpaceBackground>
    </main>
  );
}
