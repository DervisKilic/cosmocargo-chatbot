"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import SpaceBackground from "@/components/SpaceBackground";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Lock, User, LogIn } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        router.push("/dashboard");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SpaceBackground>
      <Header />

      <main className="min-h-[calc(100vh-160px)] flex items-center justify-center px-4 py-12">
        <Card className="space-card w-full max-w-md z-50">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-medium">
              <Lock className="h-6 w-6 inline-block mr-2 text-space-accent-purple" />
              Logga in
            </CardTitle>
            <CardDescription className="text-space-text-secondary">
              Ange dina uppgifter för att få tillgång till ditt konto
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-post</Label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-5 w-5 text-space-text-secondary" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="din@email.com"
                    className="pl-10 space-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Lösenord</Label>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-5 w-5 text-space-text-secondary" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10 space-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" />
                <Label htmlFor="remember" className="text-sm font-normal">
                  Kom ihåg mig
                </Label>
              </div>
              <Button
                type="submit"
                className="space-button w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Loggar in...
                  </span>
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    Logga in
                  </>
                )}
              </Button>

              <div className="mt-4 p-3 bg-space-secondary/30 rounded-md">
                <p className="text-sm text-space-text-secondary">
                  <strong>Demo inloggningsuppgifter:</strong>
                </p>
                <p className="text-xs mt-1 text-space-text-secondary">
                  Kund: demo.customer@example.com / mKv2P8dXrL9F
                  <br />
                  Pilot: demo.pilot@example.com / zH7yB3tR5wQ9s
                  <br />
                  Admin: demo.admin@example.com / eT4xD6cV2gN8p
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </SpaceBackground>
  );
};

export default Login;
