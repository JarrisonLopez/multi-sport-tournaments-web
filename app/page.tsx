import { Suspense } from "react";
import { CourtsSection } from "@/features/common/components/CourtsSection";
import { HeroSection } from "@/features/common/components/HeroSection";
import { PlatformSection } from "@/features/common/components/PlatformSection";
import { PlayersSection } from "@/features/common/components/PlayersSection";
import { InscripcionSection } from "@/features/inscripciones/components/InscripcionSection";
import { CatalogoProvider, TorneosSection } from "@/features/torneos/components/TorneosSection";

export default function HomePage() {
  return (
    <main id="inicio">
      <HeroSection />
      <PlatformSection />
      <Suspense
        fallback={
          <section className="py-[4.5rem]" aria-labelledby="torneos-title">
            <div className="mx-auto w-[min(100%-2rem,70rem)]">
              <h2 id="torneos-title" className="mb-4 text-[clamp(1.75rem,2.4vw,2.35rem)]">
                Torneos activos
              </h2>
              <p className="font-semibold">Cargando torneos…</p>
            </div>
          </section>
        }
      >
        <CatalogoProvider>
          <TorneosSection />
          <CourtsSection />
          <PlayersSection />
          <InscripcionSection />
        </CatalogoProvider>
      </Suspense>
    </main>
  );
}
