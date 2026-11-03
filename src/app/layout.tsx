import type { Metadata, Viewport } from "next";
import { Barlow, Barlow_Condensed } from "next/font/google";
import "./globals.css";
import { site } from "@/config/site";
import { Analytics } from "@vercel/analytics/next";

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-barlow",
  display: "swap",
});
const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-barlow-condensed",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} | Triatlón y entrenamiento de resistencia`, template: `%s | ${site.name}` },
  description: site.description,
  keywords: ["triatlón", "Ironman 70.3", "Full Ironman", "natación", "ciclismo", "running", "entrenamiento", "Chile"],
  openGraph: {
    type: "website",
    locale: site.locale,
    siteName: site.name,
    title: site.name,
    description: site.description,
  },
};

export const viewport: Viewport = { themeColor: "#05090b" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-CL" className={`${barlow.variable} ${barlowCondensed.variable}`}>
      <body>
        {children}
        {/* Conteo de visitas anónimo (Vercel Web Analytics, sin cookies) */}
        <Analytics />
      </body>
    </html>
  );
}
