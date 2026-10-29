import Link from "next/link";
import type { Pagination as PaginationInfo } from "@/features/torneos/domain/torneo";

type PaginationProps = {
  pagination: PaginationInfo;
};

function pageHref(page: number): string {
  return page <= 1 ? "/#torneos" : `/?page=${page}#torneos`;
}

export function Pagination({ pagination }: PaginationProps) {
  if (pagination.totalPages <= 1) {
    return null;
  }

  const previous = pagination.page > 1 ? pagination.page - 1 : null;
  const next = pagination.page < pagination.totalPages ? pagination.page + 1 : null;

  return (
    <nav aria-label="Paginación de torneos" className="mt-6 flex flex-wrap items-center gap-3 text-[0.9375rem] font-semibold">
      {previous ? (
        <Link href={pageHref(previous)} className="underline-offset-4 hover:underline">
          Anterior
        </Link>
      ) : (
        <span className="text-[var(--color-muted)]">Anterior</span>
      )}
      <p>
        Página {pagination.page} de {pagination.totalPages}
      </p>
      {next ? (
        <Link href={pageHref(next)} className="underline-offset-4 hover:underline">
          Siguiente
        </Link>
      ) : (
        <span className="text-[var(--color-muted)]">Siguiente</span>
      )}
    </nav>
  );
}
