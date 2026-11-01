/**
 * Galería y noticias. Copiar fotos a /public/fotos/ y agregarlas aquí.
 */
export type GalleryCategory = "Equipo" | "Entrenamientos" | "Competencias" | "Actividades sociales";

export const photos: { src: string; alt: string; category: GalleryCategory }[] = [];
export const videos: { title: string; youtubeId: string }[] = [];
export const news: { date: string; title: string; summary: string }[] = [];

/** Fotos de portada por disciplina (opcional). Ej: "/fotos/natacion.jpg" */
export const heroPhotos: { natacion: string | null; ciclismo: string | null; running: string | null } = {
  natacion: null,
  ciclismo: null,
  running: null,
};
