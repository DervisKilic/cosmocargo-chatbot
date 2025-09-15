import React from "react";
import { Package, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import KPIDashboard from "@/components/shared/KPIDashboard";

const CustomerDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-orbitron text-space-text-primary">
            Välkommen tillbaka!
          </h1>
          <p className="text-space-text-secondary">
            Hantera dina frakter och skapa nya leveranser
          </p>
        </div>
      </div>

      <KPIDashboard userRole="customer" />

      <Card className="space-card">
        <CardHeader>
          <CardTitle className="font-orbitron">Snabbnavigation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/dashboard/shipments/book">
              <div className="p-4 border border-space-secondary rounded-lg hover:bg-space-secondary/30 transition-colors cursor-pointer">
                <div className="flex items-center space-x-3">
                  <Plus className="h-6 w-6 text-space-accent-purple" />
                  <div>
                    <h3 className="font-medium text-space-text-primary">
                      Skapa frakt
                    </h3>
                    <p className="text-sm text-space-text-secondary">
                      Boka en ny leverans
                    </p>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/dashboard/shipments/ongoing">
              <div className="p-4 border border-space-secondary rounded-lg hover:bg-space-secondary/30 transition-colors cursor-pointer">
                <div className="flex items-center space-x-3">
                  <Package className="h-6 w-6 text-space-accent-purple" />
                  <div>
                    <h3 className="font-medium text-space-text-primary">
                      Alla mina frakter
                    </h3>
                    <p className="text-sm text-space-text-secondary">
                      Se fullständig historik
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerDashboard;
