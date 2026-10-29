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
    <section id="plataforma" className="border-y border-[var(--color-line)] bg-[var(--color-surface-elevated)] py-[4.5rem] max-[641px]:py-12" aria-labelledby="intro-title">
      <div className="mx-auto w-[min(100%-2rem,70rem)]">
        <h2 id="intro-title" className="mb-4 max-w-[18ch] text-[clamp(1.75rem,2.4vw,2.35rem)]">
          Una plataforma multideporte, no un club de un solo juego
        </h2>
        <p className="max-w-[62ch] text-[var(--color-muted)]">
          Multi Sport Tournaments nace para resolver la desorganización típica de las competencias amateur y universitarias: torneos anunciados en redes, listas de jugadores en hojas sueltas y canchas confirmadas a última hora.
        </p>
        <div className="mt-12 grid grid-cols-3 gap-6 max-[901px]:grid-cols-2 max-[641px]:grid-cols-1">
          {pillars.map((pillar) => (
            <article key={pillar.title} className="border-t-[3px] border-[var(--color-accent)] pt-4">
              <h3 className="mb-3 text-[1.45rem]">{pillar.title}</h3>
              <p className="text-[var(--color-muted)]">{pillar.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
