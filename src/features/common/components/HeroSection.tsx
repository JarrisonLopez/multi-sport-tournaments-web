import { ButtonLink } from "@/features/common/components/ButtonLink";

export function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden text-[var(--color-on-dark)] lg:min-h-[32rem]" aria-labelledby="hero-title">
      <div className="hero-backdrop absolute inset-0 -z-10" aria-hidden="true" />
      <div className="hero-content mx-auto w-[min(100%-1.5rem,70rem)] py-8 sm:w-[min(100%-2rem,70rem)] sm:py-14 lg:py-20">
        <p className="mb-2 font-display text-[0.8125rem] font-extrabold tracking-[0.14em] text-[var(--color-accent)] uppercase sm:mb-4 sm:text-[clamp(1.15rem,2vw,1.5rem)] sm:tracking-[0.08em]">
          Multi Sport Tournaments
        </p>
        <h1 id="hero-title" className="mb-3 max-w-[18ch] text-[1.85rem] leading-[1.08] sm:mb-5 sm:max-w-[14ch] sm:text-[clamp(2.35rem,4.6vw,4rem)]">
          Torneos, jugadores y canchas en un solo lugar
        </h1>
        <p className="mb-6 max-w-[38ch] text-base leading-snug text-[rgba(243,247,242,0.88)] sm:mb-8 sm:text-lg">
          Coordina competencias de cualquier deporte, encuentra rivales y ubica la cancha sin chats dispersos.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
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
