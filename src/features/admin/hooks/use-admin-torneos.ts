"use client";

import { useEffect, useState } from "react";
import { getTorneos } from "@/features/torneos/services/get-torneos";
import type { TorneosState } from "@/features/torneos/hooks/use-torneos";

const PAGE_LIMIT = 6;

export function useAdminTorneos(page: number, reloadToken: number): TorneosState {
  const [state, setState] = useState<TorneosState>({ status: "loading", page });
  const [request, setRequest] = useState({ page, reloadToken });

  if (request.page !== page || request.reloadToken !== reloadToken) {
    setRequest({ page, reloadToken });
    setState({ status: "loading", page });
  }

  useEffect(() => {
    const controller = new AbortController();

    getTorneos(page, controller.signal, PAGE_LIMIT)
      .then((result) => {
        if (controller.signal.aborted) {
          return;
        }

        if (result.data.length === 0) {
          setState({ status: "empty", page, pagination: result.pagination });
          return;
        }

        setState({
          status: "ready",
          page,
          pagination: result.pagination,
          data: result.data,
        });
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) {
          return;
        }

        const message = error instanceof Error ? error.message : "No se pudo cargar el catálogo.";
        setState({ status: "error", page, message });
      });

    return () => controller.abort();
  }, [page, reloadToken]);

  return state;
}
