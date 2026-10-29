import { getApiBaseUrl, isApiHostConfigured } from "@/features/common/config";

const TOKEN_KEY = "mst-token";

export class HttpError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "HttpError";
    this.status = status;
  }
}

function readToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const token = window.localStorage.getItem(TOKEN_KEY);
    return token && token.trim().length > 0 ? token : null;
  } catch {
    return null;
  }
}

function clearToken(): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.removeItem(TOKEN_KEY);
  } catch {
    return;
  }
}

function redirectToLogin(): void {
  if (typeof window === "undefined") {
    return;
  }

  if (window.location.pathname !== "/login") {
    window.location.assign("/login");
  }
}

export async function http(path: string, init?: RequestInit): Promise<unknown> {
  if (!isApiHostConfigured()) {
    throw new HttpError(
      0,
      "Falta NEXT_PUBLIC_API_HOST. Defínelo en .env.local con el host de la API local.",
    );
  }

  const headers = new Headers(init?.headers);
  headers.set("Accept", "application/json");

  const token = readToken();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  let response: Response;
  try {
    response = await fetch(`${getApiBaseUrl()}${path}`, {
      ...init,
      headers,
      cache: "no-store",
    });
  } catch {
    throw new HttpError(0, "No se pudo conectar con la API local.");
  }

  if (response.status === 401) {
    clearToken();
    redirectToLogin();
    throw new HttpError(401, "La API respondió 401.");
  }

  if (!response.ok) {
    throw new HttpError(
      response.status,
      `La API respondió ${response.status} en ${path}.`,
    );
  }

  return response.json() as Promise<unknown>;
}
