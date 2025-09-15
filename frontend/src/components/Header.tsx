"use client";

import React, { useState } from "react";
import { Menu, X, Rocket, User, LogIn, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Create a dummy auth implementation to avoid errors
const useDummyAuth = () => {
  return {
    isAuthenticated: false,
    user: null,
    logout: () => {},
  };
};

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // Use the dummy auth instead of the real one until we properly set up auth
  const { isAuthenticated, logout } = useDummyAuth();
  const router = useRouter();

  const handleLoginClick = () => {
    router.push("/login");
    setIsMenuOpen(false);
  };

  const handleLogoutClick = () => {
    logout();
    setIsMenuOpen(false);
  };

  const handleDashboardClick = () => {
    router.push("/dashboard");
    setIsMenuOpen(false);
  };

  return (
    <header className="relative z-50 w-full">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Rocket className="h-8 w-8 text-space-accent-purple" />
          <span className="text-xl md:text-2xl space-gradient-text font-orbitron font-bold">
            CosmoCargo™
          </span>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link
            href="/"
            className="text-space-text-primary hover:text-space-accent-purple transition-colors"
          >
            Hem
          </Link>
          <Link
            href="/about"
            className="text-space-text-primary hover:text-space-accent-purple transition-colors"
          >
            Om Oss
          </Link>
          <Link
            href="/services"
            className="text-space-text-primary hover:text-space-accent-purple transition-colors"
          >
            Tjänster
          </Link>
          <Link
            href="/contact"
            className="text-space-text-primary hover:text-space-accent-purple transition-colors"
          >
            Kontakt
          </Link>

          {isAuthenticated ? (
            <>
              <Button
                variant="outline"
                className="border-space-accent-blue text-space-accent-blue hover:bg-space-accent-blue/10"
                onClick={handleDashboardClick}
              >
                <User className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
              <Button
                variant="outline"
                className="border-space-danger text-space-danger hover:bg-space-danger/10"
                onClick={handleLogoutClick}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logga ut
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              className="border-space-accent-blue text-space-accent-blue hover:bg-space-accent-blue/10"
              onClick={handleLoginClick}
            >
              <LogIn className="mr-2 h-4 w-4" />
              Logga in
            </Button>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-space-text-primary"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <nav className="md:hidden absolute w-full bg-space-primary/95 backdrop-blur-md border-b border-space-secondary/30 py-4 px-6 shadow-lg">
          <div className="flex flex-col space-y-4">
            <Link
              href="/"
              className="text-space-text-primary hover:text-space-accent-purple transition-colors py-2"
            >
              Hem
            </Link>
            <Link
              href="/about"
              className="text-space-text-primary hover:text-space-accent-purple transition-colors py-2"
            >
              Om Oss
            </Link>
            <Link
              href="/services"
              className="text-space-text-primary hover:text-space-accent-purple transition-colors py-2"
            >
              Tjänster
            </Link>
            <Link
              href="/contact"
              className="text-space-text-primary hover:text-space-accent-purple transition-colors py-2"
            >
              Kontakt
            </Link>

            {isAuthenticated ? (
              <>
                <Button
                  className="space-button w-full flex items-center justify-center"
                  onClick={handleDashboardClick}
                >
                  <User className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center border-space-danger text-space-danger"
                  onClick={handleLogoutClick}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logga ut
                </Button>
              </>
            ) : (
              <Button
                className="space-button w-full flex items-center justify-center"
                onClick={handleLoginClick}
              >
                <LogIn className="mr-2 h-4 w-4" />
                Logga in
              </Button>
            )}
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;
