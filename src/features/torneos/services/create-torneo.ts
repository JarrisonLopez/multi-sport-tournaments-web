import { HttpError, http } from "@/features/common/http";
import type { Torneo } from "@/features/torneos/domain/torneo";
import type { TorneoWrite } from "@/features/torneos/domain/torneo-form";
import { parseTorneo } from "@/features/torneos/services/get-torneos";

export async function createTorneo(input: TorneoWrite): Promise<Torneo> {
  const payload = await http("/api/torneos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: input.id,
      nombre: input.nombre,
      deporte: input.deporte,
      estado: input.estado,
      cupoEquipos: input.cupoEquipos,
      cupoJugadores: input.cupoJugadores,
      sedePrincipalId: input.sedePrincipalId,
      sedeNombre: input.sedeNombre,
      ciudad: input.ciudad,
      cierreInscripciones: input.cierreInscripciones,
      descripcion: input.descripcion,
    }),
  });

  const torneo = parseTorneo(payload);
  if (!torneo) {
    throw new HttpError(0, "La respuesta de POST /api/torneos no tiene el formato de un torneo.");
  }

  return torneo;
}
