import { Suspense } from "react";
import { LoginForm } from "@/features/auth/components/LoginForm";

export default function LoginPage() {
  return (
    <Suspense fallback={<p className="mx-auto w-[min(100%-2rem,70rem)] py-16 font-semibold">Cargando…</p>}>
      <LoginForm />
    </Suspense>
  );
}
