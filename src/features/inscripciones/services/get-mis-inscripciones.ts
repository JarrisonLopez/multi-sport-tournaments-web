import { parseInscripcion } from "@/features/inscripciones/services/create-inscripcion";
import type { Inscripcion } from "@/features/inscripciones/domain/inscripcion";
import { HttpError, http } from "@/features/common/http";

export async function getMisInscripciones(signal?: AbortSignal): Promise<Inscripcion[]> {
  const payload = await http("/api/inscripciones/mias", { signal });

  if (!isRecord(payload) || !Array.isArray(payload.data)) {
    throw new HttpError(0, "La respuesta de GET /api/inscripciones/mias no tiene el formato { data }.");
  }

  const data: Inscripcion[] = [];
  for (const item of payload.data) {
    const inscripcion = parseInscripcion(item);
    if (!inscripcion) {
      throw new HttpError(0, "Una inscripción de GET /api/inscripciones/mias no tiene el formato esperado.");
    }
    data.push(inscripcion);
  }

  return data;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
