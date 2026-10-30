"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useAuth } from "@/features/auth/hooks/use-auth";
import {
  DISPONIBILIDADES,
  fechaUtcHoy,
  hasInscripcionErrors,
  inscripcionErrorsFromMessage,
  isDisponibilidad,
  motivoNoInscripcion,
  validateInscripcion,
  type Inscripcion,
  type InscripcionFieldErrors,
} from "@/features/inscripciones/domain/inscripcion";
import { createInscripcion } from "@/features/inscripciones/services/create-inscripcion";
import { HttpError } from "@/features/common/http";
import { useTorneos } from "@/features/torneos/hooks/use-torneos";

const fieldClass =
  "min-h-11 w-full rounded-[4px] border border-[var(--color-line)] bg-[var(--color-input-bg)] px-3 py-3 text-[var(--color-ink)]";

export function InscripcionSection() {
  const user = useAuth();
  const router = useRouter();
  const catalogo = useTorneos(1, 50);
  const hoy = fechaUtcHoy();

  const torneos = catalogo.status === "ready" ? catalogo.data : [];
  const abiertos = torneos.filter((torneo) => motivoNoInscripcion(torneo, hoy) === null);
  const cerrados = torneos.flatMap((torneo) => {
    const motivo = motivoNoInscripcion(torneo, hoy);
    return motivo === null ? [] : [{ torneo, motivo }];
  });

  const [torneoId, setTorneoId] = useState("");
  const [disponibilidad, setDisponibilidad] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [errors, setErrors] = useState<InscripcionFieldErrors>({});
  const [pending, setPending] = useState(false);
  const [confirmacion, setConfirmacion] = useState<Inscripcion | null>(null);

  const loginHref = "/login?next=%2F%23inscripcion";

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user) {
      router.push(loginHref);
      return;
    }

    const nextErrors = validateInscripcion({ torneoId, disponibilidad, mensaje }, abiertos);
    setErrors(nextErrors);
    if (hasInscripcionErrors(nextErrors) || !isDisponibilidad(disponibilidad)) {
      return;
    }

    setPending(true);
    setConfirmacion(null);
    try {
      const creada = await createInscripcion({
        torneoId,
        disponibilidad,
        mensaje,
      });
      setConfirmacion(creada);
      setMensaje("");
      setDisponibilidad("");
      setTorneoId("");
    } catch (error: unknown) {
      const message = error instanceof HttpError ? error.message : "No se pudo enviar la solicitud.";
      setErrors(inscripcionErrorsFromMessage(message));
    } finally {
      setPending(false);
    }
  }

  return (
    <section id="inscripcion" className="border-y border-[var(--color-line)] bg-[var(--color-section-alt)] py-[4.5rem] max-[641px]:py-12" aria-labelledby="inscripcion-title">
      <div className="mx-auto w-[min(100%-2rem,70rem)]">
        <div className="mb-8 max-w-[46rem]">
          <h2 id="inscripcion-title" className="mb-4 text-[clamp(1.75rem,2.4vw,2.35rem)]">
            Inscripción a un torneo
          </h2>
          <p className="text-[var(--color-muted)]">
            Completa el formulario para solicitar cupo en uno de los torneos activos. El equipo organizador te contactará para confirmar disponibilidad y requisitos del deporte.
          </p>
        </div>

        <form className="max-w-[46rem] rounded-[10px] border border-[var(--color-line)] bg-[var(--color-surface-elevated)] p-8 max-[641px]:p-4" onSubmit={onSubmit} noValidate>
          <div className="grid grid-cols-2 gap-6 max-[641px]:grid-cols-1">
            <IdentityField id="nombre" label="Nombre completo" value={user?.nombre ?? ""} />
            <IdentityField id="email" label="Correo electrónico" value={user?.email ?? ""} />
            <div className="flex flex-col gap-2">
              <label htmlFor="torneo" className="text-[0.9375rem] font-bold">Torneo de interés</label>
              <select
                id="torneo"
                name="torneoId"
                className={fieldClass}
                value={torneoId}
                disabled={!user || abiertos.length === 0 || pending}
                aria-invalid={errors.torneoId !== undefined}
                aria-describedby={errors.torneoId ? "torneo-error" : undefined}
                onChange={(event) => setTorneoId(event.target.value)}
              >
                <option value="">{abiertos.length === 0 ? "No hay torneos disponibles" : "Selecciona un torneo"}</option>
                {abiertos.map((torneo) => (
                  <option key={torneo.id} value={torneo.id}>
                    {torneo.nombre}
                  </option>
                ))}
              </select>
              {errors.torneoId ? <FieldAlert id="torneo-error" message={errors.torneoId} /> : null}
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="disponibilidad" className="text-[0.9375rem] font-bold">Disponibilidad preferida</label>
              <select
                id="disponibilidad"
                name="disponibilidad"
                className={fieldClass}
                value={disponibilidad}
                disabled={!user || abiertos.length === 0 || pending}
                aria-invalid={errors.disponibilidad !== undefined}
                aria-describedby={errors.disponibilidad ? "disponibilidad-error" : undefined}
                onChange={(event) => setDisponibilidad(event.target.value)}
              >
                <option value="">Selecciona una franja</option>
                {DISPONIBILIDADES.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.disponibilidad ? <FieldAlert id="disponibilidad-error" message={errors.disponibilidad} /> : null}
            </div>
            <div className="col-span-full flex flex-col gap-2 max-[641px]:col-span-1">
              <label htmlFor="mensaje" className="text-[0.9375rem] font-bold">Mensaje o comentario</label>
              <textarea
                id="mensaje"
                name="mensaje"
                rows={4}
                value={mensaje}
                placeholder="Cuéntanos tu posición, experiencia o si ya formas parte de un equipo."
                className={`${fieldClass} min-h-28 resize-y`}
                disabled={!user || abiertos.length === 0 || pending}
                aria-invalid={errors.mensaje !== undefined}
                aria-describedby={errors.mensaje ? "mensaje-error" : undefined}
                onChange={(event) => setMensaje(event.target.value)}
              />
              {errors.mensaje ? <FieldAlert id="mensaje-error" message={errors.mensaje} /> : null}
            </div>
          </div>

          <div className="mt-6">
            {user ? (
              <button
                type="submit"
                disabled={pending || abiertos.length === 0}
                className="inline-flex min-h-[2.85rem] items-center justify-center rounded-[4px] bg-[var(--color-accent)] px-5 text-[0.9375rem] font-bold text-[var(--color-on-accent)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {pending ? "Enviando…" : "Enviar solicitud"}
              </button>
            ) : (
              <Link
                href={loginHref}
                className="inline-flex min-h-[2.85rem] items-center justify-center rounded-[4px] bg-[var(--color-accent)] px-5 text-[0.9375rem] font-bold text-[var(--color-on-accent)]"
              >
                Ingresar para inscribirte
              </Link>
            )}
          </div>

          {!user ? (
            <p className="mt-4 text-[0.9375rem] font-semibold text-[var(--color-muted)]" role="status">
              Tu nombre y correo salen de la sesión. Inicia sesión para enviar la solicitud.
            </p>
          ) : null}

          {catalogo.status === "loading" ? (
            <p className="mt-4 font-semibold" aria-live="polite">Cargando torneos…</p>
          ) : null}

          {catalogo.status === "error" ? (
            <p className="mt-4 font-semibold text-[var(--color-error)]" role="alert">{catalogo.message}</p>
          ) : null}

          {errors.form ? (
            <p className="mt-4 font-semibold text-[var(--color-error)]" role="alert">{errors.form}</p>
          ) : null}

          {confirmacion ? (
            <p className="mt-4 font-semibold text-[var(--color-ink)]" role="status">
              Solicitud registrada con el identificador {confirmacion.id}. Puedes verla en{" "}
              <Link href="/mis-inscripciones" className="underline">
                Mis inscripciones
              </Link>
              .
            </p>
          ) : null}

          {cerrados.length > 0 ? (
            <div className="mt-6">
              <h3 className="mb-3 text-[1.15rem]">No admiten solicitudes</h3>
              <ul className="flex flex-col gap-2">
                {cerrados.map(({ torneo, motivo }) => (
                  <li key={torneo.id} className="text-[0.9375rem] text-[var(--color-muted)]">
                    <span className="font-bold text-[var(--color-ink)]">{`${torneo.nombre}. ${motivo}`}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {((catalogo.status === "ready" || catalogo.status === "empty") && abiertos.length === 0) ? (
            <p className="mt-4 font-semibold text-[var(--color-muted)]" role="status">
              Ningún torneo publicado admite inscripciones en este momento.
            </p>
          ) : null}
        </form>
      </div>
    </section>
  );
}

function IdentityField({ id, label, value }: { id: string; label: string; value: string }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-[0.9375rem] font-bold">{label}</label>
      <input
        id={id}
        name={id}
        type={id === "email" ? "email" : "text"}
        value={value}
        readOnly
        aria-readonly="true"
        placeholder="Disponible al iniciar sesión"
        className={`${fieldClass} cursor-default`}
      />
    </div>
  );
}

function FieldAlert({ id, message }: { id: string; message: string }) {
  return (
    <p id={id} className="text-[0.9375rem] font-semibold text-[var(--color-error)]" role="alert">
      {message}
    </p>
  );
}
