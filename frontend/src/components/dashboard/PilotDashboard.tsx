import React, { useState } from "react";
import { Ship, ArrowRight, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import KPIDashboard from "@/components/shared/KPIDashboard";
import { useQuery } from "@tanstack/react-query";
import { getShipments } from "@/services/shipment-service";
import { ShipmentStatus } from "@/model/types";

const PilotDashboard: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const { data: shipmentsData, isLoading, error } = useQuery({
    queryKey: ['pilot-shipments', currentPage],
    queryFn: () => getShipments({ 
      page: currentPage, 
      pageSize: itemsPerPage 
    }),
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Levererad":
        return "bg-emerald-100/10 text-emerald-500";
      case "Under Transport":
        return "bg-blue-100/10 text-blue-500";
      case "Tilldelad":
        return "bg-yellow-100/10 text-yellow-500";
      default:
        return "bg-gray-100/10 text-gray-500";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Hög":
        return "bg-red-100/10 text-red-500";
      case "Express":
        return "bg-orange-100/10 text-orange-500";
      case "Standard":
        return "bg-blue-100/10 text-blue-500";
      default:
        return "bg-gray-100/10 text-gray-500";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-space-accent-purple" />
          <p className="text-space-text-secondary">Laddar uppdrag...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Ett fel uppstod vid laddning av data</p>
      </div>
    );
  }

  const activeFreights = shipmentsData?.items.filter(f => f.status !== ShipmentStatus.Delivered) || [];
  const totalPages = Math.ceil((shipmentsData?.totalCount || 0) / itemsPerPage);

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-orbitron text-space-text-primary">
            Pilotcentral
          </h1>
          <p className="text-space-text-secondary">
            Hantera dina tilldelade uppdrag och leveranser
          </p>
        </div>
      </div>

      <KPIDashboard userRole="pilot" />

      <Card className="space-card">
        <CardHeader>
          <CardTitle className="font-orbitron">Snabbnavigation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/dashboard/shipments/assigned">
              <div className="p-4 border border-space-secondary rounded-lg hover:bg-space-secondary/30 transition-colors cursor-pointer">
                <div className="flex items-center space-x-3">
                  <Ship className="h-6 w-6 text-space-accent-purple" />
                  <div>
                    <h3 className="font-medium text-space-text-primary">
                      Alla tilldelade frakter
                    </h3>
                    <p className="text-sm text-space-text-secondary">
                      Se fullständig uppdragshistorik
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-space-text-secondary ml-auto" />
                </div>
              </div>
            </Link>
            <Link href="/dashboard/user-settings">
              <div className="p-4 border border-space-secondary rounded-lg hover:bg-space-secondary/30 transition-colors cursor-pointer">
                <div className="flex items-center space-x-3">
                  <Ship className="h-6 w-6 text-space-accent-purple" />
                  <div>
                    <h3 className="font-medium text-space-text-primary">
                      Dina inställningar
                    </h3>
                    <p className="text-sm text-space-text-secondary">
                      Gör ändringar till dina uppgifter
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-space-text-secondary ml-auto" />
                </div>
              </div>
            </Link>
            
          </div>
        </CardContent>
      </Card>

      <Card className="space-card">
        <CardHeader>
          <CardTitle className="font-orbitron flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Ship className="h-5 w-5 text-space-accent-purple" />
              <span>Mina aktiva uppdrag</span>
            </div>
            <div className="text-sm font-normal text-space-text-secondary">
              Sida {currentPage} av {totalPages} • {shipmentsData?.totalCount || 0} totalt
            </div>
          </CardTitle>
          <CardDescription>
            Frakter tilldelade till dig (visar {itemsPerPage} åt gången)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activeFreights.length === 0 ? (
              <p className="text-space-text-secondary text-center py-8">
                Inga aktiva frakter för närvarande
              </p>
            ) : (
              activeFreights.map((freight) => (
                <div
                  key={freight.id}
                  className="border border-space-secondary rounded-lg p-4 hover:bg-space-secondary/30 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="font-medium text-space-text-primary text-lg">
                          {freight.id}
                        </span>
                        <Badge className={getStatusColor(freight.status)}>
                          {freight.status}
                        </Badge>
                        <Badge className={getPriorityColor(freight.priority)}>
                          {freight.priority}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-space-text-secondary text-sm">Destination</p>
                          <p className="text-space-text-primary font-medium">{freight.destination?.planet || "Okänd planet"}</p>
                        </div>
                        <div>
                          <p className="text-space-text-secondary text-sm">Vikt</p>
                          <p className="text-space-text-primary font-medium">{freight.weight || "Okänd vikt"}</p>
                        </div>
                        <div>
                          <p className="text-space-text-secondary text-sm">Lasttyp</p>
                          <p className="text-space-text-primary font-medium">{freight.category || "Okänd lasttyp"}</p>
                        </div>
                        <div>
                          <p className="text-space-text-secondary text-sm">Beräknad leverans</p>
                          <p className="text-space-text-primary font-medium">{freight.createdAt || "Okänt datum"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-space-secondary">
              <div className="text-sm text-space-text-secondary">
                Visar {((currentPage - 1) * itemsPerPage) + 1} till {Math.min(currentPage * itemsPerPage, shipmentsData?.totalCount || 0)} av {shipmentsData?.totalCount || 0} frakter
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className="border-space-secondary hover:bg-space-secondary/30"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Föregående
                </Button>
                
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNumber = i + 1;
                    const isCurrentPage = pageNumber === currentPage;
                    
                    return (
                      <Button
                        key={pageNumber}
                        variant={isCurrentPage ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(pageNumber)}
                        className={isCurrentPage ? 
                          "bg-space-accent-purple hover:bg-space-accent-purple/80" : 
                          "border-space-secondary hover:bg-space-secondary/30"
                        }
                      >
                        {pageNumber}
                      </Button>
                    );
                  })}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="border-space-secondary hover:bg-space-secondary/30"
                >
                  Nästa
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

    </div>
  );
};

export default PilotDashboard;
