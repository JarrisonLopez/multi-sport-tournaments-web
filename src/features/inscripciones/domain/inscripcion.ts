import type { Torneo } from "@/features/torneos/domain/torneo";

export type Disponibilidad = "fines-de-semana" | "noches" | "mananas" | "flexible";

export const DISPONIBILIDADES: { value: Disponibilidad; label: string }[] = [
  { value: "fines-de-semana", label: "Fines de semana" },
  { value: "noches", label: "Noches entre semana" },
  { value: "mananas", label: "Mañanas" },
  { value: "flexible", label: "Flexible" },
];

export type InscripcionRequest = {
  torneoId: string;
  disponibilidad: Disponibilidad;
  mensaje: string;
};

export type Inscripcion = {
  id: string;
  userId: string;
  torneoId: string;
  disponibilidad: Disponibilidad;
  mensaje: string;
  createdAt: string;
};

export type InscripcionFieldErrors = {
  torneoId?: string;
  disponibilidad?: string;
  mensaje?: string;
  form?: string;
};

export function fechaUtcHoy(now: Date = new Date()): string {
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  const day = String(now.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function motivoNoInscripcion(torneo: Pick<Torneo, "estado" | "cierreInscripciones">, hoy: string): string | null {
  if (torneo.estado === "en_curso") {
    return "El torneo está en curso y no admite solicitudes.";
  }

  if (torneo.estado === "proximo") {
    return "El torneo todavía no está abierto a inscripciones.";
  }

  if (torneo.estado !== "abierto") {
    return "El torneo no admite inscripciones.";
  }

  if (torneo.cierreInscripciones.slice(0, 10) < hoy) {
    return `Las inscripciones cerraron el ${formatDate(torneo.cierreInscripciones)}.`;
  }

  return null;
}

export function validateInscripcion(
  input: { torneoId: string; disponibilidad: string; mensaje: string },
  abiertos: Torneo[],
): InscripcionFieldErrors {
  const errors: InscripcionFieldErrors = {};

  if (!abiertos.some((torneo) => torneo.id === input.torneoId)) {
    errors.torneoId = abiertos.length === 0
      ? "No hay torneos disponibles para inscripción."
      : "Selecciona un torneo que admita solicitudes.";
  }

  if (!isDisponibilidad(input.disponibilidad)) {
    errors.disponibilidad = "La disponibilidad no es válida.";
  }

  const mensaje = input.mensaje.trim();
  if (mensaje.length < 10) {
    errors.mensaje = "El mensaje debe tener al menos 10 caracteres.";
  } else if (mensaje.length > 1000) {
    errors.mensaje = "El mensaje no puede superar 1000 caracteres.";
  } else if (/[\u0000-\u001F\u007F]/.test(mensaje)) {
    errors.mensaje = "El mensaje contiene caracteres no válidos.";
  }

  return errors;
}

export function inscripcionErrorsFromMessage(message: string): InscripcionFieldErrors {
  if (message.startsWith("La disponibilidad")) {
    return { disponibilidad: message };
  }

  if (message.startsWith("El mensaje")) {
    return { mensaje: message };
  }

  if (message.startsWith("El torneo") || message.includes("identificador")) {
    return { torneoId: message };
  }

  return { form: message };
}

export function hasInscripcionErrors(errors: InscripcionFieldErrors): boolean {
  return Object.values(errors).some((value) => value !== undefined);
}

export function isDisponibilidad(value: string): value is Disponibilidad {
  return DISPONIBILIDADES.some((item) => item.value === value);
}

export function disponibilidadLabel(value: Disponibilidad): string {
  return DISPONIBILIDADES.find((item) => item.value === value)?.label ?? value;
}

function formatDate(value: string): string {
  const iso = value.slice(0, 10);
  const parts = iso.split("-");
  if (parts.length !== 3) {
    return value;
  }

  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}
