/**
 * Auspiciadores. Vacío hasta que el equipo confirme marcas y logos.
 * Con la base de datos activa se administran en el panel → Auspiciadores.
 * La sección de la portada solo aparece cuando hay al menos uno.
 */
export type Sponsor = { name: string; logo: string | null; url?: string | null };

export const sponsors: Sponsor[] = [
  { name: "Gimnasio Aerópolis – Templo del Deporte", logo: "/auspiciadores/aeropolis-blanco.png", url: "https://www.gimnasioaeropolis.cl" },
];
