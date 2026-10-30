import { ESTADO_LABEL } from "@/features/torneos/domain/torneo-form";
import type { Torneo } from "@/features/torneos/domain/torneo";

type AdminTorneoListProps = {
  torneos: Torneo[];
  onEdit: (torneo: Torneo) => void;
  onDelete: (torneo: Torneo) => void;
};

export function AdminTorneoList({ torneos, onEdit, onDelete }: AdminTorneoListProps) {
  return (
    <>
      <ul className="grid gap-3 md:hidden">
        {torneos.map((torneo) => (
          <li key={torneo.id} className="rounded-[10px] border border-[var(--color-line)] bg-[var(--color-surface-elevated)] p-4">
            <p className="text-[0.8125rem] font-bold tracking-[0.04em] text-[var(--color-field-mid)] uppercase">{torneo.deporte}</p>
            <h3 className="mt-1 text-[1.25rem] break-words">{torneo.nombre}</h3>
            <dl className="mt-3 grid grid-cols-[6.5rem_minmax(0,1fr)] gap-y-1 text-[0.9375rem]">
              <dt className="font-bold">Estado</dt>
              <dd>{ESTADO_LABEL[torneo.estado]}</dd>
              <dt className="font-bold">Ciudad</dt>
              <dd className="break-words">{torneo.ciudad}</dd>
              <dt className="font-bold">Cierre</dt>
              <dd>{torneo.cierreInscripciones.slice(0, 10)}</dd>
              <dt className="font-bold">Cupo</dt>
              <dd>{cupoLabel(torneo)}</dd>
            </dl>
            <Actions torneo={torneo} onEdit={onEdit} onDelete={onDelete} />
          </li>
        ))}
      </ul>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[42rem] border-collapse text-left text-[0.9375rem]">
          <caption className="sr-only">Torneos del catálogo</caption>
          <thead className="border-b border-[var(--color-line)] text-[0.8125rem] tracking-[0.04em] uppercase">
            <tr>
              <th scope="col" className="px-3 py-3">Torneo</th>
              <th scope="col" className="px-3 py-3">Deporte</th>
              <th scope="col" className="px-3 py-3">Estado</th>
              <th scope="col" className="px-3 py-3">Ciudad</th>
              <th scope="col" className="px-3 py-3">Cierre</th>
              <th scope="col" className="px-3 py-3">Cupo</th>
              <th scope="col" className="px-3 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {torneos.map((torneo) => (
              <tr key={torneo.id} className="border-b border-[var(--color-line)]">
                <th scope="row" className="px-3 py-3 font-bold break-words">{torneo.nombre}</th>
                <td className="px-3 py-3">{torneo.deporte}</td>
                <td className="px-3 py-3">{ESTADO_LABEL[torneo.estado]}</td>
                <td className="px-3 py-3">{torneo.ciudad}</td>
                <td className="px-3 py-3 whitespace-nowrap">{torneo.cierreInscripciones.slice(0, 10)}</td>
                <td className="px-3 py-3 whitespace-nowrap">{cupoLabel(torneo)}</td>
                <td className="px-3 py-3">
                  <Actions torneo={torneo} onEdit={onEdit} onDelete={onDelete} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function Actions({
  torneo,
  onEdit,
  onDelete,
}: {
  torneo: Torneo;
  onEdit: (torneo: Torneo) => void;
  onDelete: (torneo: Torneo) => void;
}) {
  return (
    <div className="mt-4 flex flex-wrap gap-2 md:mt-0">
      <button
        type="button"
        className="inline-flex min-h-11 items-center justify-center rounded-[4px] border border-[var(--color-line)] px-3 text-[0.875rem] font-bold"
        onClick={() => onEdit(torneo)}
      >
        Editar
      </button>
      <button
        type="button"
        className="inline-flex min-h-11 items-center justify-center rounded-[4px] border border-[var(--color-error)] px-3 text-[0.875rem] font-bold text-[var(--color-error)]"
        onClick={() => onDelete(torneo)}
      >
        Eliminar
      </button>
    </div>
  );
}

function cupoLabel(torneo: Torneo): string {
  if (torneo.cupoEquipos !== null) {
    return `${torneo.cupoEquipos} equipos`;
  }
  if (torneo.cupoJugadores !== null) {
    return `${torneo.cupoJugadores} jugadores`;
  }
  return "Sin cupo";
}
