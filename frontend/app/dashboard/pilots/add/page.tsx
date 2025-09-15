"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { createPilot } from "@/services/pilot-service";
import { useAuth } from "@/contexts/AuthContext";

const AddPilotPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    experience: "",
  });

  React.useEffect(() => {
    if (user && user.role !== "admin") {
      router.push("/dashboard");
      toast.error("Du har inte behörighet att se denna sida");
    }
  }, [user, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      toast.error("Namn och e-post är obligatoriska fält");
      return;
    }
    
    try {
      setIsSubmitting(true);
      await createPilot(formData);
      toast.success("Piloten har skapats");
      router.push("/dashboard/pilots");
    } catch (error) {
      console.error("Error creating pilot:", error);
      toast.error("Ett fel uppstod när piloten skulle skapas");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => router.push("/dashboard/pilots")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Tillbaka
        </Button>
        <h1 className="text-3xl font-bold text-space-text-primary">
          Lägg till ny pilot
        </h1>
      </div>

      <Card className="bg-space-primary border-space-secondary">
        <CardHeader>
          <CardTitle className="text-space-text-primary">Pilotinformation</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Namn *</label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ange pilotens namn"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">E-post *</label>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Ange pilotens e-postadress"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Erfarenhet</label>
              <Textarea
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                placeholder="Beskriv pilotens erfarenhet och kvalifikationer"
                rows={4}
              />
            </div>
            
            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard/pilots")}
              >
                Avbryt
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Sparar...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Spara
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddPilotPage; 