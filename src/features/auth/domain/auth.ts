export type Role = "admin" | "user";

export type User = {
  id: string;
  nombre: string;
  email: string;
  role: Role;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  nombre: string;
  email: string;
  password: string;
};

export type AuthResponse = {
  token: string;
  user: User;
};
