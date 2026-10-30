import Link from "next/link";
import type { Pagination as PaginationInfo } from "@/features/torneos/domain/torneo";

type PaginationProps = {
  pagination: PaginationInfo;
  limit: number | null;
  hrefFor?: (page: number, limit: number | null) => string;
};

function catalogHref(page: number, limit: number | null): string {
  const params = new URLSearchParams();

  if (page > 1) {
    params.set("page", String(page));
  }

  if (limit !== null) {
    params.set("limit", String(limit));
  }

  const query = params.toString();
  return `${query.length > 0 ? `/?${query}` : "/"}#torneos`;
}

export function Pagination({ pagination, limit, hrefFor = catalogHref }: PaginationProps) {
  if (pagination.totalPages <= 1) {
    return null;
  }

  const previous = pagination.page > 1 ? pagination.page - 1 : null;
  const next = pagination.page < pagination.totalPages ? pagination.page + 1 : null;

  return (
    <nav aria-label="Paginación de torneos" className="mt-8 flex flex-wrap items-center gap-3 text-[0.9375rem] font-semibold">
      {previous ? (
        <Link href={hrefFor(previous, limit)} className="inline-flex min-h-11 items-center rounded-[4px] border border-[var(--color-line)] px-4 hover:border-[var(--color-field)]">
          Anterior
        </Link>
      ) : (
        <span className="inline-flex min-h-11 items-center px-4 text-[var(--color-muted)]">Anterior</span>
      )}
      <p>
        Página {pagination.page} de {pagination.totalPages}
      </p>
      {next ? (
        <Link href={hrefFor(next, limit)} className="inline-flex min-h-11 items-center rounded-[4px] border border-[var(--color-line)] px-4 hover:border-[var(--color-field)]">
          Siguiente
        </Link>
      ) : (
        <span className="inline-flex min-h-11 items-center px-4 text-[var(--color-muted)]">Siguiente</span>
      )}
    </nav>
  );
}
