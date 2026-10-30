"use client";

import { useEffect, useState } from "react";
import type { Inscripcion } from "@/features/inscripciones/domain/inscripcion";
import { getMisInscripciones } from "@/features/inscripciones/services/get-mis-inscripciones";
import { getTorneos } from "@/features/torneos/services/get-torneos";
import type { Torneo } from "@/features/torneos/domain/torneo";

export type MisInscripcionesState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "empty"; torneos: Torneo[] }
  | { status: "ready"; data: Inscripcion[]; torneos: Torneo[] }
  | { status: "error"; message: string };

export function useMisInscripciones(enabled: boolean): MisInscripcionesState {
  const [state, setState] = useState<MisInscripcionesState>(enabled ? { status: "loading" } : { status: "idle" });
  const [active, setActive] = useState(enabled);

  if (active !== enabled) {
    setActive(enabled);
    setState(enabled ? { status: "loading" } : { status: "idle" });
  }

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const controller = new AbortController();

    Promise.all([getMisInscripciones(controller.signal), getTorneos(1, controller.signal, 50)])
      .then(([inscripciones, catalogo]) => {
        if (controller.signal.aborted) {
          return;
        }

        if (inscripciones.length === 0) {
          setState({ status: "empty", torneos: catalogo.data });
          return;
        }

        setState({ status: "ready", data: inscripciones, torneos: catalogo.data });
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) {
          return;
        }

        const message = error instanceof Error ? error.message : "No se pudieron cargar las inscripciones.";
        setState({ status: "error", message });
      });

    return () => controller.abort();
  }, [enabled]);

  return state;
}
