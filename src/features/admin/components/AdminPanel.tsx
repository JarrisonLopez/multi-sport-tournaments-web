"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DeleteConfirm } from "@/features/admin/components/DeleteConfirm";
import { AdminTorneoList } from "@/features/admin/components/AdminTorneoList";
import { TorneoForm } from "@/features/admin/components/TorneoForm";
import { useAdminTorneos } from "@/features/admin/hooks/use-admin-torneos";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { useHydrated } from "@/features/auth/hooks/use-hydrated";
import { Pagination } from "@/features/common/components/Pagination";
import { HttpError } from "@/features/common/http";
import { createTorneo } from "@/features/torneos/services/create-torneo";
import { deleteTorneo } from "@/features/torneos/services/delete-torneo";
import { updateTorneo } from "@/features/torneos/services/update-torneo";
import type { Torneo } from "@/features/torneos/domain/torneo";
import {
  emptyTorneoForm,
  hasTorneoErrors,
  torneoErrorsFromMessage,
  torneoToForm,
  validateTorneoForm,
  type TorneoFieldErrors,
  type TorneoFormValues,
} from "@/features/torneos/domain/torneo-form";

function readPage(value: string | null): number {
  return value && /^[1-9]\d*$/.test(value) ? Number(value) : 1;
}

function adminHref(page: number): string {
  return page > 1 ? `/admin?page=${page}` : "/admin";
}

export function AdminPanel() {
  const router = useRouter();
  const params = useSearchParams();
  const hydrated = useHydrated();
  const user = useAuth();
  const page = readPage(params.get("page"));
  const [reloadToken, setReloadToken] = useState(0);
  const catalogo = useAdminTorneos(page, reloadToken);
  const [values, setValues] = useState<TorneoFormValues>(emptyTorneoForm);
  const [errors, setErrors] = useState<TorneoFieldErrors>({});
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [pending, setPending] = useState(false);
  const [notice, setNotice] = useState("");
  const [pendingDelete, setPendingDelete] = useState<Torneo | null>(null);
  const [deleteError, setDeleteError] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    if (!user) {
      router.replace("/login?next=/admin");
      return;
    }

    if (user.role !== "ADMIN") {
      router.replace("/");
    }
  }, [hydrated, router, user]);

  if (!hydrated || !user || user.role !== "ADMIN") {
    return (
      <main className="mx-auto w-[min(100%-1.5rem,70rem)] py-12">
        <p className="font-semibold" aria-live="polite">Comprobando acceso…</p>
      </main>
    );
  }

  async function save() {
    const parsed = validateTorneoForm(values, mode);
    setErrors(parsed.errors);
    setNotice("");
    if (hasTorneoErrors(parsed.errors) || !parsed.value) {
      return;
    }

    setPending(true);
    try {
      const saved = mode === "create" ? await createTorneo(parsed.value) : await updateTorneo(parsed.value);
      setNotice(mode === "create" ? `Torneo creado: ${saved.nombre}.` : `Torneo actualizado: ${saved.nombre}.`);
      setMode("create");
      setValues(emptyTorneoForm());
      setReloadToken((current) => current + 1);
    } catch (error: unknown) {
      const message = error instanceof HttpError ? error.message : "No se pudo guardar el torneo.";
      setErrors(torneoErrorsFromMessage(message));
    } finally {
      setPending(false);
    }
  }

  async function confirmDelete() {
    if (!pendingDelete) {
      return;
    }

    setDeleting(true);
    setDeleteError("");
    try {
      await deleteTorneo(pendingDelete.id);
      const nombre = pendingDelete.nombre;
      setPendingDelete(null);
      setNotice(`Torneo eliminado: ${nombre}.`);
      if (values.id === pendingDelete.id) {
        setMode("create");
        setValues(emptyTorneoForm());
        setErrors({});
      }
      const remaining = catalogo.status === "ready" ? catalogo.data.length - 1 : 1;
      if (remaining === 0 && page > 1) {
        router.replace(adminHref(page - 1));
      }
      setReloadToken((current) => current + 1);
    } catch (error: unknown) {
      const message = error instanceof HttpError ? error.message : "No se pudo eliminar el torneo.";
      setDeleteError(message);
    } finally {
      setDeleting(false);
    }
  }

  const torneos = catalogo.status === "ready" ? catalogo.data : [];

  return (
    <main className="mx-auto w-[min(100%-1.5rem,70rem)] py-8 sm:w-[min(100%-2rem,70rem)] sm:py-12">
      <h1 className="text-[clamp(1.85rem,4vw,2.6rem)]">Administración</h1>
      <p className="mt-3 max-w-[48ch] text-[var(--color-muted)]">
        Crea, edita y elimina torneos del catálogo. Los cambios se guardan en la API.
      </p>
      {notice ? (
        <p className="mt-4 rounded-[8px] border border-[var(--color-field-mid)] px-3 py-3 font-semibold" role="status">
          {notice}
        </p>
      ) : null}
      <div className="mt-6">
        <TorneoForm
          mode={mode}
          values={values}
          errors={errors}
          pending={pending}
          onChange={setValues}
          onSubmit={() => {
            void save();
          }}
          onCancel={() => {
            setMode("create");
            setValues(emptyTorneoForm());
            setErrors({});
          }}
        />
      </div>
      <section className="mt-8" aria-labelledby="admin-list-title">
        <h2 id="admin-list-title" className="mb-4 text-[1.7rem]">Torneos</h2>
        {catalogo.status === "loading" ? <p className="font-semibold" aria-live="polite">Cargando torneos…</p> : null}
        {catalogo.status === "error" ? <p className="font-semibold text-[var(--color-error)]" role="alert">{catalogo.message}</p> : null}
        {catalogo.status === "empty" ? (
          <p className="rounded-[10px] border border-dashed border-[var(--color-line)] p-6 font-semibold text-[var(--color-muted)]">
            No hay torneos en esta página.
          </p>
        ) : null}
        {catalogo.status === "ready" ? (
          <AdminTorneoList
            torneos={torneos}
            onEdit={(torneo) => {
              setMode("edit");
              setValues(torneoToForm(torneo));
              setErrors({});
              setNotice("");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onDelete={(torneo) => {
              setDeleteError("");
              setPendingDelete(torneo);
            }}
          />
        ) : null}
        {catalogo.status === "ready" || catalogo.status === "empty" ? (
          <Pagination
            pagination={catalogo.pagination}
            limit={null}
            hrefFor={(nextPage) => adminHref(nextPage)}
          />
        ) : null}
      </section>
      {pendingDelete ? (
        <DeleteConfirm
          nombre={pendingDelete.nombre}
          pending={deleting}
          error={deleteError || undefined}
          onCancel={() => {
            if (!deleting) {
              setPendingDelete(null);
            }
          }}
          onConfirm={() => {
            void confirmDelete();
          }}
        />
      ) : null}
    </main>
  );
}
