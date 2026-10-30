"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import {
  authErrorsFromMessage,
  hasAuthErrors,
  validateRegister,
  type AuthFieldErrors,
} from "@/features/auth/domain/rules";
import { register } from "@/features/auth/services/register";
import { safeNextPath } from "@/features/auth/services/session";
import { HttpError } from "@/features/common/http";

const fieldClass =
  "min-h-11 w-full rounded-[4px] border border-[var(--color-line)] bg-[var(--color-input-bg)] px-3 py-3 text-[var(--color-ink)]";

export function RegisterForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = safeNextPath(params.get("next"));
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<AuthFieldErrors>({});
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateRegister({ nombre, email, password });
    setErrors(nextErrors);
    if (hasAuthErrors(nextErrors)) {
      return;
    }

    setPending(true);
    try {
      await register({ nombre, email, password });
      router.push(next);
    } catch (error: unknown) {
      const message = error instanceof HttpError ? error.message : "No se pudo crear la cuenta.";
      setErrors(authErrorsFromMessage(message));
    } finally {
      setPending(false);
    }
  }

  const loginHref = next === "/" ? "/login" : `/login?next=${encodeURIComponent(next)}`;

  return (
    <main className="mx-auto w-[min(100%-2rem,70rem)] py-16">
      <h1 className="max-w-[18ch] text-[clamp(2rem,4vw,3rem)]">Registro</h1>
      <p className="mt-4 max-w-[48ch] text-[var(--color-muted)]">
        La cuenta nueva queda como usuario. El registro no asigna rol de administración.
      </p>
      <form className="mt-8 max-w-[32rem] rounded-[10px] border border-[var(--color-line)] bg-[var(--color-surface-elevated)] p-8 max-[641px]:p-4" onSubmit={onSubmit} noValidate>
        <div className="flex flex-col gap-6">
          <Field id="registro-nombre" label="Nombre completo" type="text" autoComplete="name" value={nombre} error={errors.nombre} onChange={setNombre} />
          <Field id="registro-email" label="Correo electrónico" type="email" autoComplete="email" value={email} error={errors.email} onChange={setEmail} />
          <Field id="registro-password" label="Contraseña" type="password" autoComplete="new-password" value={password} error={errors.password} onChange={setPassword} />
        </div>
        {errors.form ? (
          <p className="mt-4 font-semibold text-[var(--color-error)]" role="alert">
            {errors.form}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={pending}
          className="mt-6 inline-flex min-h-[2.85rem] items-center justify-center rounded-[4px] bg-[var(--color-accent)] px-5 text-[0.9375rem] font-bold text-[var(--color-on-accent)] disabled:cursor-wait disabled:opacity-70"
        >
          {pending ? "Creando cuenta…" : "Crear cuenta"}
        </button>
      </form>
      <p className="mt-4 text-[0.9375rem]">
        ¿Ya tienes cuenta?{" "}
        <Link href={loginHref} className="font-bold text-[var(--color-field-mid)] hover:underline">
          Ingresar
        </Link>
      </p>
    </main>
  );
}

function Field({
  id,
  label,
  type,
  autoComplete,
  value,
  error,
  onChange,
}: {
  id: string;
  label: string;
  type: "email" | "password" | "text";
  autoComplete: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-[0.9375rem] font-bold">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        autoComplete={autoComplete}
        value={value}
        aria-invalid={error !== undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={fieldClass}
        onChange={(event) => onChange(event.target.value)}
      />
      {error ? (
        <p id={`${id}-error`} className="text-[0.9375rem] font-semibold text-[var(--color-error)]" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
