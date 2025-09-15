import React from "react";
import { ArrowRight, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatusBadge from "./StatusBadge";

export interface FreightData {
  id: string;
  destination: string;
  status: string;
  weight?: string;
  priority?: string;
  customer?: string;
  pilot?: string | null;
  createdAt?: string;
  estimatedDelivery?: string;
  cargoType?: string;
  specialInstructions?: string;
  estimatedValue?: string;
  approvedAt?: string;
}

interface FreightCardProps {
  freight: FreightData;
  userRole: "customer" | "pilot" | "admin";
  onAction?: (action: string, freightId: string, data?: unknown) => void;
  showActions?: boolean;
  compact?: boolean;
}

const FreightCard: React.FC<FreightCardProps> = ({ 
  freight, 
  userRole, 
  onAction, 
  showActions = true,
  compact = false 
}) => {
  const renderFields = () => {
    const fields = [];

    // Gemensamma fält
    fields.push(
      <div key="destination">
        <p className="text-space-text-secondary text-sm">Destination</p>
        <p className="text-space-text-primary font-medium">{freight.destination}</p>
      </div>
    );

    // Rollspecifika fält
    if (userRole === "admin") {
      if (freight.customer) {
        fields.push(
          <div key="customer">
            <p className="text-space-text-secondary text-sm">Kund</p>
            <p className="text-space-text-primary font-medium">{freight.customer}</p>
          </div>
        );
      }
      if (freight.estimatedValue) {
        fields.push(
          <div key="value">
            <p className="text-space-text-secondary text-sm">Uppskattat värde</p>
            <p className="text-space-text-primary font-medium">{freight.estimatedValue}</p>
          </div>
        );
      }
    }

    if (userRole === "pilot" || userRole === "admin") {
      if (freight.weight) {
        fields.push(
          <div key="weight">
            <p className="text-space-text-secondary text-sm">Vikt</p>
            <p className="text-space-text-primary font-medium">{freight.weight}</p>
          </div>
        );
      }
      if (freight.cargoType) {
        fields.push(
          <div key="cargoType">
            <p className="text-space-text-secondary text-sm">Lasttyp</p>
            <p className="text-space-text-primary font-medium">{freight.cargoType}</p>
          </div>
        );
      }
    }

    if (freight.estimatedDelivery) {
      fields.push(
        <div key="delivery">
          <p className="text-space-text-secondary text-sm">
            {userRole === "pilot" ? "Beräknad leverans" : "Leveransdatum"}
          </p>
          <p className="text-space-text-primary font-medium">{freight.estimatedDelivery}</p>
        </div>
      );
    }

    if (userRole === "customer" && freight.pilot) {
      fields.push(
        <div key="pilot">
          <p className="text-space-text-secondary text-sm">Pilot</p>
          <p className="text-space-text-primary font-medium">{freight.pilot}</p>
        </div>
      );
    }

    if (freight.createdAt) {
      fields.push(
        <div key="created">
          <p className="text-space-text-secondary text-sm">
            {userRole === "admin" ? "Skapat" : "Bokningsdatum"}
          </p>
          <p className="text-space-text-primary font-medium">{freight.createdAt}</p>
        </div>
      );
    }

    return fields;
  };

  const renderActions = () => {
    if (!showActions || !onAction) return null;

    const actions = [];

    if (userRole === "admin") {
      if (freight.status === "Väntar godkännande") {
        actions.push(
          <Button
            key="approve"
            onClick={() => onAction("approve", freight.id)}
            className="bg-emerald-600 hover:bg-emerald-700"
            size="sm"
          >
            Godkänn
          </Button>,
          <Button
            key="reject"
            onClick={() => onAction("reject", freight.id)}
            variant="destructive"
            size="sm"
          >
            Neka
          </Button>
        );
      }
    }

    if (userRole === "pilot") {
      if (freight.status === "Tilldelad") {
        actions.push(
          <Button
            key="start"
            onClick={() => onAction("start_transport", freight.id)}
            className="bg-blue-600 hover:bg-blue-700"
            size="sm"
          >
            Starta transport
          </Button>
        );
      } else if (freight.status === "Under Transport") {
        actions.push(
          <Button
            key="deliver"
            onClick={() => onAction("deliver", freight.id)}
            className="bg-emerald-600 hover:bg-emerald-700"
            size="sm"
          >
            Markera levererad
          </Button>
        );
      }
    }

    // Gemensam detalj-knapp
    actions.push(
      <Button
        key="details"
        variant="outline"
        className="border-space-secondary hover:bg-space-secondary/30"
        size="sm"
        onClick={() => onAction("view_details", freight.id)}
      >
        <Info className="h-4 w-4 mr-2" />
        {compact ? "Detaljer" : "Visa detaljer"}
      </Button>
    );

    return actions;
  };

  return (
    <div className="border border-space-secondary rounded-lg p-4 hover:bg-space-secondary/30 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <span className="font-medium text-space-text-primary text-lg">
              {freight.id}
            </span>
            <StatusBadge status={freight.status} />
            {freight.priority && (
              <StatusBadge status={freight.priority} variant="priority" />
            )}
          </div>
          
          <div className={`grid gap-4 mb-4 ${compact ? 'grid-cols-2' : 'grid-cols-1 md:grid-cols-3'}`}>
            {renderFields()}
          </div>

        </div>
        
        {!showActions && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-space-text-secondary">
              {freight.createdAt}
            </span>
            <ArrowRight className="h-4 w-4 text-space-text-secondary" />
          </div>
        )}
      </div>

      {showActions && (
        <div className="flex gap-2 mt-4 pt-4 border-t border-space-secondary">
          {renderActions()}
        </div>
      )}
    </div>
  );
};

export default FreightCard; 