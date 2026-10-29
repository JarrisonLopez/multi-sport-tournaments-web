import type { EstadoTorneo, Torneo } from "@/features/torneos/domain/torneo";

const estadoLabel: Record<EstadoTorneo, string> = {
  abierto: "Abierto",
  en_curso: "En curso",
  proximo: "Próximo",
};

function cupoLabel(torneo: Torneo): string | null {
  if (typeof torneo.cupoEquipos === "number") {
    return `${torneo.cupoEquipos} equipos`;
  }
  if (typeof torneo.cupoJugadores === "number") {
    return `${torneo.cupoJugadores} jugadores`;
  }
  return null;
}

function formatDate(value: string): string {
  const iso = value.slice(0, 10);
  const parts = iso.split("-");
  if (parts.length !== 3) {
    return value;
  }
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

export function TorneoCard({ torneo }: { torneo: Torneo }) {
  const cupo = cupoLabel(torneo);
  const sede = torneo.sedeNombre.trim().length > 0 ? torneo.sedeNombre : "Sede por confirmar";

  return (
    <article className="min-w-0 rounded-[10px] border border-[var(--color-line)] border-t-[3px] border-t-[var(--color-accent)] bg-[var(--color-surface-elevated)] p-6">
      <p className="mb-3 text-[0.8125rem] font-bold tracking-[0.06em] text-[var(--color-field-mid)] uppercase">
        <span className="mr-1 rounded-[4px] bg-[var(--color-accent)] px-[0.45rem] py-[0.15rem] text-[var(--color-ink)] normal-case">
          {torneo.deporte}
        </span>
        · {estadoLabel[torneo.estado]}
        {cupo ? ` · ${cupo}` : null}
      </p>
      <h3 className="mb-3 text-[1.45rem]">{torneo.nombre}</h3>
      <p className="text-[var(--color-muted)]">{torneo.descripcion}</p>
      <p className="mt-4 text-[0.9375rem] font-semibold">
        Sede: {sede} · {torneo.ciudad} · Inscripciones hasta {formatDate(torneo.cierreInscripciones)}
      </p>
    </article>
  );
}
