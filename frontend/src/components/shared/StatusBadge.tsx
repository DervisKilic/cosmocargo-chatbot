import React from "react";
import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: string;
  variant?: "default" | "priority";
}

const getStatusColor = (status: string, variant: "default" | "priority" = "default") => {
  if (variant === "priority") {
    switch (status) {
      case "Hög":
        return "bg-red-100/10 text-red-500";
      case "Express":
        return "bg-orange-100/10 text-orange-500";
      case "Standard":
        return "bg-blue-100/10 text-blue-500";
      default:
        return "bg-gray-100/10 text-gray-500";
    }
  }

  // Default status colors
  switch (status) {
    case "Levererad":
      return "bg-emerald-100/10 text-emerald-500";
    case "Under Transport":
      return "bg-blue-100/10 text-blue-500";
    case "Tilldelad":
      return "bg-yellow-100/10 text-yellow-500";
    case "Väntar godkännande":
      return "bg-orange-100/10 text-orange-500";
    case "Nekad":
      return "bg-red-100/10 text-red-500";
    default:
      return "bg-gray-100/10 text-gray-500";
  }
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, variant = "default" }) => {
  return (
    <Badge className={getStatusColor(status, variant)}>
      {status}
    </Badge>
  );
};

export default StatusBadge; 