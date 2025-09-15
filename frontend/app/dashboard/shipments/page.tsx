"use client";

import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle, Plane, Loader } from "lucide-react";
import { assignPilot, getShipments, updateShipmentStatus } from "@/services/shipment-service";
import { useQuery } from "@tanstack/react-query";
import { getPilots } from "@/services/pilot-service";
import Pagination from "@/components/ui/pagination";
import ShipmentTable from "@/components/ShipmentTable";
import Shipment from "@/model/shipment";
import { ShipmentStatus } from "@/model/types";
import { PilotsFilterDto, ShipmentsFilterDto } from "@/model/dtos";

const ShipmentManagement = () => {
  const { user } = useAuth();
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [selectedPilot, setSelectedPilot] = useState<string>("");
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [page, setPage] = useState(1);
  
  const { data: shipments, refetch, isLoading: shipmentsLoading } = useQuery({
    queryKey: ["shipments", page],
    queryFn: () => {
      const filter: ShipmentsFilterDto = {
        page,
        pageSize: 10
      };
      return getShipments(filter);
    },
  });

  const { data: pilots } = useQuery({
    queryKey: ["pilots", page],
    queryFn: () => {
      const filter: PilotsFilterDto = {
        page,
        pageSize: 10
      };
      return getPilots(filter);
    },
  });

  const handleAction = async (
    shipment: Shipment,
    action: "approve" | "denied" | "assign"
  ) => {
    setSelectedShipment(shipment);
    if (action === "approve") {
      await updateShipmentStatus(shipment.id, {status: ShipmentStatus.Approved});
    } else if (action === "denied") {
      await updateShipmentStatus(shipment.id, {status: ShipmentStatus.Denied});
    } else {
      setShowAssignDialog(true);
      setSelectedPilot("");
    }
  };

  const confirmAction = async (action: "assign") => {
    if (action === "assign") {
      if (!selectedPilot) {
        toast.error("Välj en pilot först");
        return;
      }
      if (!selectedShipment) {
        toast.error("Välj en frakt först");
        return;
      }
      await assignPilot(selectedShipment.id, {pilotId: selectedPilot});
      toast.success(
        `Frakt ${selectedShipment.id} har tilldelats`
      );
      setShowAssignDialog(false);
      refetch();
    }
  };

  if (user?.role !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <AlertCircle className="w-16 h-16 text-space-danger mb-4" />
        <h2 className="text-2xl font-medium mb-2">Åtkomst nekad</h2>
        <p className="text-space-text-secondary text-center">
          Du har inte behörighet att hantera frakter. Denna sida är endast för
          administratörer.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-medium tracking-tight">
            Hantera Frakter
          </h1>
          <p className="text-space-text-secondary">
            Godkänn, tilldela och övervaka frakter
          </p>
        </div>
      </div>

      {shipmentsLoading && (
        <div className="flex flex-col items-center justify-center h-64 p-8">
          <Loader className="w-12 h-12 text-space-text-secondary mb-4 animate-spin" />
        </div>
      )}
      
      <ShipmentTable shipments={shipments?.items || []} handleAction={(shipment, action) => handleAction(shipment, action as "approve" | "denied" | "assign")} />

      {shipments && shipments.totalPages > 1 && (
        <Pagination
          totalCount={shipments.totalCount}
          page={page}
          pageSize={shipments.pageSize}
          totalPages={shipments.totalPages}
          onPageChange={setPage}
        />
      )}

      {/* Assign Dialog */}
      <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tilldela Pilot</DialogTitle>
            <DialogDescription>
              Välj en pilot för frakt {selectedShipment?.id} från{" "}
              {selectedShipment?.sender.planet} till {selectedShipment?.receiver.planet}.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Tillgängliga Piloter
              </label>
              <Select value={selectedPilot} onValueChange={setSelectedPilot}>
                <SelectTrigger>
                  <SelectValue placeholder="Välj en pilot" />
                </SelectTrigger>
                <SelectContent>
                  {pilots?.items.filter((p) => p.isActive).map((pilot) => (
                    <SelectItem key={pilot.id} value={pilot.id}>
                      {pilot.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAssignDialog(false)}
            >
              Avbryt
            </Button>
            <Button onClick={() => confirmAction("assign")}>
              <Plane className="h-4 w-4 mr-2" />
              Tilldela Pilot
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ShipmentManagement;
