export type EstadoTorneo = "abierto" | "en_curso" | "proximo";

export type Torneo = {
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

export type Pagination = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export type TorneosPage = {
  pagination: Pagination;
  data: Torneo[];
};
