import { UserRole } from "@/model/types";
import { api } from "./api";
import { mapBackendRoleToFrontend } from "@/utils/role-mapper";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Backend response interface (med string role)
interface BackendUser {
  id: string;
  email: string;
  name: string;
  role: string; // String från backend ("Customer", "Pilot", "Admin")
}

interface BackendAuthResponse {
  user: BackendUser;
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

// Konvertera backend user till frontend user
const convertBackendUser = (backendUser: BackendUser): User => ({
  ...backendUser,
  role: mapBackendRoleToFrontend(backendUser.role)
});

export const loginUser = async (credentials: LoginRequest): Promise<AuthResponse> => {
  const response = await api.post<BackendAuthResponse>('/auth/login', credentials);
  
  if (!response.ok) {
    throw new Error('Inloggning misslyckades');
  }
  
  return {
    user: convertBackendUser(response.data.user),
    token: response.data.token
  };
};

export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get<BackendUser>('/users/me');
  
  if (!response.ok) {
    throw new Error('Kunde inte hämta användarinformation');
  }
  
  return convertBackendUser(response.data);
};

export const logoutUser = async (): Promise<void> => {
  // Om du har en logout endpoint
  try {
    await api.post('/auth/logout', {});
  } catch (error) {
    // Logga ut lokalt även om API-anrop misslyckas
    console.warn('Logout API call failed, logging out locally', error);
  }
}; 