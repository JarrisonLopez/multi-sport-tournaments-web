import type { RegisterRequest, User } from "@/features/auth/domain/auth";
import { normalizeEmail } from "@/features/auth/domain/rules";
import { HttpError, http } from "@/features/common/http";
import { login } from "@/features/auth/services/login";
import { parseRegisterPayload } from "@/features/auth/services/parse-user";

export async function register(input: RegisterRequest): Promise<User> {
  const nombre = input.nombre.trim();
  const email = normalizeEmail(input.email);
  const payload = await http("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      nombre,
      email,
      password: input.password,
    }),
  });

  if (!parseRegisterPayload(payload)) {
    throw new HttpError(0, "La respuesta de POST /api/auth/register no incluye el usuario.");
  }

  return login({ email, password: input.password });
}
