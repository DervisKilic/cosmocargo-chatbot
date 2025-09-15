import Shipment from "@/model/shipment";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import EmptyState from "./EmptyState";
import StatusBadge from "./StatusBadge";
import { Button } from "./ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { ShipmentStatus } from "@/model/types";
import { Eye } from "lucide-react";

interface ShipmentTableProps {
  shipments: Shipment[];
  handleAction: (shipment: Shipment, action: string) => void;
  showPagination?: boolean;
  currentPage?: number;
  pageSize?: number;
}

const ShipmentTable = ({ shipments, handleAction, showPagination, currentPage = 1, pageSize = 10 }: ShipmentTableProps) => {
  const { user } = useAuth();
  if (shipments.length === 0) {
    return <EmptyState />;
  }


  const renderActions = (shipment: Shipment) => {
    if (user?.role === "customer") {
      return (
        <Button size="sm" variant="outline" onClick={() => handleAction(shipment, "view")}>
          <Eye className="h-4 w-4 mr-2" />
          Detaljer
        </Button>
      );
    }

    if (user?.role === "pilot") {
      return (
        <div className="flex gap-2">
          {shipment.status === ShipmentStatus.Assigned && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAction(shipment, "start-transport")}
            >
              Påbörja Transport
            </Button>
          )}
          {shipment.status === ShipmentStatus.InTransit && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAction(shipment, "mark-delivered")}
            >
              Markera Levererad
            </Button>
          )}
          {shipment.status === ShipmentStatus.Approved && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAction(shipment, "assign-to-me")}
            >
              Tilldela mig
            </Button>
          )}
        </div>
      );
    }

    if (user?.role === "admin") {
      return (
        <div className="flex gap-2">
          {shipment.status === ShipmentStatus.WaitingForApproval && (
            <>
              <Button
                size="sm"
                onClick={() => handleAction(shipment, "approve")}
              >
                Godkänn
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleAction(shipment, "deny")}
              >
                Neka
              </Button>
            </>
          )}
          {shipment.status === ShipmentStatus.Approved && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAction(shipment, "assign-pilot")}
            >
              Tilldela Pilot
            </Button>
          )}
          <Button size="sm" variant="outline" onClick={() => handleAction(shipment, "view")}>
            <Eye className="h-4 w-4 mr-2" />
            Detaljer
          </Button>
        </div>
      );
    }

    return (
      <Button size="sm" variant="outline" onClick={() => handleAction(shipment, "view")}>
        <Eye className="h-4 w-4 mr-2" />
        Detaljer
      </Button>
    );
  };

  return (
    <div className="rounded-md border border-space-secondary bg-space-primary">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Kund</TableHead>
            <TableHead>Ursprung</TableHead>
            <TableHead>Destination</TableHead>
            <TableHead>Last</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Åtgärder</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {shipments.map((shipment, ix) => (
            <TableRow key={shipment.id}>
              <TableCell>
                {showPagination ? (currentPage - 1) * pageSize + ix + 1 : ix + 1}
              </TableCell>
              <TableCell>{shipment.sender.name}</TableCell>
              <TableCell>{shipment.sender.station + " @ " + shipment.sender.planet}</TableCell>
              <TableCell>{shipment.receiver.station + " @ " + shipment.receiver.planet}</TableCell>
              <TableCell>{shipment.category}</TableCell>
              <TableCell>
                <StatusBadge status={shipment.status} />
              </TableCell>
              <TableCell>
                {renderActions(shipment)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ShipmentTable;