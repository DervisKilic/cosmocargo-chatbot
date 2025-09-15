"use client";

import React from "react";
import { useAuth } from "@/hooks/useAuth";
import CustomerDashboard from "@/components/dashboard/CustomerDashboard";
import PilotDashboard from "@/components/dashboard/PilotDashboard";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import { Loader2 } from "lucide-react";
import { UserRole } from "@/model/types";

const DashboardPage: React.FC = () => {
  const { user, isLoading, error } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-space-accent-purple" />
          <p className="text-space-text-secondary">Laddar dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-orbitron text-space-text-primary">
            Ett fel uppstod
          </h1>
          <p className="text-space-text-secondary">
            Kunde inte ladda dashboard. Försök igen senare.
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-orbitron text-space-text-primary">
            Otillåten åtkomst
          </h1>
          <p className="text-space-text-secondary">
            Du måste logga in för att se denna sida.
          </p>
        </div>
      </div>
    );
  }

  const renderDashboardByRole = () => {
    console.log("User role:", user.role);
    switch (user.role) {
      case UserRole.Customer:
        return <CustomerDashboard />;
      case UserRole.Pilot:
        return <PilotDashboard />;
      case UserRole.Admin:
        return <AdminDashboard />;
      default:
        return (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center space-y-4">
              <h1 className="text-2xl font-orbitron text-space-text-primary">
                Okänd användarroll
              </h1>
              <p className="text-space-text-secondary">
                Din användarroll är inte konfigurerad korrekt.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {renderDashboardByRole()}
    </div>
  );
};

export default DashboardPage;
