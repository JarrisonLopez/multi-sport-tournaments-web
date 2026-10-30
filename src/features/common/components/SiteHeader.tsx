"use client";

import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
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

const navLinkClass =
  "whitespace-nowrap text-[0.9375rem] font-semibold text-[var(--color-on-dark)] opacity-90 hover:text-[var(--color-accent)] hover:opacity-100 focus-visible:text-[var(--color-accent)] focus-visible:opacity-100 focus-visible:outline-none";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const theme = useSyncExternalStore(subscribeToTheme, readTheme, readServerTheme);
  const isDark = theme === "dark";

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    const desktop = window.matchMedia("(min-width: 1400px)");
    function closeOnDesktop(event: MediaQueryListEvent) {
      if (event.matches) {
        setOpen(false);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    desktop.addEventListener("change", closeOnDesktop);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      desktop.removeEventListener("change", closeOnDesktop);
    };
  }, []);

  function toggleTheme() {
    const next: Theme = isDark ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      window.localStorage.setItem("mst-theme", next);
    } catch {
      // El tema visible cambia aunque el navegador bloquee localStorage.
    }
  }

  function closeMenu() {
    setOpen(false);
  }

  return (
    <header className="sticky top-0 z-30 border-b border-[rgba(200,245,66,0.18)] bg-[var(--color-header-bg)] text-[var(--color-on-dark)] backdrop-blur-md">
      <div className="mx-auto flex h-16 w-[min(100%-1.5rem,72rem)] items-center gap-3 sm:w-[min(100%-2rem,72rem)] min-[1400px]:grid min-[1400px]:h-[4.25rem] min-[1400px]:w-[min(100%-3rem,90rem)] min-[1400px]:grid-cols-[auto_minmax(0,1fr)_auto] min-[1400px]:items-center min-[1400px]:gap-x-8">
        <Link
          className="inline-flex min-w-0 items-center gap-2"
          href="/#inicio"
          aria-label="Multi Sport Tournaments — inicio"
          onClick={closeMenu}
        >
          <span className="h-3 w-3 shrink-0 rotate-45 bg-[var(--color-accent)]" aria-hidden="true" />
          <span className="font-display text-[0.95rem] leading-none font-bold tracking-[0.04em] whitespace-nowrap uppercase max-[1399px]:truncate sm:text-base min-[1400px]:text-[1.15rem]">
            Multi Sport Tournaments
          </span>
        </Link>

        <nav className="min-w-0 max-[1399px]:hidden" aria-label="Navegación principal">
          <ul className="flex flex-nowrap items-center justify-center gap-x-4 min-[1600px]:gap-x-6">
            {links.map((link) => (
              <li key={link.href} className="shrink-0">
                <Link href={link.href} className={navLinkClass}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-2 min-[1400px]:ml-0 min-[1400px]:justify-self-end">
          <div className="max-[1399px]:hidden">
            <AuthControls placement="bar" />
          </div>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center gap-1.5 rounded-[4px] border border-[rgba(200,245,66,0.35)] text-[var(--color-on-dark)] hover:border-[var(--color-accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)] min-[1400px]:w-auto min-[1400px]:px-3"
            aria-pressed={isDark}
            aria-label={isDark ? "Activar modo claro" : "Activar modo oscuro"}
            suppressHydrationWarning
            onClick={toggleTheme}
          >
            {isDark ? <SunIcon /> : <MoonIcon />}
            <span className="text-[0.8125rem] font-bold tracking-[0.04em] uppercase max-[1399px]:hidden" aria-hidden="true">
              Tema
            </span>
          </button>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-[4px] border border-[rgba(200,245,66,0.35)] min-[1400px]:hidden"
            aria-expanded={open}
            aria-controls="site-nav"
            aria-label={open ? "Cerrar menú de navegación" : "Abrir menú de navegación"}
            onClick={() => setOpen((current) => !current)}
          >
            <span className="relative block h-3 w-[1.15rem]" aria-hidden="true">
              <span
                className={`absolute left-0 h-0.5 w-full rounded-sm bg-[var(--color-accent)] transition ${open ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0"}`}
              />
              <span
                className={`absolute top-1/2 left-0 h-0.5 w-full -translate-y-1/2 rounded-sm bg-[var(--color-accent)] ${open ? "opacity-0" : ""}`}
              />
              <span
                className={`absolute left-0 h-0.5 w-full rounded-sm bg-[var(--color-accent)] transition ${open ? "top-1/2 -translate-y-1/2 -rotate-45" : "bottom-0"}`}
              />
            </span>
          </button>
        </div>
      </div>

      <div
        id="site-nav"
        hidden={!open}
        className={open ? "border-t border-[rgba(200,245,66,0.18)] min-[1400px]:hidden" : "hidden"}
      >
        <div className="mx-auto w-[min(100%-1.5rem,70rem)] py-3 sm:w-[min(100%-2rem,70rem)]">
          <AuthControls placement="identity" />
          <nav aria-label="Navegación móvil">
            <ul className="flex flex-col">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block border-b border-[rgba(243,247,242,0.12)] py-3 text-[1rem] font-semibold hover:text-[var(--color-accent)]"
                    onClick={closeMenu}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <AuthControls placement="actions" onNavigate={closeMenu} />
        </div>
      </div>
    </header>
  );
}
