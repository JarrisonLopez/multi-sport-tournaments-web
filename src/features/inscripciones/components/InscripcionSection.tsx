"use client";

import { useCatalogo } from "@/features/torneos/components/TorneosSection";

const disponibilidad = [
  { value: "fines-de-semana", label: "Fines de semana" },
  { value: "noches", label: "Noches entre semana" },
  { value: "mananas", label: "Mañanas" },
  { value: "flexible", label: "Flexible" },
];

const fieldClass =
  "min-h-11 w-full rounded-[4px] border border-[var(--color-line)] bg-[var(--color-input-bg)] px-3 py-3 text-[var(--color-ink)]";

export function InscripcionSection() {
  const state = useCatalogo();
  const torneos = state.status === "ready" ? state.data : [];

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

        <form className="max-w-[46rem] rounded-[10px] border border-[var(--color-line)] bg-[var(--color-surface-elevated)] p-8 max-[641px]:p-4">
          <div className="grid grid-cols-2 gap-6 max-[641px]:grid-cols-1">
            <div className="flex flex-col gap-2">
              <label htmlFor="nombre" className="text-[0.9375rem] font-bold">Nombre completo</label>
              <input id="nombre" name="nombre" type="text" autoComplete="name" placeholder="Ej. Valentina Ríos" className={fieldClass} disabled />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-[0.9375rem] font-bold">Correo electrónico</label>
              <input id="email" name="email" type="email" autoComplete="email" placeholder="tu@correo.com" className={fieldClass} disabled />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="torneo" className="text-[0.9375rem] font-bold">Torneo de interés</label>
              <select id="torneo" name="torneo" className={fieldClass} disabled>
                <option value="">Selecciona un torneo</option>
                {torneos.map((torneo) => (
                  <option key={torneo.id} value={torneo.id}>
                    {torneo.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="disponibilidad" className="text-[0.9375rem] font-bold">Disponibilidad preferida</label>
              <select id="disponibilidad" name="disponibilidad" className={fieldClass} disabled defaultValue="">
                <option value="">Selecciona una franja</option>
                {disponibilidad.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-full flex flex-col gap-2 max-[641px]:col-span-1">
              <label htmlFor="mensaje" className="text-[0.9375rem] font-bold">Mensaje o comentario</label>
              <textarea
                id="mensaje"
                name="mensaje"
                rows={4}
                placeholder="Cuéntanos tu posición, experiencia o si ya formas parte de un equipo."
                className={`${fieldClass} min-h-28 resize-y`}
                disabled
              />
            </div>
          </div>
          <div className="mt-6">
            <button
              type="button"
              disabled
              className="inline-flex min-h-[2.85rem] cursor-not-allowed items-center justify-center rounded-[4px] bg-[var(--color-accent)] px-5 text-[0.9375rem] font-bold text-[var(--color-on-accent)] opacity-60"
            >
              Enviar solicitud
            </button>
          </div>
          <p className="mt-4 max-w-none text-[0.9375rem] font-semibold text-[var(--color-muted)]" role="status">
            El formulario conserva la estructura de la entrega anterior. En esta fase no valida ni envía la solicitud.
          </p>
        </form>
      </div>
    </section>
  );
}
