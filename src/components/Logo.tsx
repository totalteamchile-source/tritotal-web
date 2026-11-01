import Image from "next/image";
import { site } from "@/config/site";

/**
 * Muestra el logotipo oficial sin deformarlo (se respeta su proporción original).
 * Mientras no se carguen los archivos, se muestra un espacio marcado como "LOGO".
 */
export function Logo({
  variant = "secundario",
  height = 36,
  className = "",
}: {
  variant?: "principal" | "secundario";
  height?: number;
  className?: string;
}) {
  const logo = site.logos[variant];
  if (logo) {
    const width = Math.round((logo.width / logo.height) * height);
    return (
      <Image
        src={logo.src}
        alt={variant === "principal" ? "Tri Total Team" : "Tri Total"}
        width={width}
        height={height}
        priority
        className={className}
        style={{ height, width: "auto" }}
      />
    );
  }
  return (
    <span
      className={`inline-flex items-center gap-2 rounded border border-dashed border-white/40 px-3 font-display font-bold uppercase tracking-[0.18em] text-white ${className}`}
      style={{ height }}
      title="Espacio para el logotipo oficial"
    >
      <span className="text-[0.6em] text-sport">Logo</span>
      <span className="text-[0.75em]">{variant === "principal" ? "Tri Total Team" : "Tri Total"}</span>
    </span>
  );
}
