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
          <section className="scroll-mt-20 py-12 sm:py-16" aria-labelledby="torneos-title">
            <div className="mx-auto w-[min(100%-1.5rem,70rem)] sm:w-[min(100%-2rem,70rem)]">
              <h2 id="torneos-title" className="mb-3 text-[1.7rem] sm:mb-4 sm:text-[clamp(1.85rem,2.4vw,2.35rem)]">
                Torneos activos
              </h2>
              <p className="font-semibold">Cargando torneos…</p>
            </div>
          </section>
        }
      >
        <CatalogoProvider>
          <TorneosSection />
          <InscripcionSection />
          <CourtsSection />
          <PlayersSection />
        </CatalogoProvider>
      </Suspense>
    </main>
  );
}
