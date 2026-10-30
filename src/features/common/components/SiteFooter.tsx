export function SiteFooter() {
  return (
    <footer className="bg-[var(--color-footer-bg)] py-10 text-[var(--color-on-dark)] sm:py-12">
      <div className="mx-auto grid w-[min(100%-1.5rem,70rem)] gap-5 sm:w-[min(100%-2rem,70rem)] sm:gap-6">
        <div>
          <p className="font-display text-[1.2rem] leading-tight font-bold tracking-[0.04em] uppercase">
            Multi Sport Tournaments
          </p>
          <p className="mt-3 max-w-[42ch] text-[var(--color-footer-muted)]">
            Plataforma académica de torneos multideporte: organiza competencias, conecta jugadores y asigna canchas.
          </p>
        </div>
        <p className="text-[0.9375rem] text-[var(--color-footer-muted)]">Proyecto de Desarrollo Web</p>
        <p className="border-t border-[var(--color-footer-line)] pt-4 text-[0.8125rem] text-[var(--color-footer-subtle)]">
          © 2026 Multi Sport Tournaments
        </p>
      </div>
    </footer>
  );
}
