"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { Pagination } from "@/features/common/components/Pagination";
import { useTorneos, type TorneosState } from "@/features/torneos/hooks/use-torneos";
import { TorneoCard } from "@/features/torneos/components/TorneoCard";

const MAX_PAGE_LIMIT = 50;

type CatalogoValue = {
  state: TorneosState;
  limit: number | null;
};

const CatalogoContext = createContext<CatalogoValue | null>(null);

function readPage(value: string | null): number {
  return value && /^[1-9]\d*$/.test(value) ? Number(value) : 1;
}

function readLimit(value: string | null): number | null {
  if (!value || !/^[1-9]\d*$/.test(value)) {
    return null;
  }

  const limit = Number(value);
  return limit <= MAX_PAGE_LIMIT ? limit : null;
}

export function CatalogoProvider({ children }: { children: ReactNode }) {
  const params = useSearchParams();
  const page = readPage(params.get("page"));
  const limit = readLimit(params.get("limit"));
  const state = useTorneos(page, limit);

  return <CatalogoContext.Provider value={{ state, limit }}>{children}</CatalogoContext.Provider>;
}

function useCatalogoValue(): CatalogoValue {
  const value = useContext(CatalogoContext);
  if (!value) {
    throw new Error("useCatalogo debe usarse dentro de CatalogoProvider.");
  }
  return value;
}

export function useCatalogo(): TorneosState {
  return useCatalogoValue().state;
}

export function TorneosSection() {
  const { state, limit } = useCatalogoValue();
  const [deporte, setDeporte] = useState("todos");
  const torneos = state.status === "ready" ? state.data : [];
  const deportes = torneos.filter(
    (torneo, index, list) => list.findIndex((item) => item.deporte === torneo.deporte) === index,
  );
  const visibles =
    deporte === "todos" ? torneos : torneos.filter((torneo) => torneo.deporte === deporte);

  return (
    <section id="torneos" className="py-[4.5rem] max-[641px]:py-12" aria-labelledby="torneos-title">
      <div className="mx-auto w-[min(100%-2rem,70rem)]">
        <div className="mb-8 max-w-[46rem]">
          <h2 id="torneos-title" className="mb-4 text-[clamp(1.75rem,2.4vw,2.35rem)]">
            Torneos activos
          </h2>
          <p className="text-[var(--color-muted)]">
            Competencias abiertas en fútbol 7, baloncesto, voleibol y tenis. Filtra por deporte para encontrar el torneo que te interesa.
          </p>
        </div>

        {state.status === "loading" ? (
          <p className="font-semibold" aria-live="polite">
            Cargando torneos…
          </p>
        ) : null}

        {state.status === "error" ? (
          <p className="rounded-[10px] border border-dashed border-[var(--color-line)] p-6 font-semibold text-[var(--color-error)]" role="alert">
            {state.message}
          </p>
        ) : null}

        {state.status === "empty" ? (
          <p className="rounded-[10px] border border-dashed border-[var(--color-line)] p-6 font-semibold text-[var(--color-muted)]">
            No hay torneos publicados.
          </p>
        ) : null}

        {state.status === "ready" ? (
          <>
            <div className="mb-8 flex flex-wrap gap-3" role="group" aria-label="Filtrar torneos por deporte">
              <FilterButton active={deporte === "todos"} label="Todos" onSelect={() => setDeporte("todos")} />
              {deportes.map((torneo) => (
                <FilterButton
                  key={torneo.deporte}
                  active={deporte === torneo.deporte}
                  label={torneo.deporte}
                  onSelect={() => setDeporte(torneo.deporte)}
                />
              ))}
            </div>
            {visibles.length === 0 ? (
              <p className="rounded-[10px] border border-dashed border-[var(--color-line)] p-6 font-semibold text-[var(--color-muted)]">
                No hay torneos para el deporte seleccionado.
              </p>
            ) : (
              <div className="grid grid-cols-3 gap-6 max-[901px]:grid-cols-2 max-[641px]:grid-cols-1">
                {visibles.map((torneo) => (
                  <TorneoCard key={torneo.id} torneo={torneo} />
                ))}
              </div>
            )}
          </>
        ) : null}

        {state.status === "ready" || state.status === "empty" ? (
          <Pagination pagination={state.pagination} limit={limit} />
        ) : null}
      </div>
    </section>
  );
}

function FilterButton({
  active,
  label,
  onSelect,
}: {
  active: boolean;
  label: string;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onSelect}
      className={`min-h-[2.4rem] rounded-[4px] border px-4 text-[0.9375rem] font-bold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)] ${
        active
          ? "border-[var(--color-field)] bg-[var(--color-field)] text-[var(--color-on-dark)]"
          : "border-[var(--color-line)] bg-[var(--color-surface-elevated)] text-[var(--color-ink)]"
      }`}
    >
      {label}
    </button>
  );
}
