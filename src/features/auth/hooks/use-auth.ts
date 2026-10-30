"use client";

import { useSyncExternalStore } from "react";
import type { User } from "@/features/auth/domain/auth";
import { readUserSnapshot, subscribeSession } from "@/features/auth/services/session";

function readServerUser(): User | null {
  return null;
}

export function useAuth(): User | null {
  return useSyncExternalStore(subscribeSession, readUserSnapshot, readServerUser);
}
