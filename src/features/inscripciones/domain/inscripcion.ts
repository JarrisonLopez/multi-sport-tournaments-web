export type Disponibilidad = "fines-de-semana" | "noches" | "mananas" | "flexible";

export type InscripcionRequest = {
  torneoId: string;
  disponibilidad: Disponibilidad;
  mensaje: string;
};
