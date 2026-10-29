import { HttpError, http } from "@/features/common/http";
import type {
  EstadoTorneo,
  Pagination,
  Torneo,
  TorneosPage,
} from "@/features/torneos/domain/torneo";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isEstado(value: unknown): value is EstadoTorneo {
  return value === "abierto" || value === "en_curso" || value === "proximo";
}

function isNullableNumber(value: unknown): value is number | null {
  return value === null || (typeof value === "number" && Number.isFinite(value));
}

function readCount(value: unknown): number | null {
  if (typeof value === "number" && Number.isInteger(value) && value >= 0) {
    return value;
  }
  return null;
}

function parsePagination(value: unknown): Pagination | null {
  if (!isRecord(value)) {
    return null;
  }

  const page = readCount(value.page);
  const total = readCount(value.total);
  const totalPages = readCount(value.totalPages);
  const pageSize = readCount(value.pageSize) ?? readCount(value.limit);

  if (page === null || page < 1 || total === null || totalPages === null || pageSize === null) {
    return null;
  }

  return { page, pageSize, total, totalPages };
}

function parseTorneo(value: unknown): Torneo | null {
  if (!isRecord(value)) {
    return null;
  }

  if (
    typeof value.id !== "string" ||
    typeof value.nombre !== "string" ||
    typeof value.deporte !== "string" ||
    !isEstado(value.estado) ||
    !isNullableNumber(value.cupoEquipos) ||
    !isNullableNumber(value.cupoJugadores) ||
    typeof value.sedePrincipalId !== "string" ||
    typeof value.sedeNombre !== "string" ||
    typeof value.ciudad !== "string" ||
    typeof value.cierreInscripciones !== "string" ||
    typeof value.descripcion !== "string"
  ) {
    return null;
  }

  return {
    id: value.id,
    nombre: value.nombre,
    deporte: value.deporte,
    estado: value.estado,
    cupoEquipos: value.cupoEquipos,
    cupoJugadores: value.cupoJugadores,
    sedePrincipalId: value.sedePrincipalId,
    sedeNombre: value.sedeNombre,
    ciudad: value.ciudad,
    cierreInscripciones: value.cierreInscripciones,
    descripcion: value.descripcion,
  };
}

function parseTorneosPage(value: unknown): TorneosPage | null {
  if (!isRecord(value) || !Array.isArray(value.data)) {
    return null;
  }

  const pagination = parsePagination(value.pagination);
  if (!pagination) {
    return null;
  }

  const data: Torneo[] = [];
  for (const item of value.data) {
    const torneo = parseTorneo(item);
    if (!torneo) {
      return null;
    }
    data.push(torneo);
  }

  return { pagination, data };
}

export async function getTorneos(page: number, signal?: AbortSignal): Promise<TorneosPage> {
  const safePage = Number.isInteger(page) && page > 0 ? page : 1;
  const payload = await http(`/api/torneos?page=${safePage}`, { signal });
  const parsed = parseTorneosPage(payload);

  if (!parsed) {
    throw new HttpError(
      0,
      "La respuesta de GET /api/torneos no tiene el formato { pagination, data }.",
    );
  }

  return parsed;
}
