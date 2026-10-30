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
    <section id="torneos" className="scroll-mt-20 py-12 sm:py-16 lg:py-[4.5rem]" aria-labelledby="torneos-title">
      <div className="mx-auto w-[min(100%-1.5rem,70rem)] sm:w-[min(100%-2rem,70rem)]">
        <div className="mb-6 max-w-[46rem] sm:mb-8">
          <h2 id="torneos-title" className="mb-3 text-[1.7rem] sm:mb-4 sm:text-[clamp(1.85rem,2.4vw,2.35rem)]">
            Torneos activos
          </h2>
          <p className="text-base leading-relaxed text-[var(--color-muted)] sm:text-[1.0625rem]">
            Competencias publicadas en la plataforma. Filtra por deporte para encontrar el torneo que te interesa.
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
            <div
              className="-mx-4 mb-6 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:mb-8 sm:flex-wrap sm:overflow-visible sm:px-0"
              role="group"
              aria-label="Filtrar torneos por deporte"
            >
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
              <div className="rounded-[10px] border border-dashed border-[var(--color-line)] bg-[var(--color-surface-elevated)] px-5 py-10 text-center">
                <p className="font-display text-[1.45rem]">Sin resultados</p>
                <p className="mx-auto mt-2 max-w-[36ch] text-[var(--color-muted)]">
                  No hay torneos de {deporte} en esta página del catálogo.
                </p>
                <button
                  type="button"
                  className="mt-5 inline-flex min-h-11 items-center justify-center rounded-[4px] bg-[var(--color-field)] px-5 text-[0.9375rem] font-bold text-[var(--color-on-dark)]"
                  onClick={() => setDeporte("todos")}
                >
                  Ver todos los deportes
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3">
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
      className={`inline-flex min-h-11 shrink-0 items-center rounded-[4px] border px-4 text-[0.9375rem] font-bold whitespace-nowrap focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)] ${
        active
          ? "border-[var(--color-field)] bg-[var(--color-field)] text-[var(--color-on-dark)]"
          : "border-[var(--color-line)] bg-[var(--color-surface-elevated)] text-[var(--color-ink)]"
      }`}
    >
      {label}
    </button>
  );
}
