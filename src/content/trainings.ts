export type Discipline = "natacion" | "ciclismo" | "running";

export const disciplines: {
  id: Discipline;
  name: string;
  tagline: string;
  focus: string[];
}[] = [
  {
    id: "natacion",
    name: "Natación",
    tagline: "Técnica, eficiencia y confianza en el agua.",
    focus: [
      "Entrenamiento técnico",
      "Desarrollo de resistencia",
      "Preparación para aguas abiertas",
      "Técnica y eficiencia de nado",
    ],
  },
  {
    id: "ciclismo",
    name: "Ciclismo",
    tagline: "Potencia sostenida para cada kilómetro.",
    focus: [
      "Entrenamiento de resistencia",
      "Trabajo de potencia",
      "Entrenamientos de intensidad",
      "Preparación para triatlón",
    ],
  },
  {
    id: "running",
    name: "Running",
    tagline: "Ritmo, umbral y cabeza fría para cerrar fuerte.",
    focus: [
      "Desarrollo aeróbico",
      "Entrenamiento de velocidad",
      "Trabajo de umbral",
      "Preparación para 10K, 21K y 42K",
    ],
  },
];

export const programs = [
  {
    name: "Triatlón",
    detail: "Integración de las tres disciplinas, transiciones y estrategia de carrera.",
  },
  {
    name: "Ironman 70.3",
    detail: "1,9 km nado · 90 km bici · 21,1 km trote. Preparación específica de media distancia.",
  },
  {
    name: "Full Ironman",
    detail: "3,8 km nado · 180 km bici · 42,2 km trote. Planificación de largo plazo para la distancia completa.",
  },
  {
    name: "Competencias de running",
    detail: "Planes orientados a 10K, media maratón y maratón.",
  },
];
