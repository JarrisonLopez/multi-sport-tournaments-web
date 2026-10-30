import { Suspense } from "react";
import { AdminPanel } from "@/features/admin/components/AdminPanel";

export default function AdminPage() {
  return (
    <Suspense fallback={<p className="mx-auto w-[min(100%-1.5rem,70rem)] py-12 font-semibold">Cargando administración…</p>}>
      <AdminPanel />
    </Suspense>
  );
}
