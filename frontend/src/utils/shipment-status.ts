import { UserRole } from '@/types/user';
import { ShipmentStatus } from '../model/types';

// Map backend numeric enum values to frontend string enum
export const mapBackendStatusToFrontend = (status: number): ShipmentStatus => {
    switch (status) {
        case 0: return ShipmentStatus.WaitingForApproval;
        case 1: return ShipmentStatus.Approved;
        case 2: return ShipmentStatus.Denied;
        case 3: return ShipmentStatus.Assigned;
        case 4: return ShipmentStatus.InTransit;
        case 5: return ShipmentStatus.Delivered;
        case 6: return ShipmentStatus.Cancelled;
        default: throw new Error(`Unknown shipment status: ${status}`);
    }
};

// Map frontend string enum to backend numeric enum
export const mapFrontendStatusToBackend = (status: ShipmentStatus): number => {
    switch (status) {
        case ShipmentStatus.WaitingForApproval: return 0;
        case ShipmentStatus.Approved: return 1;
        case ShipmentStatus.Denied: return 2;
        case ShipmentStatus.Assigned: return 3;
        case ShipmentStatus.InTransit: return 4;
        case ShipmentStatus.Delivered: return 5;
        case ShipmentStatus.Cancelled: return 6;
        default: throw new Error(`Unknown shipment status: ${status}`);
    }
};

// Get display text for a status
export const getStatusDisplayText = (status: ShipmentStatus): string => {
    switch (status) {
        case ShipmentStatus.WaitingForApproval: return 'Väntar på godkännande';
        case ShipmentStatus.Approved: return 'Godkänd';
        case ShipmentStatus.Denied: return 'Nekad';
        case ShipmentStatus.Assigned: return 'Tilldelad';
        case ShipmentStatus.InTransit: return 'Under transport';
        case ShipmentStatus.Delivered: return 'Levererad';
        case ShipmentStatus.Cancelled: return 'Avbruten';
        default: return 'Okänd status';
    }
};

// Get color class for a status
export const getStatusColorClass = (status: ShipmentStatus): string => {
    switch (status) {
        case ShipmentStatus.WaitingForApproval: return 'bg-amber-500';
        case ShipmentStatus.Approved: return 'bg-blue-500';
        case ShipmentStatus.Denied: return 'bg-red-500';
        case ShipmentStatus.Assigned: return 'bg-green-500';
        case ShipmentStatus.InTransit: return 'bg-indigo-500';
        case ShipmentStatus.Delivered: return 'bg-emerald-500';
        case ShipmentStatus.Cancelled: return 'bg-gray-500';
        default: return 'bg-gray-500';
    }
}; 

// Map backend numeric enum values to frontend string enum
export const mapBackendRoleToFrontend = (role: number): UserRole => {
    switch (role) {
        case 0: return "customer";
        case 1: return "pilot";
        case 2: return "admin";
        default: throw new Error(`Unknown user role: ${role}`);
    }
};
