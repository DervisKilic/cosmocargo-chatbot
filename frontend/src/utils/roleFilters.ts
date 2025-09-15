import { FreightData } from "@/components/shared/FreightCard";

export type UserRole = "customer" | "pilot" | "admin";

export interface User {
  id: string;
  role: UserRole;
  name: string;
}

export const filterFreightsByRole = (
  freights: FreightData[],
  userRole: UserRole,
  userId?: string
): FreightData[] => {
  switch (userRole) {
    case "customer":
      // Kunder ser endast sina egna frakter
      return freights.filter(freight => freight.customer === userId);
    
    case "pilot":
      // Piloter ser endast tilldelade frakter
      return freights.filter(freight => freight.pilot === userId);
    
    case "admin":
      // Admins ser alla frakter
      return freights;
    
    default:
      return [];
  }
};

export const getVisibleFields = (userRole: UserRole): string[] => {
  const baseFields = ["id", "destination", "status"];
  
  switch (userRole) {
    case "customer":
      return [...baseFields, "createdAt", "pilot", "estimatedDelivery"];
    
    case "pilot":
      return [...baseFields, "weight", "cargoType", "priority", "specialInstructions", "estimatedDelivery"];
    
    case "admin":
      return [...baseFields, "customer", "weight", "cargoType", "priority", "estimatedValue", "createdAt", "pilot"];
    
    default:
      return baseFields;
  }
};

export const getAvailableActions = (userRole: UserRole, freightStatus: string): string[] => {
  const actions = ["view_details"];
  
  switch (userRole) {
    case "admin":
      if (freightStatus === "Väntar godkännande") {
        actions.push("approve", "reject");
      }
      actions.push("assign_pilot");
      break;
    
    case "pilot":
      if (freightStatus === "Tilldelad") {
        actions.push("start_transport");
      } else if (freightStatus === "Under Transport") {
        actions.push("deliver");
      }
      break;
    
    case "customer":
      if (freightStatus === "Väntar godkännande") {
        actions.push("edit", "cancel");
      }
      break;
  }
  
  return actions;
}; 