import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto w-[min(100%-2rem,70rem)] py-16">
      <h1 className="text-[clamp(2rem,4vw,3rem)]">Página no encontrada</h1>
      <p className="mt-4 text-[var(--color-muted)]">La dirección no corresponde a una sección de Multi Sport Tournaments.</p>
      <Link
        href="/"
        className="mt-8 inline-flex min-h-[2.85rem] items-center justify-center rounded-[4px] bg-[var(--color-accent)] px-5 text-[0.9375rem] font-bold text-[var(--color-on-accent)]"
      >
        Volver al inicio
      </Link>
    </main>
  );
}
