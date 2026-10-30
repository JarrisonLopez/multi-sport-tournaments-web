import { HttpError, http } from "@/features/common/http";
import type { Torneo } from "@/features/torneos/domain/torneo";
import type { TorneoWrite } from "@/features/torneos/domain/torneo-form";
import { parseTorneo } from "@/features/torneos/services/get-torneos";

export async function updateTorneo(input: TorneoWrite): Promise<Torneo> {
  const payload = await http(`/api/torneos/${encodeURIComponent(input.id)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
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
    throw new HttpError(0, "La respuesta de PUT /api/torneos no tiene el formato de un torneo.");
  }

  return torneo;
}
