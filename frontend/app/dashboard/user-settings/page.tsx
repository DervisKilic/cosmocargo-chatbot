"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const UserSettings = () => {
  const { user, updateUserProfile } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // In a real app, this would make an API call to update the user's name
      // For now, we'll just simulate success
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (updateUserProfile) {
        updateUserProfile({ name });
      }

      toast.success("Profil uppdaterad");
    } catch {
      toast.error("Ett fel uppstod vid uppdatering av profilen");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-medium mb-6 text-space-text-primary">
        Profilinställningar
      </h1>

      <div className="grid gap-6">
        <Card className="bg-space-secondary border-space-secondary/30">
          <CardHeader>
            <CardTitle className="text-space-text-primary">
              Personlig information
            </CardTitle>
            <CardDescription className="text-space-text-secondary">
              Uppdatera dina personuppgifter här.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-space-text-primary">
                  Namn
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-space-primary border-space-secondary/50 text-space-text-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-space-text-primary">
                  E-post
                </Label>
                <Input
                  id="email"
                  value={user?.email}
                  disabled
                  className="bg-space-primary/50 border-space-secondary/50 text-space-text-secondary"
                />
                <p className="text-xs text-space-text-secondary">
                  E-postadressen kan inte ändras.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role" className="text-space-text-primary">
                  Roll
                </Label>
                <Input
                  id="role"
                  value={
                    user?.role === "customer"
                      ? "Kund"
                      : user?.role === "pilot"
                      ? "Pilot"
                      : "Admin"
                  }
                  disabled
                  className="bg-space-primary/50 border-space-secondary/50 text-space-text-secondary"
                />
                <p className="text-xs text-space-text-secondary">
                  Din användarroll kan inte ändras här.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                disabled={
                  isLoading || name.trim() === "" || name === user?.name
                }
                className="ml-auto"
              >
                {isLoading ? "Sparar..." : "Spara ändringar"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default UserSettings;
