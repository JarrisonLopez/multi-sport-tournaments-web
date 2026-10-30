const players = [
  {
    name: "Valentina Ríos",
    meta: "Voleibol · Exterior · Buenaventura",
    text: "Busca equipo para el Open de Arena Costa. Disponibilidad fines de semana.",
  },
  {
    name: "Andrés Molina",
    meta: "Fútbol 7 · Mediocampista · Medellín",
    text: "Capitán en la Copa Metropolitana Indoor. Organiza amistosos entre jornadas.",
  },
  {
    name: "Camila Ortega",
    meta: "Baloncesto · Base · Envigado",
    text: "Juega la Liga Universitaria 3x3 y ofrece cupos para partidos de práctica.",
  },
  {
    name: "Diego Pardo",
    meta: "Tenis · Individual · Bogotá",
    text: "Inscrito en el Challenger Ciudad. Ranking interno provisional: 6.",
  },
];

export function PlayersSection() {
  return (
    <section id="jugadores" className="scroll-mt-20 py-12 sm:py-16 lg:py-[4.5rem]" aria-labelledby="jugadores-title">
      <div className="mx-auto w-[min(100%-1.5rem,70rem)] sm:w-[min(100%-2rem,70rem)]">
        <div className="mb-6 max-w-[46rem] sm:mb-8">
          <h2 id="jugadores-title" className="mb-3 text-[1.7rem] sm:mb-4 sm:text-[clamp(1.85rem,2.4vw,2.35rem)]">
            Jugadores destacados
          </h2>
          <p className="text-base leading-relaxed text-[var(--color-muted)] sm:text-[1.0625rem]">
            Participantes activos en la plataforma, listos para inscribirse o completar plantillas.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4">
          {players.map((player) => (
            <article key={player.name} className="rounded-[10px] border border-[var(--color-line)] border-t-[3px] border-t-[var(--color-field)] bg-[var(--color-surface-elevated)] p-5">
              <h3 className="mb-3 text-[1.35rem] break-words sm:text-[1.45rem]">{player.name}</h3>
              <p className="mb-3 text-[0.8125rem] font-bold tracking-[0.06em] text-[var(--color-field-mid)] uppercase">
                {player.meta}
              </p>
              <p className="text-[var(--color-muted)]">{player.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
