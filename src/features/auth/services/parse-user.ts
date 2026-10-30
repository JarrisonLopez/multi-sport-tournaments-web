import type { AuthResponse, User } from "@/features/auth/domain/auth";

export function parseUser(value: unknown): User | null {
  if (!isRecord(value)) {
    return null;
  }

  if (
    typeof value.id !== "string" ||
    value.id.trim().length === 0 ||
    typeof value.nombre !== "string" ||
    value.nombre.trim().length === 0 ||
    typeof value.email !== "string" ||
    value.email.trim().length === 0 ||
    (value.role !== "ADMIN" && value.role !== "USER")
  ) {
    return null;
  }

  return {
    id: value.id,
    nombre: value.nombre,
    email: value.email,
    role: value.role,
  };
}

export function parseLoginPayload(value: unknown): AuthResponse | null {
  if (!isRecord(value) || typeof value.token !== "string" || value.token.trim().length === 0) {
    return null;
  }

  const user = parseUser(value.user);
  if (!user) {
    return null;
  }

  return { token: value.token, user };
}

export function parseRegisterPayload(value: unknown): User | null {
  if (!isRecord(value)) {
    return null;
  }

  return parseUser(value.user);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
