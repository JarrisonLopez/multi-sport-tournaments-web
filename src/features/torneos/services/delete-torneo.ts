import { http } from "@/features/common/http";

export async function deleteTorneo(id: string): Promise<void> {
  await http(`/api/torneos/${encodeURIComponent(id)}`, { method: "DELETE" });
}
