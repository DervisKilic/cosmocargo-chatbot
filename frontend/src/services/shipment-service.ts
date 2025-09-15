import { api } from "./api";
import Shipment from "../model/shipment";
import { mapBackendStatusToFrontend, mapFrontendStatusToBackend } from "../utils/shipment-status";
import { PaginatedResult } from "@/model/paginated-result";
import { 
    CreateShipmentDto, 
    UpdateShipmentStatusDto, 
    AssignPilotDto, 
    ShipmentsFilterDto 
} from "@/model/dtos";

export const getShipments = async (filter?: ShipmentsFilterDto): Promise<PaginatedResult<Shipment>> => {
    const queryParams = new URLSearchParams();
    if (filter?.search) queryParams.append('search', filter.search);
    if (filter?.status) queryParams.append('status', mapFrontendStatusToBackend(filter.status).toString());
    queryParams.append('page', (filter?.page || 1).toString());
    queryParams.append('pageSize', (filter?.pageSize || 10).toString());
    
    const response = await api.get<PaginatedResult<Shipment>>(`/shipments?${queryParams.toString()}`);
    
    const convertedItems = response.data.items.map(shipment => ({
        ...shipment,
        status: mapBackendStatusToFrontend(shipment.status as unknown as number)
    }));

    return {
        ...response.data,
        items: convertedItems
    };
};

export const getShipmentById = async (id: string): Promise<Shipment> => {
    const response = await api.get<Shipment>(`/shipments/${id}`);
    
    return {
        ...response.data,
        status: mapBackendStatusToFrontend(response.data.status as unknown as number)
    };
};

export const createShipment = async (request: CreateShipmentDto): Promise<Shipment> => {
    const response = await api.post<Shipment>('/shipments', request);
    
    return {
        ...response.data,
        status: mapBackendStatusToFrontend(response.data.status as unknown as number)
    };
};

export const updateShipmentStatus = async (id: string, request: UpdateShipmentStatusDto): Promise<Shipment> => {
    const backendStatus = mapFrontendStatusToBackend(request.status);
    const response = await api.put<Shipment>(`/shipments/${id}/status`, { status: backendStatus });
    
    return {
        ...response.data,
        status: mapBackendStatusToFrontend(response.data.status as unknown as number)
    };
};

export const assignPilot = async (id: string, request: AssignPilotDto): Promise<Shipment> => {
    const response = await api.put<Shipment>(`/shipments/${id}/assign-pilot`, request);
    
    return {
        ...response.data,
        status: mapBackendStatusToFrontend(response.data.status as unknown as number)
    };
};

