import type { Metadata } from "next";
import { Barlow_Condensed, Figtree } from "next/font/google";
import { SiteFooter } from "@/features/common/components/SiteFooter";
import { SiteHeader } from "@/features/common/components/SiteHeader";
import { themeBootScript } from "@/features/common/theme-script";
import "./globals.css";

const barlow = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-barlow",
  display: "swap",
});

const figtree = Figtree({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-figtree",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Multi Sport Tournaments",
  description:
    "Multi Sport Tournaments: plataforma para organizar torneos, conectar jugadores y reservar canchas en múltiples deportes.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${barlow.variable} ${figtree.variable} h-full`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      </head>
      <body className="min-h-full">
        <a className="skip-link" href="#inicio">
          Saltar al contenido
        </a>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
