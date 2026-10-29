import Link from "next/link";

type PendingRouteProps = {
  title: string;
  description: string;
};

export function PendingRoute({ title, description }: PendingRouteProps) {
  return (
    <main className="mx-auto w-[min(100%-2rem,70rem)] py-16">
      <h1 className="max-w-[18ch] text-[clamp(2rem,4vw,3rem)]">{title}</h1>
      <p className="mt-4 max-w-[48ch] text-[var(--color-muted)]">{description}</p>
      <Link
        href="/"
        className="mt-8 inline-flex min-h-[2.85rem] items-center justify-center rounded-[4px] bg-[var(--color-accent)] px-5 text-[0.9375rem] font-bold text-[var(--color-on-accent)]"
      >
        Volver al inicio
      </Link>
    </main>
  );
}
