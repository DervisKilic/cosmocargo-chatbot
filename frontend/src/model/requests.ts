import { ShipmentContact } from "./shipment";
import { ShipmentStatus } from "./types";

export interface CreateShipmentRequest {
  origin: ShipmentContact;
  destination: ShipmentContact;
  weight: number;
  category: string;
  priority: string;
  description?: string;
  hasInsurance: boolean;
}

export interface UpdateShipmentStatusRequest {
  status: ShipmentStatus;
}

export interface AssignPilotRequest {
  pilotId: string;
}

export interface ShipmentsFilter {
  search?: string;
  status?: ShipmentStatus;
  page?: number;
  pageSize?: number;
}