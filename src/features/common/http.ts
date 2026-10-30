import { getApiBaseUrl, isApiHostConfigured } from "@/features/common/config";
import { clearSession, readToken, safeNextPath } from "@/features/auth/services/session";

export class HttpError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "HttpError";
    this.status = status;
  }
}

function redirectToLogin(): void {
  if (typeof window === "undefined" || window.location.pathname === "/login") {
    return;
  }

  const next = safeNextPath(`${window.location.pathname}${window.location.search}${window.location.hash}`);
  const params = new URLSearchParams();
  if (next !== "/") {
    params.set("next", next);
  }

  const query = params.toString();
  window.location.assign(query.length > 0 ? `/login?${query}` : "/login");
}

function isAuthAttempt(path: string): boolean {
  return path === "/api/auth/login" || path === "/api/auth/register";
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
    throw new HttpError(0, "No se pudo conectar con la API.");
  }

  const payload = await readPayload(response);

  if (response.status === 401) {
    clearSession();
    if (!isAuthAttempt(path)) {
      redirectToLogin();
    }
    throw new HttpError(401, readMessage(payload, "Token inválido o expirado."));
  }

  if (!response.ok) {
    throw new HttpError(response.status, readMessage(payload, `La API respondió ${response.status}.`));
  }

  return payload;
}

async function readPayload(response: Response): Promise<unknown> {
  const text = await response.text();
  if (text.trim().length === 0) {
    return null;
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
}

function readMessage(payload: unknown, fallback: string): string {
  if (typeof payload !== "object" || payload === null || !("message" in payload)) {
    return fallback;
  }

  const message = payload.message;
  if (typeof message !== "string" || message.trim().length === 0) {
    return fallback;
  }

  return message;
}
