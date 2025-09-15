"use client";

import React, { useState } from "react";
import { Search, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { getShipments } from "@/services/shipment-service";
import { ShipmentStatus } from "@/model/types";
import Pagination from "@/components/ui/pagination";
import ShipmentTable from "@/components/ShipmentTable";
import Shipment from "@/model/shipment";
import { toast } from "sonner";
import { ShipmentsFilterDto } from "@/model/dtos";

const OngoingShipments = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ShipmentStatus | "">("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data: shipments } = useQuery({
    queryKey: ["shipments", search, status, page, pageSize],
    queryFn: () => {
      const filter: ShipmentsFilterDto = {
        page,
        pageSize,
      };
      if (search) filter.search = search;
      if (status) filter.status = status as ShipmentStatus;
      return getShipments(filter);
    },
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(e.target.value as ShipmentStatus | "");
    setPage(1);
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(e.target.value));
    setPage(1);
  };

  const handleAction = (shipment: Shipment, action: string) => {
    switch (action) {
      case "view":
        toast.info("Detaljvy kommer snart");
        break;
      default:
        console.log("Okänd action:", action);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-medium tracking-tight">Leveranser</h1>
          <p className="text-space-text-secondary">
            Följ dina leveranser i realtid
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="relative w-full md:w-auto md:flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-space-text-secondary" />
          <Input
            placeholder="Sök fraktID eller destination..."
            className="pl-10 space-input w-full"
            value={search}
            onChange={handleSearch}
          />
        </div>

        <div className="flex gap-2">
          <select
            className="space-input"
            value={status}
            onChange={handleStatusChange}
          >
            <option value="">Alla statusar</option>
            <option value={ShipmentStatus.WaitingForApproval}>
              Väntar på godkännande
            </option>
            <option value={ShipmentStatus.Approved}>Godkänd</option>
            <option value={ShipmentStatus.Denied}>Nekad</option>
            <option value={ShipmentStatus.Assigned}>Tilldelad</option>
            <option value={ShipmentStatus.InTransit}>Under transport</option>
            <option value={ShipmentStatus.Delivered}>Levererad</option>
            <option value={ShipmentStatus.Cancelled}>Avbruten</option>
          </select>

          <select
            className="space-input"
            value={pageSize}
            onChange={handlePageSizeChange}
          >
            <option value={5}>5 per sida</option>
            <option value={10}>10 per sida</option>
            <option value={20}>20 per sida</option>
            <option value={50}>50 per sida</option>
          </select>
        </div>
      </div>

      {shipments && shipments.items.length > 0 ? (
        <ShipmentTable
          shipments={shipments.items}
          handleAction={handleAction}
          showPagination={true}
          currentPage={page}
          pageSize={pageSize}
        />
      ) : (
        <div className="flex flex-col items-center justify-center h-64 border border-dashed border-space-secondary rounded-md p-8">
          <Eye className="w-12 h-12 text-space-text-secondary mb-4" />
          <h3 className="text-xl font-medium mb-1">Inga frakter hittades</h3>
          <p className="text-space-text-secondary text-center">
            Inga frakter matchar dina sökkriterier. Försök ändra filtren eller
            söktermer.
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

export default OngoingShipments;
