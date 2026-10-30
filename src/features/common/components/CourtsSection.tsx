const courts = [
  {
    name: "Complejo Deportivo Norte",
    description: "Tres canchas de fútbol 7 con grama sintética, iluminación LED y camerinos compartidos.",
    facts: ["Ciudad: Medellín", "Capacidad: 120 espectadores", "Superficie: sintética"],
  },
  {
    name: "Coliseo Alma Máter",
    description: "Cancha cubierta de baloncesto reglamentaria, tableros electrónicos y zona de banca para ocho equipos.",
    facts: ["Ciudad: Envigado", "Capacidad: 800 espectadores", "Superficie: madera"],
  },
  {
    name: "Cancha Arena Pacífico",
    description: "Dos cuadrantes de voleibol playa con red profesional y área de sombra para equipos.",
    facts: ["Ciudad: Buenaventura", "Capacidad: 60 espectadores", "Superficie: arena"],
  },
  {
    name: "Club Raqueta Centro",
    description: "Cuatro canchas de tenis en polvo de ladrillo, con reserva por franjas de 90 minutos.",
    facts: ["Ciudad: Bogotá", "Capacidad: 40 espectadores", "Superficie: polvo de ladrillo"],
  },
];

export function CourtsSection() {
  return (
    <section id="canchas" className="scroll-mt-20 bg-[var(--color-surface-elevated)] py-12 sm:py-16 lg:py-[4.5rem]" aria-labelledby="canchas-title">
      <div className="mx-auto w-[min(100%-1.5rem,70rem)] sm:w-[min(100%-2rem,70rem)]">
        <div className="mb-6 max-w-[46rem] sm:mb-8">
          <h2 id="canchas-title" className="mb-3 text-[1.7rem] sm:mb-4 sm:text-[clamp(1.85rem,2.4vw,2.35rem)]">
            Canchas y escenarios
          </h2>
          <p className="text-base leading-relaxed text-[var(--color-muted)] sm:text-[1.0625rem]">
            Espacios verificados para programar jornadas según deporte, superficie y disponibilidad.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
          {courts.map((court) => (
            <article key={court.name} className="rounded-[10px] border border-[var(--color-line)] border-t-[3px] border-t-[var(--color-field)] bg-[var(--color-surface)] p-5">
              <h3 className="mb-3 text-[1.35rem] break-words sm:text-[1.45rem]">{court.name}</h3>
              <p className="text-[var(--color-muted)]">{court.description}</p>
              <ul className="mt-4 grid gap-1.5 text-[0.9375rem]">
                {court.facts.map((fact) => (
                  <li key={fact} className="relative pl-4 before:absolute before:top-[0.55em] before:left-0 before:h-[0.35rem] before:w-[0.35rem] before:bg-[var(--color-field-mid)]">
                    {fact}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
