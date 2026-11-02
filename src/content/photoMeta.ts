/**
 * Tamaño real y punto de enfoque (cara o deportista) de cada foto de /public/fotos.
 * El enfoque evita que las caras queden cortadas cuando la foto se recorta.
 * Al agregar una foto nueva, sumarla aquí (x% y%: 50% 30% = centro, a un tercio desde arriba).
 */
export const photoMeta: Record<string, { w: number; h: number; focus: string }> = {
  "/fotos/ciclismo-1.webp": { w: 764, h: 1280, focus: "50% 45%" },
  "/fotos/ciclismo-2.webp": { w: 850, h: 1280, focus: "55% 28%" },
  "/fotos/ciclismo-3.webp": { w: 853, h: 1280, focus: "60% 32%" },
  "/fotos/ciclismo-4.webp": { w: 1500, h: 1000, focus: "55% 40%" },
  "/fotos/ciclismo-5.webp": { w: 1067, h: 1600, focus: "40% 48%" },
  "/fotos/ciclismo-6.webp": { w: 1067, h: 1600, focus: "55% 32%" },
  "/fotos/ciclismo-lluvia.webp": { w: 1280, h: 853, focus: "55% 50%" },
  "/fotos/ciclismo-selfie.webp": { w: 1200, h: 1600, focus: "30% 60%" },
  "/fotos/ciclismo-valdivia.webp": { w: 1280, h: 853, focus: "50% 50%" },
  "/fotos/equipo-llegada.webp": { w: 1200, h: 1600, focus: "50% 35%" },
  "/fotos/equipo-medallas.webp": { w: 960, h: 1280, focus: "45% 25%" },
  "/fotos/meta-1.webp": { w: 853, h: 1280, focus: "50% 45%" },
  "/fotos/meta-2.webp": { w: 853, h: 1280, focus: "50% 45%" },
  "/fotos/natacion-piscina-1.webp": { w: 1200, h: 1600, focus: "65% 45%" },
  "/fotos/natacion-piscina-2.webp": { w: 1200, h: 1600, focus: "50% 50%" },
  "/fotos/natacion-salida.webp": { w: 853, h: 1280, focus: "50% 40%" },
  "/fotos/podio-atriaman.webp": { w: 960, h: 1280, focus: "50% 32%" },
  "/fotos/running-1.webp": { w: 853, h: 1280, focus: "50% 28%" },
  "/fotos/running-2.webp": { w: 853, h: 1280, focus: "50% 18%" },
  "/fotos/running-montana.webp": { w: 1600, h: 1066, focus: "35% 45%" },
  "/fotos/valdivia703-arco-2.webp": { w: 1280, h: 853, focus: "65% 55%" },
  "/fotos/valdivia703-arco.webp": { w: 853, h: 1280, focus: "45% 70%" },
  "/fotos/valdivia703-carrera.webp": { w: 731, h: 1280, focus: "50% 32%" },
  "/fotos/valdivia703-ciclismo.webp": { w: 853, h: 1280, focus: "50% 32%" },
  "/fotos/valdivia703-medalla.webp": { w: 959, h: 1280, focus: "45% 32%" },
  "/fotos/valdivia703-meta.webp": { w: 853, h: 1280, focus: "45% 28%" },
};
