import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ClientProviders from "@/components/ClientProviders";
import React from "react";
import ChatbotButton from "@/components/ui/ChatbotButton";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CosmoCargo™ - Intergalaktisk Fraktcentral",
  description: "Den ledande aktören inom rymdlogistik",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sv">
      <body className={inter.className}>
        <ClientProviders>
          {children}
          <ChatbotButton />
        </ClientProviders>
      </body>
    </html>
  );
}
