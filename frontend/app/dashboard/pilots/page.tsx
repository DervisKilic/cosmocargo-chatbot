"use client";

import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  Rocket,
  UserPlus,
  UserCheck,
  UserX,
  Edit,
  Loader2,
  Search,
} from "lucide-react";
import { useQuery } from '@tanstack/react-query';
import { getPilots, Pilot, updatePilotStatus } from '@/services/pilot-service';
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Pagination from "@/components/ui/pagination";
import { PilotsFilterDto } from "@/model/dtos";

const PilotsManagement = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [filter, setFilter] = useState<PilotsFilterDto>({
    page: 1,
    pageSize: 10,
    search: '',
    isActive: undefined
  });

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['pilots', filter],
    queryFn: () => getPilots(filter),
  });

  const handleAction = async (
    pilot: Pilot,
    action: "approve" | "suspend"
  ) => {
    await updatePilotStatus(pilot.id, action === "approve");
    toast.success(
      `Pilot ${pilot.name} har ${action === "approve" ? "aktiverats" : "inaktiverats"}`
    );
    refetch();
  };

  const handleAddPilot = () => {
    router.push("/dashboard/pilots/add");
  };

  const handleEditPilot = (id: string) => {
    router.push(`/dashboard/pilots/${id}`);
  };

  const handlePageChange = (newPage: number) => {
    setFilter(prev => ({ ...prev, pageNumber: newPage }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(prev => ({ ...prev, search: e.target.value, pageNumber: 1 }));
  };

  const handleStatusFilterChange = (value: string) => {
    setFilter(prev => ({ ...prev, status: value, pageNumber: 1 }));
  };

  const handlePageSizeChange = (value: string) => {
    setFilter(prev => ({ ...prev, pageSize: parseInt(value), pageNumber: 1 }));
  };

  if (user?.role !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <AlertCircle className="w-16 h-16 text-space-danger mb-4" />
        <h2 className="text-2xl font-medium mb-2">Åtkomst nekad</h2>
        <p className="text-space-text-secondary text-center">
          Du har inte behörighet att hantera piloter. Denna sida är endast för
          administratörer.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-12 w-12 animate-spin text-space-accent-purple" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <AlertCircle className="w-16 h-16 text-space-danger mb-4" />
        <h2 className="text-2xl font-medium mb-2">Ett fel uppstod</h2>
        <p className="text-space-text-secondary text-center">
          Kunde inte hämta pilotdata. Försök igen senare.
        </p>
        <Button 
          onClick={() => refetch()} 
          className="mt-4 space-button"
        >
          Försök igen
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-space-text-primary">
          Pilothantering
        </h1>
        <Button className="space-button" onClick={handleAddPilot}>
          <UserPlus className="h-4 w-4 mr-2" />
          Lägg till pilot
        </Button>
      </div>

      <Card className="bg-space-primary border-space-secondary">
        <CardHeader>
          <CardTitle className="text-space-text-primary">Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">
                Status
              </label>
              <Select value={filter.isActive?.toString()} onValueChange={handleStatusFilterChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Välj status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="undefined">Alla statusar</SelectItem>
                  <SelectItem value="true">Aktiv</SelectItem>
                  <SelectItem value="false">Inaktiv</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">
                Antal per sida
              </label>
              <Select value={filter.pageSize?.toString()} onValueChange={handlePageSizeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Välj antal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">
                Sök
              </label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-space-text-secondary" />
                <Input
                  placeholder="Sök på namn eller email..."
                  className="pl-8"
                  value={filter.search}
                  onChange={handleSearchChange}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="rounded-md border border-space-secondary bg-space-primary">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Namn</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Erfarenhet</TableHead>
              <TableHead>Tilldelade Frakter</TableHead>
              <TableHead>Åtgärder</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.items.map((pilot, index) => (
              <TableRow key={pilot.id}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell className="flex items-center gap-2">
                  <Rocket className="h-4 w-4 text-space-accent-purple" />
                  {pilot.name}
                </TableCell>
                <TableCell>{pilot.email}</TableCell>
                <TableCell>
                  <Badge
                    className={
                      pilot.isActive ? "bg-green-500" : "bg-gray-500"
                    }
                  >
                    {pilot.isActive ? "Aktiv" : "Inaktiv"}
                  </Badge>
                </TableCell>
                <TableCell>{pilot.experience}</TableCell>
                <TableCell>{pilot.assignedShipments}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {!pilot.isActive ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-green-500 hover:text-green-700"
                        onClick={() => handleAction(pilot, "approve")}
                      >
                        <UserCheck className="h-4 w-4 mr-1" />
                        Aktivera
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleAction(pilot, "suspend")}
                      >
                        <UserX className="h-4 w-4 mr-1" />
                        Inaktivera
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditPilot(pilot.id)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Redigera
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {data && data.totalPages > 0 && (
        <Pagination
          totalCount={data.totalCount}
          page={data.page}
          pageSize={data.pageSize}
          totalPages={data.totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default PilotsManagement;
