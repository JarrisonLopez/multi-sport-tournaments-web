"use client";

import { useEffect, useRef } from "react";

type DeleteConfirmProps = {
  nombre: string;
  pending: boolean;
  error?: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export function DeleteConfirm({ nombre, pending, error, onCancel, onConfirm }: DeleteConfirmProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    cancelRef.current?.focus();
  }, []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !pending) {
        onCancel();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onCancel, pending]);

  return (
    <div className="fixed inset-0 z-40 grid place-items-center bg-[rgba(7,26,20,0.62)] px-4" role="presentation">
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-title"
        aria-describedby="delete-description"
        className="w-full max-w-md rounded-[10px] border border-[var(--color-line)] bg-[var(--color-surface-elevated)] p-5"
      >
        <h2 id="delete-title" className="text-[1.45rem]">Eliminar torneo</h2>
        <p id="delete-description" className="mt-3 text-[var(--color-muted)]">
          ¿Eliminar «{nombre}»? Esta acción no se puede deshacer.
        </p>
        {error ? <p className="mt-3 font-semibold text-[var(--color-error)]" role="alert">{error}</p> : null}
        <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            ref={cancelRef}
            type="button"
            disabled={pending}
            className="inline-flex min-h-11 items-center justify-center rounded-[4px] border border-[var(--color-line)] px-5 text-[0.9375rem] font-bold"
            onClick={onCancel}
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={pending}
            className="inline-flex min-h-11 items-center justify-center rounded-[4px] bg-[var(--color-field)] px-5 text-[0.9375rem] font-bold text-[var(--color-on-dark)] disabled:cursor-wait disabled:opacity-70"
            onClick={onConfirm}
          >
            {pending ? "Eliminando…" : "Eliminar"}
          </button>
        </div>
      </div>
    </div>
  );
}
