"use client";

import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { CheckCircle, AlertCircle, Loader } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getShipments, updateShipmentStatus } from "@/services/shipment-service";
import Pagination from "@/components/ui/pagination";
import ShipmentTable from "@/components/ShipmentTable";
import { ShipmentStatus } from "@/model/types";
import { toast } from "sonner";
import Shipment from "@/model/shipment";
import { ShipmentsFilterDto } from "@/model/dtos";

const AssignedShipments = () => {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  
  const { data: shipments, isLoading, refetch } = useQuery({
    queryKey: ["shipments", page],
    queryFn: () => {
      const filter: ShipmentsFilterDto = {
        page,
        pageSize: 10
      };
      return getShipments(filter);
    },
  });

  if (user?.role !== "pilot") {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <AlertCircle className="w-16 h-16 text-space-danger mb-4" />
        <h2 className="text-2xl font-medium mb-2">Åtkomst nekad</h2>
        <p className="text-space-text-secondary text-center">
          Du har inte behörighet att se tilldelade frakter. Denna sida är endast
          för piloter.
        </p>
      </div>
    );
  }

  const handleAction = async (shipment: Shipment, action: string) => {
    try {
      switch (action) {
        case "start-transport":
          await updateShipmentStatus(shipment.id, { status: ShipmentStatus.InTransit });
          toast.success(
            `Frakt ${shipment.id} har påbörjat transport`
          );
          refetch();
          break;
        
        case "mark-delivered":
          await updateShipmentStatus(shipment.id, { status: ShipmentStatus.Delivered });
          toast.success(
            `Frakt ${shipment.id} har markerats som levererad`
          );
          refetch();
          break;
        
        case "assign-to-me":
          // Här skulle du kunna lägga till logik för att tilldela frakten till sig själv
          // await assignShipmentToPilot(shipment.id, user.id);
          toast.info("Funktionalitet för att tilldela frakt kommer snart");
          break;
        
        case "view":
          // Här skulle du kunna navigera till en detaljsida
          toast.info("Detaljvy kommer snart");
          break;
        
        default:
          console.log("Okänd action:", action);
      }
    } catch (error) {
      toast.error("Ett fel uppstod vid uppdatering av frakt");
      console.error("Error updating shipment:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-medium tracking-tight">
            Tilldelade Frakter
          </h1>
          <p className="text-space-text-secondary">
            Hantera dina tilldelade frakter och uppdatera deras status
          </p>
        </div>
      </div>

      {shipments && shipments.items.length > 0 ? (
        <ShipmentTable 
          shipments={shipments.items} 
          handleAction={handleAction}
          showPagination={true}
          currentPage={page}
          pageSize={10}
        />
      ) : isLoading ? (
        <div className="flex flex-col items-center justify-center h-64 p-8">
          <Loader className="w-12 h-12 text-space-text-secondary mb-4 animate-spin" />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 border border-dashed border-space-secondary rounded-md p-8">
          <CheckCircle className="w-12 h-12 text-space-text-secondary mb-4" />
          <h3 className="text-xl font-medium mb-1">Inga tilldelade frakter</h3>
          <p className="text-space-text-secondary text-center">
            Du har inga tilldelade frakter för tillfället. När en administratör
            tilldelar dig frakter kommer de att visas här.
          </p>
        </div>
      )}

      {shipments && shipments.totalPages > 1 && (
        <Pagination
          totalCount={shipments.totalCount}
          page={page}
          pageSize={shipments.pageSize}
          totalPages={shipments.totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
};

export default AssignedShipments;
