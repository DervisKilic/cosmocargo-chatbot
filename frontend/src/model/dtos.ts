import { ShipmentStatus } from './types';
import { ShipmentContact } from './shipment';
import { BaseEntity, UpdateEntity } from './common';

// Shipment DTOs
export interface CreateShipmentDto {
    origin: ShipmentContact;
    destination: ShipmentContact;
    weight: number;
    category: string;
    priority: string;
    description?: string | null;
    hasInsurance: boolean;
}

export interface UpdateShipmentStatusDto {
    status: ShipmentStatus;
}

export interface AssignPilotDto {
    pilotId: string;
}

export interface ShipmentsFilterDto {
    search?: string;
    status?: ShipmentStatus;
    page?: number;
    pageSize?: number;
}

// Pilot DTOs
export interface CreatePilotDto {
    name: string;
    email: string;
    experience: string;
}

export interface UpdatePilotDto {
    name: string;
    email: string;
    experience: string;
}

export interface PilotsFilterDto {
    page?: number;
    pageSize?: number;
    search?: string;
    isActive?: boolean;
}

export interface PilotAvailabilityDto {
    isAvailable: boolean;
    activeShipments: number;
    maxShipments: number;
}

// User DTOs
export interface UserSettingsDto extends BaseEntity {
    userId: string;
    theme: "light" | "dark" | "system";
    notifications: boolean;
    language: string;
}

export interface UpdateUserSettingsDto extends UpdateEntity<UserSettingsDto> {
    theme?: "light" | "dark" | "system";
    notifications?: boolean;
    language?: string;
} 