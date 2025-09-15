"use client";

import React, { useState } from "react";
import { Bell, Menu, User, Settings, HelpCircle, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "../contexts/AuthContext";
import Link from "next/link";

interface DashboardHeaderProps {
  onMenuToggle: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onMenuToggle }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, logout } = useAuth();

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  return (
    <header className="py-3 px-4 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden mr-2"
          onClick={onMenuToggle}
        >
          <Menu className="h-6 w-6" />
        </Button>
      </div>

      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-0 right-0 h-2 w-2 bg-space-accent-purple rounded-full"></span>
        </Button>

        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center space-x-2"
            onClick={toggleProfile}
          >
            <div className="w-8 h-8 rounded-full bg-space-secondary flex items-center justify-center">
              <User className="h-5 w-5 text-space-accent-purple" />
            </div>
          </Button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-space-primary border border-space-secondary/30 py-1 z-40">
              <div className="px-4 py-2 border-b border-space-secondary/30">
                <p className="text-sm font-medium text-space-text-primary">
                  {user?.name}
                </p>
                <p className="text-xs text-space-text-secondary">
                  {user?.email}
                </p>
                <p className="text-xs mt-1 text-space-accent-purple capitalize">
                  {user?.role === "customer"
                    ? "Kund"
                    : user?.role === "pilot"
                    ? "Pilot"
                    : "Admin"}
                </p>
              </div>
              <ul>
                <li>
                  <Link
                    href="/dashboard/user-settings"
                    className="flex items-center px-4 py-2 text-sm text-space-text-primary hover:bg-space-secondary/50"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Min profil
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard/user-settings"
                    className="flex items-center px-4 py-2 text-sm text-space-text-primary hover:bg-space-secondary/50"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Inställningar
                  </Link>
                </li>
                <li>
                  <Link
                    href="/faq"
                    className="flex items-center px-4 py-2 text-sm text-space-text-primary hover:bg-space-secondary/50"
                  >
                    <HelpCircle className="h-4 w-4 mr-2" />
                    Hjälp & support
                  </Link>
                </li>
                <li className="border-t border-space-secondary/30">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-2 text-sm text-space-danger hover:bg-space-secondary/50"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logga ut
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
