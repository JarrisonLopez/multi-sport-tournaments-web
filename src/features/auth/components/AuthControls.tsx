"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { clearSession } from "@/features/auth/services/session";

export function AuthControls() {
  const user = useAuth();
  const router = useRouter();

  if (!user) {
    return (
      <Link
        href="/login"
        className="inline-flex min-h-11 items-center text-[0.9375rem] font-semibold text-[var(--color-on-dark)] hover:text-[var(--color-accent)]"
      >
        Ingresar
      </Link>
    );
  }

  return (
    <div className="flex min-w-0 items-center gap-3">
      <Link
        href="/mis-inscripciones"
        className="max-w-[9rem] truncate text-[0.9375rem] font-semibold text-[var(--color-accent)] hover:underline"
      >
        {user.nombre}
      </Link>
      <button
        type="button"
        className="inline-flex min-h-11 items-center text-[0.9375rem] font-semibold text-[var(--color-on-dark)] hover:text-[var(--color-accent)]"
        onClick={() => {
          clearSession();
          router.push("/");
        }}
      >
        Salir
      </button>
    </div>
  );
}
