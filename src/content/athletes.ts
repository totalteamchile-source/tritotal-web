import type { DeportistaPublico } from "@/lib/data";

/**
 * Deportistas que se muestran en «Nuestros deportistas» mientras la base de datos
 * no tenga ninguno marcado como público. Solo con autorización de cada deportista.
 */
export const athletes: DeportistaPublico[] = [
  {
    id: "arnaldo-caniullan",
    nombre: "Arnaldo Caniullan",
    especialidad: "Triatleta – Tritotal Team | Maipú",
    desde: 2020,
    historia: "Arnaldo Caniullan forma parte de Tritotal Team desde el año 2020. Durante su trayectoria ha desarrollado una importante experiencia en el triatlón de media distancia, enfrentando desafíos que exigen preparación, disciplina y perseverancia.\n\nEntre sus principales participaciones destacan dos ediciones del Ironman 70.3 de Pucón y una participación en el Ironman 70.3 de Valdivia, además de otras competencias deportivas.\n\nSu compromiso con el entrenamiento y la constancia representan los valores que buscamos promover en nuestra familia deportiva.",
    logros: ["2020: Incorporación a Tritotal Team.", "Ironman 70.3 Pucón: 2 participaciones.", "Ironman 70.3 Valdivia: 1 participación.", "Otras competencias de triatlón."],
    distancia: "70.3 (1,9 km natación, 90 km ciclismo y 21,1 km running)",
    foto_url: "/fotos/valdivia703-carrera.webp",
  },
  {
    id: "maximiliano-aranis",
    nombre: "Maximiliano Aranis",
    especialidad: "Triatleta y maratonista – Tritotal Team",
    historia: `Maximiliano Aranis ya tiene dos triatlones en el cuerpo, ambos en Piedra Roja, y debuta en la media distancia en el Ironman 70.3 de Valdivia.

Además es corredor de varias maratones de Santiago y Viña del Mar.`,
    logros: ["Triatlón Piedra Roja: 2 participaciones.", "Ironman 70.3 Valdivia: debut en media distancia.", "Maratones de Santiago y Viña del Mar."],
    foto_url: "/fotos/running-320.webp",
  },
  {
    id: "claudio-castro",
    nombre: "Claudio Castro",
    especialidad: "Ciclista – Tritotal Team",
    desde: 2026,
    historia: `Claudio Castro es un ciclista experimentado que este 2026 comenzó sus entrenamientos con Tritotal Team.

Su objetivo: finalizar la carrera más linda del mundo, el Ironman 70.3 de Pucón.`,
    logros: ["2026: Incorporación a Tritotal Team.", "Objetivo: Ironman 70.3 Pucón."],
    foto_url: "/fotos/ciclismo-claudio-castro.webp",
  },
];
