export type UserRole = "customer" | "pilot" | "admin";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface UserSettings {
  id: string;
  userId: string;
  theme: "light" | "dark" | "system";
  notifications: boolean;
  language: string;
  createdAt: string;
  updatedAt: string;
} 