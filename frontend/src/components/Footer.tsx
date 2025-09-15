"use client";

import React from "react";
import { Rocket, Mail, MapPin, PhoneCall, Github } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="border-t border-space-secondary/30 bg-space-primary">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <Rocket className="h-6 w-6 text-space-accent-purple mr-2" />
              <span className="text-xl font-bold space-gradient-text font-orbitron">
                CosmoCargo™
              </span>
            </div>
            <p className="text-space-text-secondary mb-4">
              Den ledande aktören inom rymdlogistik, med leveranser till över
              9000 rymdstationer.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-space-text-secondary hover:text-space-accent-purple"
              >
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a
                href="#"
                className="text-space-text-secondary hover:text-space-accent-purple"
              >
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a
                href="#"
                className="text-space-text-secondary hover:text-space-accent-purple"
              >
                <Github className="h-6 w-6" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Länkar</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-space-text-secondary hover:text-space-accent-purple transition-colors"
                >
                  Hem
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-space-text-secondary hover:text-space-accent-purple transition-colors"
                >
                  Om Oss
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="text-space-text-secondary hover:text-space-accent-purple transition-colors"
                >
                  Tjänster
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-space-text-secondary hover:text-space-accent-purple transition-colors"
                >
                  Kontakt
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-space-text-secondary hover:text-space-accent-purple transition-colors"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Tjänster</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/services"
                  className="text-space-text-secondary hover:text-space-accent-purple transition-colors"
                >
                  Fraktbokning
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="text-space-text-secondary hover:text-space-accent-purple transition-colors"
                >
                  Realtidsspårning
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="text-space-text-secondary hover:text-space-accent-purple transition-colors"
                >
                  Tulldeklaration
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="text-space-text-secondary hover:text-space-accent-purple transition-colors"
                >
                  Specialfrakter
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="text-space-text-secondary hover:text-space-accent-purple transition-colors"
                >
                  Försäkringar
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Kontakt</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-space-accent-purple mr-2 mt-0.5" />
                <span className="text-space-text-secondary">
                  Station Alpha, Orbit Plaza 42, Andromeda
                </span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-space-accent-purple mr-2" />
                <a
                  href="mailto:info@cosmocargo.space"
                  className="text-space-text-secondary hover:text-space-accent-purple"
                >
                  info@cosmocargo.space
                </a>
              </li>
              <li className="flex items-center">
                <PhoneCall className="h-5 w-5 text-space-accent-purple mr-2" />
                <a
                  href="tel:+123456789"
                  className="text-space-text-secondary hover:text-space-accent-purple"
                >
                  +1 (234) 567-89
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-space-secondary/30 mt-12 pt-8 text-center">
          <p className="text-space-text-secondary text-sm">
            &copy; {new Date().getFullYear()} CosmoCargo™. Alla rättigheter
            reserverade.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
