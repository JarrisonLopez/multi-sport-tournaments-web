import { ButtonLink } from "@/features/common/components/ButtonLink";

export function HeroSection() {
  return (
    <section className="relative isolate grid min-h-[calc(100vh-4.25rem)] items-end overflow-hidden text-[var(--color-on-dark)] max-[901px]:min-h-[calc(90vh-4.25rem)] max-[641px]:min-h-0" aria-labelledby="hero-title">
      <div className="hero-backdrop absolute inset-0 -z-10 scale-[1.02]" aria-hidden="true" />
      <div className="hero-content mx-auto w-[min(100%-2rem,70rem)] py-[6.5rem] pb-[4.5rem] max-[641px]:pt-[4.5rem] max-[641px]:pb-12">
        <p className="mb-4 font-display text-[clamp(1.6rem,3.2vw,2.4rem)] font-extrabold tracking-[0.06em] text-[var(--color-accent)] uppercase">
          Multi Sport Tournaments
        </p>
        <h1 id="hero-title" className="mb-6 max-w-[14ch] text-[clamp(2.6rem,6vw,4.6rem)] max-[901px]:max-w-[16ch]">
          Torneos, jugadores y canchas en un solo lugar
        </h1>
        <p className="mb-8 max-w-[38ch] text-[1.25rem] text-[rgba(243,247,242,0.88)] max-[901px]:max-w-[42ch] max-[641px]:max-w-none">
          Coordina competencias de cualquier deporte, encuentra rivales y ubica el escenario adecuado sin depender de chats dispersos.
        </p>
        <div className="flex flex-wrap gap-4 max-[641px]:w-full max-[641px]:flex-col">
          <ButtonLink href="/#torneos" variant="primary">
            Ver torneos
          </ButtonLink>
          <ButtonLink href="/#plataforma" variant="ghost">
            Cómo funciona
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
