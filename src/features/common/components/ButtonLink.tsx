import Link from "next/link";

type ButtonLinkProps = {
  href: string;
  variant: "primary" | "ghost";
  children: string;
};

export function ButtonLink({ href, variant, children }: ButtonLinkProps) {
  const shared =
    "inline-flex min-h-[2.85rem] w-full items-center justify-center rounded-[4px] px-5 text-[0.9375rem] font-bold tracking-[0.02em] transition duration-150 hover:-translate-y-px focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transform-none sm:w-auto";

  const variantClass =
    variant === "primary"
      ? "bg-[var(--color-accent)] text-[var(--color-on-accent)] hover:bg-[var(--color-accent-strong)] focus-visible:outline-[var(--color-on-dark)]"
      : "border border-[rgba(243,247,242,0.45)] text-[var(--color-on-dark)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] focus-visible:outline-[var(--color-accent)]";

  return (
    <Link href={href} className={`${shared} ${variantClass}`}>
      {children}
    </Link>
  );
}
