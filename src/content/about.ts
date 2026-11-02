/**
 * Contenido de "Nosotros". Todo marcado `null` queda como espacio editable
 * y se muestra en el sitio como "Contenido pendiente".
 * No se inventan nombres, antecedentes ni certificaciones.
 */
export const about = {
  /** Frase bajo el título de la página. */
  tagline: "Desde 2017 – Más que un equipo, somos una familia." as string | null,
  history: `Tritotal Team nace en el año 2017 en la comuna de Maipú, como un proyecto de entrenamiento de triatlón impulsado por Iván Arraño Peña, con el propósito de crear un espacio deportivo donde las personas pudieran desarrollar sus capacidades, descubrir su potencial y alcanzar nuevos desafíos a través de la natación, el ciclismo y el running.

Somos un equipo de triatlón de Maipú, orgullosos de nuestras raíces y comprometidos con el desarrollo deportivo de nuestra comunidad. Desde nuestros comienzos, hemos entendido que el triatlón es mucho más que una disciplina deportiva: es una forma de vida que requiere compromiso, constancia, disciplina y una permanente búsqueda de superación personal.` as string | null,
  mission:
    "Promover el desarrollo deportivo y personal a través del triatlón, ofreciendo entrenamiento y acompañamiento a personas de todos los niveles, fomentando hábitos saludables, disciplina, superación y trabajo en equipo." as string | null,
  vision:
    "Ser un equipo de triatlón referente en Maipú y la Región Metropolitana, reconocido por su comunidad, formación deportiva y desarrollo de deportistas, generando oportunidades para que cada persona pueda alcanzar sus objetivos y vivir la experiencia del triatlón." as string | null,
  philosophy:
    "Nuestra filosofía se basa en que todas las personas pueden formar parte de este desafío, independiente de su experiencia o nivel deportivo. Acompañamos tanto a quienes dan sus primeros pasos en el triatlón como a deportistas que buscan nuevos objetivos competitivos, desde sus primeras competencias hasta desafíos de larga distancia como el Ironman 70.3 y el Full Ironman." as string | null,
  values: [
    { name: "Familia", text: "Construimos una comunidad donde todos son importantes." },
    { name: "Disciplina", text: "Trabajamos con compromiso y constancia." },
    { name: "Superación", text: "Buscamos ser mejores cada día." },
    { name: "Compañerismo", text: "Avanzamos juntos, apoyándonos en cada desafío." },
  ] as { name: string; text: string }[],
  community: `A lo largo de nuestra trayectoria, hemos construido una comunidad donde el compañerismo, el apoyo mutuo y el sentido de pertenencia son tan importantes como los resultados deportivos. Creemos que cada integrante tiene una historia, un desafío y una meta propia, pero todos compartimos una misma pasión: el triatlón.

Hoy seguimos creciendo con la misma convicción que nos dio origen: formar personas a través del deporte, representar con orgullo a Maipú, construir una familia deportiva y demostrar que los grandes objetivos se alcanzan con trabajo, perseverancia y pasión.

Somos Tritotal Team. Somos Maipú. Somos una familia unida por el deporte, la disciplina y las ganas de superar nuestros propios límites.` as string | null,
  /** Cierre de la página. */
  closing: { title: "Una familia. Tres disciplinas. Infinitas metas.", text: "Desde Maipú, desde 2017, compartiendo la pasión por el triatlón." },
  coaches: [] as {
    name: string;
    role: string;
    bio?: string;
    photo?: string; // ruta en /public/fotos/
  }[],
};
