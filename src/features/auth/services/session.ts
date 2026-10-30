import type { User } from "@/features/auth/domain/auth";

const TOKEN_KEY = "mst-token";
const USER_KEY = "mst-user";

export const AUTH_EVENT = "mst-auth-change";

export type Session = {
  token: string;
  user: User;
};

export function readSession(): Session | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const token = window.localStorage.getItem(TOKEN_KEY);
    const rawUser = window.localStorage.getItem(USER_KEY);
    if (!token || token.trim().length === 0 || !rawUser) {
      return null;
    }

    const user = parseStoredUser(JSON.parse(rawUser) as unknown);
    if (!user) {
      return null;
    }

    return { token, user };
  } catch {
    return null;
  }
}

export function saveSession(session: Session): void {
  window.localStorage.setItem(TOKEN_KEY, session.token);
  window.localStorage.setItem(USER_KEY, JSON.stringify(session.user));
  window.dispatchEvent(new Event(AUTH_EVENT));
}

export function clearSession(): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.removeItem(USER_KEY);
    window.dispatchEvent(new Event(AUTH_EVENT));
  } catch {
    return;
  }
}

export function subscribeSession(onChange: () => void): () => void {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  window.addEventListener("storage", onChange);
  window.addEventListener(AUTH_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(AUTH_EVENT, onChange);
  };
}

let snapshotKey = "";
let snapshotUser: User | null = null;

export function readUserSnapshot(): User | null {
  const session = readSession();
  const key = session
    ? `${session.token}\n${session.user.id}\n${session.user.nombre}\n${session.user.email}\n${session.user.role}`
    : "";

  if (key === snapshotKey) {
    return snapshotUser;
  }

  snapshotKey = key;
  snapshotUser = session?.user ?? null;
  return snapshotUser;
}

export function readToken(): string | null {
  return readSession()?.token ?? null;
}

export function safeNextPath(value: string | null): string {
  if (value === null || !value.startsWith("/") || value.startsWith("//") || value.includes("\\")) {
    return "/";
  }

  try {
    const url = new URL(value, "http://mst.local");
    if (url.origin !== "http://mst.local") {
      return "/";
    }

    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return "/";
  }
}

function parseStoredUser(value: unknown): User | null {
  if (typeof value !== "object" || value === null) {
    return null;
  }

  if (
    !("id" in value) ||
    !("nombre" in value) ||
    !("email" in value) ||
    !("role" in value) ||
    typeof value.id !== "string" ||
    typeof value.nombre !== "string" ||
    typeof value.email !== "string" ||
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
