import { PendingRoute } from "@/features/common/components/PendingRoute";

export default function AdminPage() {
  return (
    <PendingRoute
      title="Administración"
      description="Esta ruta queda reservada para el rol administrador. Todavía no protege el acceso ni administra el catálogo."
    />
  );
}
