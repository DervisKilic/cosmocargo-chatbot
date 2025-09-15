"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Rocket,
  Home,
  ClipboardList,
  Settings,
  HelpCircle,
  LogOut,
  Package,
  PackageCheck,
  User,
} from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "../contexts/AuthContext";

const navItems = [
  {
    roles: ["customer"],
    title: "Kundmeny",
    items: [
      { icon: Home, label: "Översikt", href: "/dashboard" },
      { icon: Package, label: "Boka Frakt", href: "/dashboard/shipments/add" },
      {
        icon: PackageCheck,
        label: "Leveranser",
        href: "/dashboard/shipments/ongoing",
      },
    ],
  },
  {
    roles: ["pilot"],
    title: "Pilotmeny",
    items: [
      { icon: Home, label: "Översikt", href: "/dashboard" },
      {
        icon: Rocket,
        label: "Tilldelade Frakter",
        href: "/dashboard/shipments/assigned",
      },
    ],
  },
  {
    roles: ["admin"],
    title: "Adminmeny",
    items: [
      { icon: Home, label: "Översikt", href: "/dashboard" },
      {
        icon: ClipboardList,
        label: "Frakter",
        href: "/dashboard/shipments",
      },
      {
        icon: User,
        label: "Piloter",
        href: "/dashboard/pilots",
      },
    ],
  },
  {
    roles: ["customer", "pilot", "admin"],
    title: "Övrigt",
    items: [
      {
        icon: Settings,
        label: "Inställningar",
        href: "/dashboard/user-settings",
      },
      { icon: HelpCircle, label: "Hjälp", href: "/faq" },
    ],
  },
];

interface DashboardSidebarProps {
  isMobile?: boolean;
  onClose?: () => void;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  isMobile = false,
  onClose,
}) => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);
  const { user, logout } = useAuth();
  const userRole = user?.role || "customer";

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleItemClick = () => {
    if (isMobile && onClose) {
      onClose();
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  return (
    <aside
      className={`h-screen bg-space-primary border-r border-space-secondary/30 ${
        isOpen ? "w-64" : "w-20"
      } transition-all duration-300 flex flex-col`}
    >
      <div className="p-4 border-b border-space-secondary/30 flex items-center justify-between">
        <div
          className={`flex items-center ${!isOpen && "justify-center w-full"}`}
        >
          <Rocket
            className={`h-6 w-6 text-space-accent-purple ${
              !isOpen && "mx-auto"
            }`}
          />
          {isOpen && (
            <span className="ml-2 text-xl space-gradient-text font-orbitron font-bold">
              CosmoCargo™
            </span>
          )}
        </div>
        {!isMobile && (
          <Button
            variant="ghost"
            size="sm"
            className="text-space-text-secondary"
            onClick={toggleSidebar}
          >
            {isOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            )}
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3">
        {navItems
          .filter((section) => section.roles.includes(userRole))
          .map((section, i) => (
            <div key={i} className="mb-6">
              {isOpen && (
                <h3 className="px-3 mb-2 text-xs font-medium text-space-text-secondary uppercase tracking-wider">
                  {section.title}
                </h3>
              )}
              <ul className="space-y-1">
                {section.items.map((item, j) => (
                  <li key={j}>
                    <Link
                      href={item.href}
                      className={`flex items-center p-2 rounded-md transition-colors ${
                        pathname === item.href
                          ? "bg-space-secondary text-space-accent-purple"
                          : "text-space-text-primary hover:bg-space-secondary/50"
                      }`}
                      onClick={handleItemClick}
                    >
                      <item.icon
                        className={`h-5 w-5 ${!isOpen && "mx-auto"}`}
                      />
                      {isOpen && <span className="ml-3">{item.label}</span>}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
      </div>

      <div className="p-4 border-t border-space-secondary/30">
        <button
          onClick={handleLogout}
          className={`flex items-center p-2 w-full rounded-md text-space-danger hover:bg-space-secondary/50 ${
            !isOpen && "justify-center"
          }`}
        >
          <LogOut className="h-5 w-5" />
          {isOpen && <span className="ml-3">Logga ut</span>}
        </button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
