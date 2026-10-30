import { Suspense } from "react";
import { RegisterForm } from "@/features/auth/components/RegisterForm";

export default function RegistroPage() {
  return (
    <Suspense fallback={<p className="mx-auto w-[min(100%-2rem,70rem)] py-16 font-semibold">Cargando…</p>}>
      <RegisterForm />
    </Suspense>
  );
}
