"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { readSession } from "@/features/auth/services/session";
import { disponibilidadLabel } from "@/features/inscripciones/domain/inscripcion";
import { useMisInscripciones } from "@/features/inscripciones/hooks/use-mis-inscripciones";

export function MisInscripcionesPanel() {
  const router = useRouter();
  const user = useAuth();

  useEffect(() => {
    if (!readSession()) {
      router.replace("/login?next=/mis-inscripciones");
    }
  }, [router]);

  const state = useMisInscripciones(user !== null);

  return (
    <main className="mx-auto w-[min(100%-2rem,70rem)] py-16">
      <h1 className="max-w-[18ch] text-[clamp(2rem,4vw,3rem)]">Mis inscripciones</h1>
      <p className="mt-4 max-w-[48ch] text-[var(--color-muted)]">
        Solicitudes registradas con tu cuenta.
      </p>

      {!user || state.status === "idle" || state.status === "loading" ? (
        <p className="mt-8 font-semibold" aria-live="polite">Cargando inscripciones…</p>
      ) : null}

      {state.status === "error" ? (
        <p className="mt-8 font-semibold text-[var(--color-error)]" role="alert">{state.message}</p>
      ) : null}

      {state.status === "empty" ? (
        <p className="mt-8 rounded-[10px] border border-dashed border-[var(--color-line)] p-6 font-semibold text-[var(--color-muted)]">
          Todavía no tienes solicitudes.{" "}
          <Link href="/#inscripcion" className="underline">
            Ir al formulario
          </Link>
          .
        </p>
      ) : null}

      {state.status === "ready" ? (
        <ul className="mt-8 grid gap-6">
          {state.data.map((inscripcion) => {
            const torneo = state.torneos.find((item) => item.id === inscripcion.torneoId);
            return (
              <li key={inscripcion.id} className="rounded-[10px] border border-[var(--color-line)] bg-[var(--color-surface-elevated)] p-6">
                <h2 className="text-[1.45rem]">{torneo?.nombre ?? inscripcion.torneoId}</h2>
                <p className="mt-2 text-[0.9375rem] font-semibold">
                  {disponibilidadLabel(inscripcion.disponibilidad)} · {formatDateTime(inscripcion.createdAt)}
                </p>
                <p className="mt-3 text-[var(--color-muted)]">{inscripcion.mensaje}</p>
              </li>
            );
          })}
        </ul>
      ) : null}
    </main>
  );
}

function formatDateTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("es-CO", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}
