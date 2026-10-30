"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { clearSession } from "@/features/auth/services/session";

type AuthControlsProps = {
  placement: "bar" | "identity" | "actions";
  onNavigate?: () => void;
};

const menuItemClass =
  "flex min-h-11 w-full items-center rounded-[4px] px-3 text-left text-[0.9375rem] font-semibold text-[var(--color-on-dark)] hover:bg-[rgba(200,245,66,0.08)] hover:text-[var(--color-accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]";

export function AuthControls({ placement, onNavigate }: AuthControlsProps) {
  const user = useAuth();
  const router = useRouter();

  function logout() {
    clearSession();
    onNavigate?.();
    router.push("/");
  }

  if (placement === "bar") {
    if (!user) {
      return (
        <Link
          href="/login"
          className="inline-flex min-h-11 items-center px-2 text-[0.9375rem] font-semibold text-[var(--color-on-dark)] hover:text-[var(--color-accent)]"
        >
          Ingresar
        </Link>
      );
    }

    return (
      <div className="flex flex-nowrap items-center gap-1">
        {user.role === "ADMIN" ? (
          <Link
            href="/admin"
            className="inline-flex min-h-11 shrink-0 items-center px-2 text-[0.9375rem] font-semibold whitespace-nowrap text-[var(--color-on-dark)] hover:text-[var(--color-accent)]"
          >
            Administración
          </Link>
        ) : null}
        <Link
          href="/mis-inscripciones"
          title={user.nombre}
          className="inline-flex min-h-11 max-w-[11rem] min-w-0 items-center truncate px-2 text-[0.9375rem] font-semibold text-[var(--color-accent)] hover:underline"
        >
          {user.nombre}
        </Link>
        <button
          type="button"
          className="inline-flex min-h-11 shrink-0 items-center px-2 text-[0.9375rem] font-semibold whitespace-nowrap text-[var(--color-on-dark)] hover:text-[var(--color-accent)]"
          onClick={logout}
        >
          Salir
        </button>
      </div>
    );
  }

  if (placement === "identity") {
    if (!user) {
      return null;
    }

    return (
      <div className="mb-2 border-b border-[rgba(243,247,242,0.12)] px-3 pb-3">
        <p className="truncate font-display text-[1.35rem] leading-tight font-bold" title={user.nombre}>
          {user.nombre}
        </p>
        <p className="mt-1 truncate text-[0.875rem] text-[rgba(243,247,242,0.78)]" title={user.email}>
          {user.email}
        </p>
        {user.role === "ADMIN" ? (
          <p className="mt-2 text-[0.75rem] font-bold tracking-[0.08em] text-[var(--color-accent)] uppercase">
            Administrador
          </p>
        ) : null}
      </div>
    );
  }

  if (!user) {
    return (
      <Link
        href="/login"
        className="mt-3 inline-flex min-h-11 w-full items-center justify-center rounded-[4px] bg-[var(--color-accent)] px-4 text-[0.9375rem] font-bold text-[var(--color-on-accent)]"
        onClick={onNavigate}
      >
        Ingresar
      </Link>
    );
  }

  return (
    <div className="mt-2 flex flex-col border-t border-[rgba(243,247,242,0.12)] pt-2">
      <Link href="/mis-inscripciones" className={menuItemClass} onClick={onNavigate}>
        Mis inscripciones
      </Link>
      {user.role === "ADMIN" ? (
        <Link href="/admin" className={menuItemClass} onClick={onNavigate}>
          Administración
        </Link>
      ) : null}
      <button type="button" className={menuItemClass} onClick={logout}>
        Cerrar sesión
      </button>
    </div>
  );
}
