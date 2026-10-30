import type { EstadoTorneo, Torneo } from "@/features/torneos/domain/torneo";

export const ESTADOS_TORNEO: readonly EstadoTorneo[] = ["abierto", "en_curso", "proximo"];

export const ESTADO_LABEL: Record<EstadoTorneo, string> = {
  abierto: "Abierto",
  en_curso: "En curso",
  proximo: "Próximo",
};

const ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const NAME_PATTERN = /^[\p{L}\p{N}][\p{L}\p{N}\s'.-]*$/u;
const PLACE_PATTERN = /^[\p{L}][\p{L}\s'.-]*$/u;

export type CupoModo = "equipos" | "jugadores";

export type TorneoFormValues = {
  id: string;
  nombre: string;
  deporte: string;
  estado: string;
  cupoModo: CupoModo;
  cupo: string;
  sedePrincipalId: string;
  sedeNombre: string;
  ciudad: string;
  cierreInscripciones: string;
  descripcion: string;
};

export type TorneoFieldErrors = {
  id?: string;
  nombre?: string;
  deporte?: string;
  estado?: string;
  cupo?: string;
  sedePrincipalId?: string;
  sedeNombre?: string;
  ciudad?: string;
  cierreInscripciones?: string;
  descripcion?: string;
  form?: string;
};

export type TorneoWrite = {
  id: string;
  nombre: string;
  deporte: string;
  estado: EstadoTorneo;
  cupoEquipos: number | null;
  cupoJugadores: number | null;
  sedePrincipalId: string;
  sedeNombre: string;
  ciudad: string;
  cierreInscripciones: string;
  descripcion: string;
};

export function emptyTorneoForm(): TorneoFormValues {
  return {
    id: "",
    nombre: "",
    deporte: "",
    estado: "abierto",
    cupoModo: "equipos",
    cupo: "",
    sedePrincipalId: "",
    sedeNombre: "",
    ciudad: "",
    cierreInscripciones: "",
    descripcion: "",
  };
}

export function torneoToForm(torneo: Torneo): TorneoFormValues {
  const equipos = torneo.cupoEquipos !== null;
  return {
    id: torneo.id,
    nombre: torneo.nombre,
    deporte: torneo.deporte,
    estado: torneo.estado,
    cupoModo: equipos ? "equipos" : "jugadores",
    cupo: String(equipos ? torneo.cupoEquipos : torneo.cupoJugadores),
    sedePrincipalId: torneo.sedePrincipalId,
    sedeNombre: torneo.sedeNombre,
    ciudad: torneo.ciudad,
    cierreInscripciones: torneo.cierreInscripciones.slice(0, 10),
    descripcion: torneo.descripcion,
  };
}

export function hasTorneoErrors(errors: TorneoFieldErrors): boolean {
  return Object.values(errors).some((value) => value !== undefined);
}

export function validateTorneoForm(
  values: TorneoFormValues,
  mode: "create" | "edit",
): { errors: TorneoFieldErrors; value: TorneoWrite | null } {
  const errors: TorneoFieldErrors = {};
  const id = mode === "create" ? readId(values.id) : checked(values.id.trim());
  const nombre = readText(values.nombre, "El nombre", 2, 80, NAME_PATTERN);
  const deporte = readText(values.deporte, "El deporte", 2, 40, NAME_PATTERN);
  const estado = readEstado(values.estado);
  const cupo = readCupo(values.cupo, values.cupoModo);
  const sedePrincipalId = readId(values.sedePrincipalId);
  const sedeNombre = readText(values.sedeNombre, "El nombre de la sede", 2, 80, NAME_PATTERN);
  const ciudad = readText(values.ciudad, "La ciudad", 2, 60, PLACE_PATTERN);
  const cierre = readDate(values.cierreInscripciones);
  const descripcion = readDescription(values.descripcion);

  if (!id.ok && mode === "create") {
    errors.id = id.message;
  }
  if (!nombre.ok) {
    errors.nombre = nombre.message;
  }
  if (!deporte.ok) {
    errors.deporte = deporte.message;
  }
  if (!estado.ok) {
    errors.estado = estado.message;
  }
  if (!cupo.ok) {
    errors.cupo = cupo.message;
  }
  if (!sedePrincipalId.ok) {
    errors.sedePrincipalId = "El identificador de la sede no es válido.";
  }
  if (!sedeNombre.ok) {
    errors.sedeNombre = sedeNombre.message;
  }
  if (!ciudad.ok) {
    errors.ciudad = ciudad.message;
  }
  if (!cierre.ok) {
    errors.cierreInscripciones = cierre.message;
  }
  if (!descripcion.ok) {
    errors.descripcion = descripcion.message;
  }

  if (
    !id.ok ||
    !nombre.ok ||
    !deporte.ok ||
    !estado.ok ||
    !cupo.ok ||
    !sedePrincipalId.ok ||
    !sedeNombre.ok ||
    !ciudad.ok ||
    !cierre.ok ||
    !descripcion.ok
  ) {
    return { errors, value: null };
  }

  return {
    errors,
    value: {
      id: id.value,
      nombre: nombre.value,
      deporte: deporte.value,
      estado: estado.value,
      cupoEquipos: values.cupoModo === "equipos" ? cupo.value : null,
      cupoJugadores: values.cupoModo === "jugadores" ? cupo.value : null,
      sedePrincipalId: sedePrincipalId.value,
      sedeNombre: sedeNombre.value,
      ciudad: ciudad.value,
      cierreInscripciones: cierre.value,
      descripcion: descripcion.value,
    },
  };
}

export function torneoErrorsFromMessage(message: string): TorneoFieldErrors {
  if (message.startsWith("El identificador del torneo") || message.startsWith("Ya existe un torneo")) {
    return { id: message };
  }
  if (message.startsWith("El nombre de la sede")) {
    return { sedeNombre: message };
  }
  if (message.startsWith("El nombre")) {
    return { nombre: message };
  }
  if (message.startsWith("El deporte")) {
    return { deporte: message };
  }
  if (message.startsWith("El estado")) {
    return { estado: message };
  }
  if (message.startsWith("El cupo") || message.startsWith("Debe indicarse exactamente un cupo")) {
    return { cupo: message };
  }
  if (message.startsWith("El identificador de la sede")) {
    return { sedePrincipalId: message };
  }
  if (message.startsWith("La ciudad")) {
    return { ciudad: message };
  }
  if (message.startsWith("La fecha de cierre")) {
    return { cierreInscripciones: message };
  }
  if (message.startsWith("La descripción")) {
    return { descripcion: message };
  }

  return { form: message };
}

type Checked<T> = { ok: true; value: T } | { ok: false; message: string };

function checked<T>(value: T): Checked<T> {
  return { ok: true, value };
}

function invalid(message: string): Checked<never> {
  return { ok: false, message };
}

function readId(value: string): Checked<string> {
  const id = value.trim();
  if (id.length < 2 || id.length > 40 || !ID_PATTERN.test(id)) {
    return invalid("El identificador del torneo no es válido.");
  }
  return checked(id);
}

function readText(
  value: string,
  label: string,
  min: number,
  max: number,
  pattern: RegExp,
): Checked<string> {
  const text = value.trim();
  if (text.length < min || text.length > max || !pattern.test(text)) {
    return invalid(`${label} no es válido.`);
  }
  return checked(text);
}

function readEstado(value: string): Checked<EstadoTorneo> {
  const estado = ESTADOS_TORNEO.find((item) => item === value);
  if (!estado) {
    return invalid("El estado del torneo no es válido.");
  }
  return checked(estado);
}

function readCupo(value: string, modo: CupoModo): Checked<number> {
  const label = modo === "equipos" ? "El cupo de equipos" : "El cupo de jugadores";
  const text = value.trim();
  if (!/^[1-9]\d*$/.test(text)) {
    return invalid(
      text.length === 0
        ? "Debe indicarse exactamente un cupo positivo y el otro debe ser nulo."
        : `${label} debe ser un entero positivo o nulo.`,
    );
  }

  const cupo = Number(text);
  if (cupo < 1 || cupo > 500) {
    return invalid(`${label} debe estar entre 1 y 500.`);
  }

  return checked(cupo);
}

function readDate(value: string): Checked<string> {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return invalid("La fecha de cierre debe tener el formato AAAA-MM-DD.");
  }

  const year = Number(value.slice(0, 4));
  const month = Number(value.slice(5, 7));
  const day = Number(value.slice(8, 10));
  if (year < 2000 || year > 2100) {
    return invalid("La fecha de cierre está fuera del rango permitido.");
  }

  const date = new Date(Date.UTC(year, month - 1, day));
  const valid =
    date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
  if (!valid) {
    return invalid("La fecha de cierre no existe en el calendario.");
  }

  return checked(value);
}

function readDescription(value: string): Checked<string> {
  const descripcion = value.trim();
  if (descripcion.length < 10 || descripcion.length > 800) {
    return invalid("La descripción debe tener entre 10 y 800 caracteres.");
  }
  if (/[\u0000-\u001F\u007F]/.test(descripcion)) {
    return invalid("La descripción contiene caracteres no válidos.");
  }
  return checked(descripcion);
}
