import type { EstadoTorneo, Torneo } from "@/features/torneos/domain/torneo";

const estadoLabel: Record<EstadoTorneo, string> = {
  abierto: "Abierto",
  en_curso: "En curso",
  proximo: "Próximo",
};

function cupoLabel(torneo: Torneo): string {
  if (typeof torneo.cupoEquipos === "number") {
    return `${torneo.cupoEquipos} equipos`;
  }
  if (typeof torneo.cupoJugadores === "number") {
    return `${torneo.cupoJugadores} jugadores`;
  }
  return "Sin cupo publicado";
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
  const sede = torneo.sedeNombre.trim().length > 0 ? torneo.sedeNombre : "Sede por confirmar";

  return (
    <article className="flex h-full min-w-0 flex-col rounded-[10px] border border-[var(--color-line)] border-t-[3px] border-t-[var(--color-accent)] bg-[var(--color-surface-elevated)] p-5 sm:p-6">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="rounded-[4px] bg-[var(--color-accent)] px-2 py-1 text-[0.8125rem] font-bold text-[var(--color-on-accent)]">
          {torneo.deporte}
        </span>
        <span className="rounded-[4px] border border-[var(--color-line)] px-2 py-1 text-[0.8125rem] font-bold tracking-[0.04em] text-[var(--color-field-mid)] uppercase">
          {estadoLabel[torneo.estado]}
        </span>
      </div>
      <h3 className="mb-3 text-[1.35rem] break-words sm:text-[1.45rem]">{torneo.nombre}</h3>
      <p className="line-clamp-3 text-[var(--color-muted)]">{torneo.descripcion}</p>
      <dl className="mt-4 grid gap-2 border-t border-[var(--color-line)] pt-4 text-[0.9375rem]">
        <Fact term="Sede" value={sede} />
        <Fact term="Ciudad" value={torneo.ciudad} />
        <Fact term="Cierre" value={formatDate(torneo.cierreInscripciones)} />
        <Fact term="Cupo" value={cupoLabel(torneo)} />
      </dl>
    </article>
  );
}

function Fact({ term, value }: { term: string; value: string }) {
  return (
    <div className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-2">
      <dt className="font-bold text-[var(--color-ink)]">{term}</dt>
      <dd className="min-w-0 break-words text-[var(--color-muted)]">{value}</dd>
    </div>
  );
}
