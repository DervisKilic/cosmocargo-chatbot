"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserRole } from "@/model/types";
import { switchMockRole } from "@/hooks/useAuth";

const RoleSwitcher: React.FC = () => {
  if (process.env.NODE_ENV === "production") {
    return null;
  }

  const roles: { role: UserRole; label: string; description: string }[] = [
    { role: UserRole.Customer, label: "Kund", description: "Se och skapa egna frakter" },
    { role: UserRole.Pilot, label: "Pilot", description: "Hantera tilldelade uppdrag" },
    { role: UserRole.Admin, label: "Admin", description: "Systemöversikt och hantering" },
  ];

  return (
    <Card className="mb-6 bg-yellow-50 border-yellow-200">
      <CardHeader>
        <CardTitle className="text-yellow-800">🚧 Utvecklingsverktyg</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-yellow-700 mb-3">
          Växla mellan användarroller för att testa olika dashboards:
        </p>
        <div className="flex gap-2 flex-wrap">
          {roles.map(({ role, label }) => (
            <Button
              key={role}
              onClick={() => switchMockRole(role as UserRole)}
              variant="outline"
              size="sm"
              className="border-yellow-300 hover:bg-yellow-100"
            >
              {label}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RoleSwitcher; 