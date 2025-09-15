"use client";

import React from "react";
import { Mail, Send, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import SpaceBackground from "@/components/SpaceBackground";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Contact = () => {
  return (
    <SpaceBackground>
      <Header />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="space-card p-8 mb-10">
            <h1 className="text-4xl font-medium mb-6 space-gradient-text">
              Kontakta Oss
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-medium mb-4">Nå oss</h2>
                <p className="text-space-text-secondary mb-6">
                  Har du frågor om våra tjänster eller behöver support? Vårt
                  team är redo att hjälpa dig, oavsett vilken del av galaxen du
                  befinner dig i.
                </p>

                <div className="space-y-4 mb-8">
                  <div className="flex items-start">
                    <div className="bg-space-secondary p-3 rounded-full mr-4">
                      <Mail className="h-6 w-6 text-space-accent-purple" />
                    </div>
                    <div>
                      <h3 className="font-medium">E-post</h3>
                      <p className="text-space-text-secondary">
                        info@cosmocargo.space
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-space-secondary p-3 rounded-full mr-4">
                      <MessageSquare className="h-6 w-6 text-space-accent-blue" />
                    </div>
                    <div>
                      <h3 className="font-medium">Live-chatt</h3>
                      <p className="text-space-text-secondary">
                        Tillgänglig 24/7 på alla större språk
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-space-secondary/30 p-4 rounded-lg border border-space-secondary/50 mb-6">
                  <h3 className="font-medium mb-2">Huvudkontor</h3>
                  <p className="text-space-text-secondary">
                    Station Alpha, Orbit Plaza 42
                    <br />
                    Andromeda Systemet
                    <br />
                    Sektor Z9-X7
                  </p>
                </div>

                <h3 className="font-medium mb-2">Öppettider - Kontoret</h3>
                <p className="text-space-text-secondary mb-6">
                  Standarddag: 0800 - 1800 GST
                  <br />
                  (Galaktisk Standardtid)
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-medium mb-4">Skicka meddelande</h2>
                <form className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block mb-2 font-medium">
                      Namn
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="space-input w-full"
                      placeholder="Ditt namn"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block mb-2 font-medium">
                      E-post
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="space-input w-full"
                      placeholder="din.email@exempel.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block mb-2 font-medium">
                      Ämne
                    </label>
                    <input
                      type="text"
                      id="subject"
                      className="space-input w-full"
                      placeholder="Vad gäller ditt meddelande?"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block mb-2 font-medium">
                      Meddelande
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      className="space-input w-full"
                      placeholder="Skriv ditt meddelande här..."
                    ></textarea>
                  </div>

                  <Button className="space-button w-full">
                    <Send className="mr-2 h-4 w-4" />
                    Skicka meddelande
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </SpaceBackground>
  );
};

export default Contact;
