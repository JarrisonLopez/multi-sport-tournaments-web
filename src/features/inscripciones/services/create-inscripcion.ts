import type { Disponibilidad, Inscripcion, InscripcionRequest } from "@/features/inscripciones/domain/inscripcion";
import { isDisponibilidad } from "@/features/inscripciones/domain/inscripcion";
import { HttpError, http } from "@/features/common/http";

export async function createInscripcion(input: InscripcionRequest): Promise<Inscripcion> {
  const payload = await http("/api/inscripciones", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      torneoId: input.torneoId,
      disponibilidad: input.disponibilidad,
      mensaje: input.mensaje.trim(),
    }),
  });

  const parsed = parseInscripcion(payload);
  if (!parsed) {
    throw new HttpError(0, "La respuesta de POST /api/inscripciones no tiene el formato esperado.");
  }

  return parsed;
}

export function parseInscripcion(value: unknown): Inscripcion | null {
  if (!isRecord(value)) {
    return null;
  }

  if (
    typeof value.id !== "string" ||
    typeof value.userId !== "string" ||
    typeof value.torneoId !== "string" ||
    typeof value.disponibilidad !== "string" ||
    !isDisponibilidad(value.disponibilidad) ||
    typeof value.mensaje !== "string" ||
    typeof value.createdAt !== "string"
  ) {
    return null;
  }

  return {
    id: value.id,
    userId: value.userId,
    torneoId: value.torneoId,
    disponibilidad: value.disponibilidad as Disponibilidad,
    mensaje: value.mensaje,
    createdAt: value.createdAt,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
