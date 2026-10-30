import type { LoginRequest } from "@/features/auth/domain/auth";
import { normalizeEmail } from "@/features/auth/domain/rules";
import { HttpError, http } from "@/features/common/http";
import { parseLoginPayload } from "@/features/auth/services/parse-user";
import { saveSession } from "@/features/auth/services/session";
import type { User } from "@/features/auth/domain/auth";

export async function login(input: LoginRequest): Promise<User> {
  const payload = await http("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: normalizeEmail(input.email),
      password: input.password,
    }),
  });

  const parsed = parseLoginPayload(payload);
  if (!parsed) {
    throw new HttpError(0, "La respuesta de POST /api/auth/login no incluye token y usuario.");
  }

  saveSession(parsed);
  return parsed.user;
}
