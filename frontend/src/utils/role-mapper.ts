import { UserRole } from "@/model/types";

export enum BackendUserRole {
  Customer = 0,
  Pilot = 1,
  Admin = 2
}

export const mapBackendRoleToFrontend = (backendRole: string | number): UserRole => {
  const roleString = typeof backendRole === 'number' ? 
    ['Customer', 'Pilot', 'Admin'][backendRole] : backendRole;

  switch (roleString) {
    case 'Customer':
      return UserRole.Customer;
    case 'Pilot':
      return UserRole.Pilot;
    case 'Admin':
      return UserRole.Admin;
    default:
      throw new Error(`Okänd användarroll: ${backendRole}`);
  }
};

export const mapFrontendRoleToBackend = (frontendRole: UserRole): string => {
  switch (frontendRole) {
    case UserRole.Customer:
      return 'Customer';
    case UserRole.Pilot:
      return 'Pilot';
    case UserRole.Admin:
      return 'Admin';
    default:
      throw new Error(`Okänd användarroll: ${frontendRole}`);
  }
}; 