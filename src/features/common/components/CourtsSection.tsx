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
    <section id="canchas" className="border-y border-[var(--color-line)] bg-[var(--color-section-alt)] py-[4.5rem] max-[641px]:py-12" aria-labelledby="canchas-title">
      <div className="mx-auto w-[min(100%-2rem,70rem)]">
        <div className="mb-8 max-w-[46rem]">
          <h2 id="canchas-title" className="mb-4 text-[clamp(1.75rem,2.4vw,2.35rem)]">
            Canchas y escenarios
          </h2>
          <p className="text-[var(--color-muted)]">
            Espacios verificados para programar jornadas según deporte, superficie y disponibilidad.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-6 max-[641px]:grid-cols-1">
          {courts.map((court) => (
            <article key={court.name} className="border-t border-[var(--color-line)] py-6">
              <h3 className="mb-3 text-[1.45rem]">{court.name}</h3>
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
