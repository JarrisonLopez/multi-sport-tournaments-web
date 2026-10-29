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
    <section id="jugadores" className="bg-[var(--color-surface-elevated)] py-[4.5rem] max-[641px]:py-12" aria-labelledby="jugadores-title">
      <div className="mx-auto w-[min(100%-2rem,70rem)]">
        <div className="mb-8 max-w-[46rem]">
          <h2 id="jugadores-title" className="mb-4 text-[clamp(1.75rem,2.4vw,2.35rem)]">
            Jugadores destacados
          </h2>
          <p className="text-[var(--color-muted)]">
            Participantes activos en la plataforma, listos para inscribirse o completar plantillas.
          </p>
        </div>
        <div className="grid grid-cols-4 gap-6 max-[901px]:grid-cols-2 max-[641px]:grid-cols-1">
          {players.map((player) => (
            <article key={player.name} className="border-t-[3px] border-[var(--color-field)] pt-4">
              <h3 className="mb-3 text-[1.45rem]">{player.name}</h3>
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
