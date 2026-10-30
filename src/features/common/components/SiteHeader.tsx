"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { AuthControls } from "@/features/auth/components/AuthControls";

type Theme = "light" | "dark";

function subscribeToTheme(onChange: () => void): () => void {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => observer.disconnect();
}

function readTheme(): Theme {
  return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
}

function readServerTheme(): Theme {
  return "light";
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path fill="currentColor" d="M21 14.5A8.5 8.5 0 1 1 9.5 3a7 7 0 0 0 11.5 11.5z" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <circle cx="12" cy="12" r="4" fill="currentColor" />
      <path
        fill="currentColor"
        d="M11 2h2v3h-2zm0 17h2v3h-2zM2 11h3v2H2zm17 0h3v2h-3zM4.2 5.6l1.4-1.4 2.1 2.1-1.4 1.4zm12.1 12.1 1.4-1.4 2.1 2.1-1.4 1.4zM18.4 4.2l1.4 1.4-2.1 2.1-1.4-1.4zM6.3 16.3l1.4 1.4-2.1 2.1-1.4-1.4z"
      />
    </svg>
  );
}

const links = [
  { href: "/#inicio", label: "Inicio" },
  { href: "/#plataforma", label: "Plataforma" },
  { href: "/#torneos", label: "Torneos" },
  { href: "/#canchas", label: "Canchas" },
  { href: "/#jugadores", label: "Jugadores" },
  { href: "/#inscripcion", label: "Inscripción" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const theme = useSyncExternalStore(subscribeToTheme, readTheme, readServerTheme);
  const isDark = theme === "dark";

  function toggleTheme() {
    const next: Theme = isDark ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      window.localStorage.setItem("mst-theme", next);
    } catch {
      // El tema visible cambia aunque el navegador bloquee localStorage.
    }
  }

  return (
    <header className="sticky top-0 z-20 border-b border-[rgba(200,245,66,0.18)] bg-[var(--color-header-bg)] text-[var(--color-on-dark)] backdrop-blur-md">
      <div className="mx-auto flex min-h-[4.25rem] w-[min(100%-2rem,70rem)] items-center justify-between gap-6 py-0 max-[641px]:flex-col max-[641px]:items-stretch max-[641px]:gap-0 max-[641px]:py-3">
        <div className="flex min-w-0 items-center justify-between gap-4 max-[641px]:w-full">
          <Link
            className="inline-flex min-w-0 items-center gap-[0.7rem]"
            href="/#inicio"
            aria-label="Multi Sport Tournaments — inicio"
          >
            <span className="h-[0.85rem] w-[0.85rem] shrink-0 rotate-45 bg-[var(--color-accent)]" aria-hidden="true" />
            <span className="font-display text-[1.2rem] leading-tight font-bold tracking-[0.04em] uppercase max-[641px]:text-base">
              Multi Sport Tournaments
            </span>
          </Link>

          <div className="flex shrink-0 items-center gap-3">
            <AuthControls />
              <button
              type="button"
              className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-[4px] border border-[rgba(200,245,66,0.35)] px-3 text-[0.8125rem] font-bold tracking-[0.04em] text-[var(--color-on-dark)] uppercase hover:border-[var(--color-accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
              aria-pressed={isDark}
              aria-label={isDark ? "Activar modo claro" : "Activar modo oscuro"}
              suppressHydrationWarning
              onClick={toggleTheme}
            >
              {isDark ? <SunIcon /> : <MoonIcon />}
              <span className="max-[641px]:sr-only">Tema</span>
            </button>

            <button
              type="button"
              className="hidden h-11 w-11 items-center justify-center rounded-[4px] border border-[rgba(200,245,66,0.35)] max-[641px]:inline-flex"
              aria-expanded={open}
              aria-controls="site-nav"
              aria-label={open ? "Cerrar menú de navegación" : "Abrir menú de navegación"}
              onClick={() => setOpen((current) => !current)}
            >
              <span className="flex w-[1.15rem] flex-col gap-[0.28rem]" aria-hidden="true">
                <span className="block h-0.5 w-full rounded-sm bg-[var(--color-accent)]" />
                <span className="block h-0.5 w-full rounded-sm bg-[var(--color-accent)]" />
                <span className="block h-0.5 w-full rounded-sm bg-[var(--color-accent)]" />
              </span>
            </button>
          </div>
        </div>

        <nav
          id="site-nav"
          aria-label="Navegación principal"
          className={`min-w-0 max-[641px]:w-full max-[641px]:pt-2 ${open ? "max-[641px]:block" : "max-[641px]:hidden"}`}
        >
          <ul className="flex flex-wrap justify-end gap-x-[1.15rem] gap-y-1 max-[641px]:flex-col max-[641px]:items-stretch">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-[0.9375rem] font-semibold opacity-85 hover:text-[var(--color-accent)] hover:opacity-100 focus-visible:text-[var(--color-accent)] focus-visible:opacity-100 max-[641px]:block max-[641px]:border-b max-[641px]:border-[rgba(243,247,242,0.12)] max-[641px]:py-3"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
