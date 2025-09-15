import React from "react";
import { 
  Users, 
  Package, 
  ArrowRight,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import KPIDashboard from "@/components/shared/KPIDashboard";

const AdminDashboard: React.FC = () => {

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-orbitron text-space-text-primary">
            Administratörspanel
          </h1>
          <p className="text-space-text-secondary">
            Systemöversikt och frakthantering
          </p>
        </div>
      </div>

      <KPIDashboard userRole="admin" />

      <Card className="space-card">
        <CardHeader>
          <CardTitle className="font-orbitron">Snabbnavigation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/dashboard/shipments">
              <div className="p-4 border border-space-secondary rounded-lg hover:bg-space-secondary/30 transition-colors cursor-pointer">
                <div className="flex items-center space-x-3">
                  <Package className="h-6 w-6 text-space-accent-purple" />
                  <div>
                    <h3 className="font-medium text-space-text-primary">Alla frakter</h3>
                    <p className="text-sm text-space-text-secondary">Komplett översikt</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-space-text-secondary ml-auto" />
                </div>
              </div>
            </Link>
            
            <Link href="/dashboard/pilots">
              <div className="p-4 border border-space-secondary rounded-lg hover:bg-space-secondary/30 transition-colors cursor-pointer">
                <div className="flex items-center space-x-3">
                  <Users className="h-6 w-6 text-space-accent-purple" />
                  <div>
                    <h3 className="font-medium text-space-text-primary">Hantera piloter</h3>
                    <p className="text-sm text-space-text-secondary">Pilot administration</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-space-text-secondary ml-auto" />
                </div>
              </div>
            </Link>
            
          </div>
        </CardContent>
      </Card>
      
    </div>
  );
};

export default AdminDashboard;
