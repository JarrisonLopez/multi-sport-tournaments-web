"use client";

import { useEffect, useState } from "react";
import { getTorneos } from "@/features/torneos/services/get-torneos";
import type { Pagination, Torneo } from "@/features/torneos/domain/torneo";

export type TorneosState =
  | { status: "loading"; page: number }
  | { status: "empty"; page: number; pagination: Pagination }
  | { status: "ready"; page: number; pagination: Pagination; data: Torneo[] }
  | { status: "error"; page: number; message: string };

export function useTorneos(page: number): TorneosState {
  const [state, setState] = useState<TorneosState>({ status: "loading", page });

  if (state.page !== page) {
    setState({ status: "loading", page });
  }

  useEffect(() => {
    const controller = new AbortController();

    getTorneos(page, controller.signal)
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

        const message =
          error instanceof Error ? error.message : "No se pudo cargar el catálogo.";
        setState({ status: "error", page, message });
      });

    return () => controller.abort();
  }, [page]);

  return state;
}
