const pillars = [
  {
    title: "Torneos",
    text: "Publica competencias con deporte, formato, fechas y cupos claros para que cualquiera entienda cómo participar.",
  },
  {
    title: "Jugadores",
    text: "Centraliza perfiles, disponibilidad y deportes preferidos para armar equipos o inscripciones sin fricción.",
  },
  {
    title: "Canchas",
    text: "Consulta escenarios disponibles, superficie y capacidad para asignar sedes reales a cada jornada.",
  },
];

export function PlatformSection() {
  return (
    <section id="plataforma" className="scroll-mt-20 border-y border-[var(--color-line)] bg-[var(--color-surface-elevated)] py-12 sm:py-16 lg:py-[4.5rem]" aria-labelledby="intro-title">
      <div className="mx-auto w-[min(100%-1.5rem,70rem)] sm:w-[min(100%-2rem,70rem)]">
        <h2 id="intro-title" className="mb-3 max-w-[20ch] text-[1.7rem] sm:mb-4 sm:text-[clamp(1.85rem,2.4vw,2.35rem)]">
          Una plataforma multideporte, no un club de un solo juego
        </h2>
        <p className="max-w-[62ch] text-base leading-relaxed text-[var(--color-muted)] sm:text-[1.0625rem]">
          Multi Sport Tournaments nace para resolver la desorganización típica de las competencias amateur y universitarias: torneos anunciados en redes, listas de jugadores en hojas sueltas y canchas confirmadas a última hora.
        </p>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {pillars.map((pillar) => (
            <article key={pillar.title} className="rounded-[10px] border border-[var(--color-line)] border-t-[3px] border-t-[var(--color-accent)] p-5">
              <h3 className="mb-3 text-[1.35rem] sm:text-[1.45rem]">{pillar.title}</h3>
              <p className="text-[var(--color-muted)]">{pillar.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
