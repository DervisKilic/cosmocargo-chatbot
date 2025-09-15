import { UserRole } from './types';
import { BaseEntity } from './common';

export default interface User extends BaseEntity {
    name: string;
    email: string;
    role: UserRole;
    experience?: string;
    isActive?: boolean;
    rating?: number;
    assignedShipments?: number;
} 