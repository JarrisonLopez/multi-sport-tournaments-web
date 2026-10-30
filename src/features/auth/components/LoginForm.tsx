"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { authErrorsFromMessage, hasAuthErrors, validateLogin, type AuthFieldErrors } from "@/features/auth/domain/rules";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { useHydrated } from "@/features/auth/hooks/use-hydrated";
import { login } from "@/features/auth/services/login";
import { safeNextPath } from "@/features/auth/services/session";
import { HttpError } from "@/features/common/http";

const fieldClass =
  "min-h-11 w-full rounded-[4px] border border-[var(--color-line)] bg-[var(--color-input-bg)] px-3 py-3 text-[var(--color-ink)]";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const hydrated = useHydrated();
  const user = useAuth();
  const next = safeNextPath(params.get("next"));
  const signedInHere = useRef(false);

  useEffect(() => {
    if (hydrated && user && !signedInHere.current) {
      router.replace("/");
    }
  }, [hydrated, router, user]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<AuthFieldErrors>({});
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateLogin({ email, password });
    setErrors(nextErrors);
    if (hasAuthErrors(nextErrors)) {
      return;
    }

    setPending(true);
    try {
      signedInHere.current = true;
      await login({ email, password });
      router.push(next);
    } catch (error: unknown) {
      const message = error instanceof HttpError ? error.message : "No se pudo iniciar sesión.";
      signedInHere.current = false;
      setErrors(authErrorsFromMessage(message));
    } finally {
      setPending(false);
    }
  }

  const registroHref = next === "/" ? "/registro" : `/registro?next=${encodeURIComponent(next)}`;

  if (hydrated && user) {
    return (
      <main className="mx-auto w-[min(100%-2rem,70rem)] py-16">
        <p className="font-semibold" aria-live="polite">Volviendo al inicio…</p>
      </main>
    );
  }

  return (
    <main className="mx-auto w-[min(100%-2rem,70rem)] py-16">
      <h1 className="max-w-[18ch] text-[clamp(2rem,4vw,3rem)]">Ingresar</h1>
      <p className="mt-4 max-w-[48ch] text-[var(--color-muted)]">
        Usa el correo y la contraseña de tu cuenta para continuar.
      </p>
      <form className="mt-8 max-w-[32rem] rounded-[10px] border border-[var(--color-line)] bg-[var(--color-surface-elevated)] p-8 max-[641px]:p-4" onSubmit={onSubmit} noValidate>
        <div className="flex flex-col gap-6">
          <Field
            id="login-email"
            label="Correo electrónico"
            type="email"
            autoComplete="email"
            value={email}
            error={errors.email}
            onChange={setEmail}
          />
          <Field
            id="login-password"
            label="Contraseña"
            type="password"
            autoComplete="current-password"
            value={password}
            error={errors.password}
            onChange={setPassword}
          />
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
          {pending ? "Ingresando…" : "Ingresar"}
        </button>
      </form>
      <p className="mt-4 text-[0.9375rem]">
        ¿No tienes cuenta?{" "}
        <Link href={registroHref} className="font-bold text-[var(--color-field-mid)] hover:underline">
          Crear cuenta
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
