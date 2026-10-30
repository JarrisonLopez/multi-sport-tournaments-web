import { cloneElement, type FormEvent, type ReactElement } from "react";
import {
  ESTADO_LABEL,
  ESTADOS_TORNEO,
  type TorneoFieldErrors,
  type TorneoFormValues,
} from "@/features/torneos/domain/torneo-form";

const fieldClass =
  "min-h-11 w-full rounded-[4px] border border-[var(--color-line)] bg-[var(--color-input-bg)] px-3 py-3 text-[var(--color-ink)]";

type TorneoFormProps = {
  mode: "create" | "edit";
  values: TorneoFormValues;
  errors: TorneoFieldErrors;
  pending: boolean;
  onChange: (update: (current: TorneoFormValues) => TorneoFormValues) => void;
  onSubmit: () => void;
  onCancel: () => void;
};

export function TorneoForm({ mode, values, errors, pending, onChange, onSubmit, onCancel }: TorneoFormProps) {
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit();
  }

  return (
    <form className="rounded-[10px] border border-[var(--color-line)] bg-[var(--color-surface-elevated)] p-4 sm:p-6" onSubmit={submit} noValidate>
      <h2 className="mb-4 text-[1.45rem]">{mode === "create" ? "Nuevo torneo" : "Editar torneo"}</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field id="admin-id" label="Identificador" error={errors.id}>
          <input
            name="id"
            value={values.id}
            readOnly={mode === "edit"}
            className={`${fieldClass} ${mode === "edit" ? "cursor-default bg-[var(--color-surface)]" : ""}`}
            onChange={(event) => onChange((current) => ({ ...current, id: event.target.value }))}
          />
        </Field>
        <Field id="admin-nombre" label="Nombre" error={errors.nombre}>
          <input
            name="nombre"
            value={values.nombre}
            className={fieldClass}
            onChange={(event) => onChange((current) => ({ ...current, nombre: event.target.value }))}
          />
        </Field>
        <Field id="admin-deporte" label="Deporte" error={errors.deporte}>
          <input
            name="deporte"
            value={values.deporte}
            className={fieldClass}
            onChange={(event) => onChange((current) => ({ ...current, deporte: event.target.value }))}
          />
        </Field>
        <Field id="admin-estado" label="Estado" error={errors.estado}>
          <select
            name="estado"
            value={values.estado}
            className={fieldClass}
            onChange={(event) => onChange((current) => ({ ...current, estado: event.target.value }))}
          >
            {ESTADOS_TORNEO.map((estado) => (
              <option key={estado} value={estado}>
                {ESTADO_LABEL[estado]}
              </option>
            ))}
          </select>
        </Field>
        <fieldset className="grid gap-2">
          <legend className="text-[0.9375rem] font-bold">Cupo</legend>
          <div className="flex flex-wrap gap-3">
            <label className="inline-flex min-h-11 items-center gap-2">
              <input
                type="radio"
                name="cupoModo"
                value="equipos"
                checked={values.cupoModo === "equipos"}
                onChange={() => onChange((current) => ({ ...current, cupoModo: "equipos" }))}
              />
              Equipos
            </label>
            <label className="inline-flex min-h-11 items-center gap-2">
              <input
                type="radio"
                name="cupoModo"
                value="jugadores"
                checked={values.cupoModo === "jugadores"}
                onChange={() => onChange((current) => ({ ...current, cupoModo: "jugadores" }))}
              />
              Jugadores
            </label>
          </div>
          <input
            id="admin-cupo"
            name="cupo"
            inputMode="numeric"
            value={values.cupo}
            aria-invalid={errors.cupo !== undefined}
            aria-describedby={errors.cupo ? "admin-cupo-error" : undefined}
            className={fieldClass}
            onChange={(event) => onChange((current) => ({ ...current, cupo: event.target.value }))}
          />
          {errors.cupo ? <Alert id="admin-cupo-error" message={errors.cupo} /> : null}
        </fieldset>
        <Field id="admin-sede-id" label="Identificador de la sede" error={errors.sedePrincipalId}>
          <input
            name="sedePrincipalId"
            value={values.sedePrincipalId}
            className={fieldClass}
            onChange={(event) => onChange((current) => ({ ...current, sedePrincipalId: event.target.value }))}
          />
        </Field>
        <Field id="admin-sede" label="Nombre de la sede" error={errors.sedeNombre}>
          <input
            name="sedeNombre"
            value={values.sedeNombre}
            className={fieldClass}
            onChange={(event) => onChange((current) => ({ ...current, sedeNombre: event.target.value }))}
          />
        </Field>
        <Field id="admin-ciudad" label="Ciudad" error={errors.ciudad}>
          <input
            name="ciudad"
            value={values.ciudad}
            className={fieldClass}
            onChange={(event) => onChange((current) => ({ ...current, ciudad: event.target.value }))}
          />
        </Field>
        <Field id="admin-cierre" label="Cierre de inscripciones" error={errors.cierreInscripciones}>
          <input
            name="cierreInscripciones"
            type="date"
            value={values.cierreInscripciones}
            className={fieldClass}
            onChange={(event) => onChange((current) => ({ ...current, cierreInscripciones: event.target.value }))}
          />
        </Field>
        <div className="flex flex-col gap-2 sm:col-span-2">
          <label htmlFor="admin-descripcion" className="text-[0.9375rem] font-bold">Descripción</label>
          <textarea
            id="admin-descripcion"
            name="descripcion"
            rows={4}
            value={values.descripcion}
            aria-invalid={errors.descripcion !== undefined}
            aria-describedby={errors.descripcion ? "admin-descripcion-error" : undefined}
            className={`${fieldClass} min-h-28 resize-y`}
            onChange={(event) => onChange((current) => ({ ...current, descripcion: event.target.value }))}
          />
          {errors.descripcion ? <Alert id="admin-descripcion-error" message={errors.descripcion} /> : null}
        </div>
      </div>
      {errors.form ? <p className="mt-4 font-semibold text-[var(--color-error)]" role="alert">{errors.form}</p> : null}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex min-h-11 items-center justify-center rounded-[4px] bg-[var(--color-accent)] px-5 text-[0.9375rem] font-bold text-[var(--color-on-accent)] disabled:cursor-wait disabled:opacity-70"
        >
          {pending ? "Guardando…" : mode === "create" ? "Crear torneo" : "Guardar cambios"}
        </button>
        <button
          type="button"
          className="inline-flex min-h-11 items-center justify-center rounded-[4px] border border-[var(--color-line)] px-5 text-[0.9375rem] font-bold"
          onClick={onCancel}
        >
          {mode === "create" ? "Limpiar" : "Cancelar edición"}
        </button>
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: ReactElement<{ id?: string; "aria-invalid"?: boolean; "aria-describedby"?: string }>;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-[0.9375rem] font-bold">{label}</label>
      {cloneElement(children, {
        id,
        "aria-invalid": error !== undefined,
        "aria-describedby": error ? `${id}-error` : undefined,
      })}
      {error ? <Alert id={`${id}-error`} message={error} /> : null}
    </div>
  );
}

function Alert({ id, message }: { id: string; message: string }) {
  return (
    <p id={id} className="text-[0.9375rem] font-semibold text-[var(--color-error)]" role="alert">
      {message}
    </p>
  );
}
