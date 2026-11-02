/**
 * Galería y noticias. Copiar fotos a /public/fotos/ y agregarlas aquí.
 */
export type GalleryCategory = "Equipo" | "Entrenamientos" | "Competencias" | "Actividades sociales";

const comp = (src: string, alt: string) => ({ src, alt, category: "Competencias" as GalleryCategory });

/** Fotos locales (en /public/fotos). Las que se suban desde el panel se muestran primero. */
export const photos: { src: string; alt: string; category: GalleryCategory }[] = [
  comp("/fotos/ciclismo-valdivia.webp", "Deportista de Tritotal Team pedaleando frente al letrero de Valdivia"),
  comp("/fotos/meta-2.webp", "Llegada a la meta celebrando"),
  comp("/fotos/natacion-salida.webp", "Salida de natación con traje de neopreno"),
  comp("/fotos/running-1.webp", "Tramo de running en competencia"),
  comp("/fotos/ciclismo-lluvia.webp", "Ciclismo bajo la lluvia"),
  comp("/fotos/ciclismo-2.webp", "Ciclismo en bicicleta de triatlón"),
  comp("/fotos/meta-1.webp", "Celebración en la alfombra de meta"),
  comp("/fotos/running-2.webp", "Running entre el público"),
  comp("/fotos/ciclismo-3.webp", "Ciclismo en posición aerodinámica"),
  comp("/fotos/ciclismo-1.webp", "Ciclismo entre bosques"),
];
export const videos: { title: string; youtubeId: string }[] = [];
export const news: { date: string; title: string; summary: string }[] = [];

/** Fotos de la portada (columnas verticales). */
export const heroPhotos: Record<"natacion" | "ciclismo" | "running", string | null> = {
  natacion: "/fotos/natacion-salida.webp",
  ciclismo: "/fotos/ciclismo-3.webp",
  running: "/fotos/running-1.webp",
};

/** Fotos para las tarjetas y secciones de cada disciplina (formato horizontal). */
export const disciplinePhotos: Record<"natacion" | "ciclismo" | "running", { src: string; position?: string }> = {
  natacion: { src: "/fotos/natacion-salida.webp", position: "center 35%" },
  ciclismo: { src: "/fotos/ciclismo-valdivia.webp" },
  running: { src: "/fotos/running-2.webp", position: "center 30%" },
};

/** Fotos destacadas en la portada (sección "En competencia"). */
export const featuredPhotos = ["/fotos/meta-2.webp", "/fotos/ciclismo-lluvia.webp", "/fotos/running-1.webp", "/fotos/ciclismo-2.webp", "/fotos/meta-1.webp"];
