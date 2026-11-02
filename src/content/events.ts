/**
 * Calendario de entrenamientos, competencias y resultados.
 * Vacío hasta que el equipo publique información real.
 * En la Etapa 5 se administrará desde el panel privado.
 */
export type ScheduleItem = {
  day: "Lunes" | "Martes" | "Miércoles" | "Jueves" | "Viernes" | "Sábado" | "Domingo";
  time: string; // "06:30"
  discipline: "Natación" | "Ciclismo" | "Running" | "Especial" | "Actividad";
  title: string;
  place?: string;
};

export type Competition = {
  date: string; // ISO "2027-03-14"
  name: string;
  place: string;
  distance?: string;
  athletes?: string[];
  endDate?: string; // si dura más de un día
  url?: string; // sitio oficial o de inscripción
  type?: CompetitionType;
};

export const competitionTypes = ["Triatlón", "Running"] as const;
export type CompetitionType = (typeof competitionTypes)[number];

export type Result = {
  competition: string;
  date: string;
  athlete: string;
  category?: string;
  time?: string;
  position?: string;
  note?: string;
};

export const weeklySchedule: ScheduleItem[] = [];
/**
 * Calendario de triatlón en Chile, tomado del calendario nacional de trichile.cl
 * (consultado el 2 de noviembre de 2026). Las fechas pueden cambiar: confirmar
 * siempre en el sitio oficial de cada carrera. Con la base de datos activa se
 * administra desde el panel (la migración 0005 carga esta misma lista).
 */
export const competitions: Competition[] = [
  { date: "2026-11-07", endDate: "2026-11-08", name: "Copa del Mundo de Triatlón Iquique", place: "Iquique", distance: "Federada", url: "https://fechitri.cl/" },
  { date: "2026-11-21", endDate: "2026-11-22", name: "Topman Rapel", place: "Rapel", distance: "Sprint y Kids", url: "https://www.triatletas.cl/topman-rapel-2026/" },
  { date: "2026-11-29", name: "Ironman e Ironman 70.3 Valdivia", place: "Valdivia", distance: "140.6 y 70.3", url: "https://www.trichile.cl/calendario_nacional" },
  { date: "2026-12-06", name: "Triatlón Parque de la Familia", place: "Lugar por confirmar", distance: "Sprint", url: "https://www.hlsport.cl/triatlon-parque-de-la-familia-2026/" },
  { date: "2026-12-06", name: "Patagonman", place: "Patagonia", distance: "Ironman extremo", url: "https://www.patagonman.com/es/enrollment" },
  { date: "2026-12-12", name: "Triatlón Viña del Mar", place: "Viña del Mar", distance: "Sprint y Kids · Federada", url: "https://triatlonchile.cl/" },
  { date: "2026-12-13", name: "TriSeries Frutillar", place: "Frutillar", distance: "Olímpico, Sprint y Súper Sprint", url: "https://welcu.com/chile-finisher/triseries2026" },
  { date: "2026-12-19", name: "Tri Zapallar", place: "Zapallar", distance: "Olímpico", url: "https://www.trichile.cl/calendario_nacional" },
  { date: "2027-01-07", name: "Carozzi Kids Challenge", place: "Pucón", distance: "Kids · Federada", url: "https://www.passline.com/eventos/carozzi-kids-challenge-pucon-2027" },
  { date: "2027-01-08", name: "Carozzi Sprint Race", place: "Pucón", distance: "Sprint · Federada", url: "https://www.passline.com/eventos/carozzi-sprint-race-pucon-2027" },
  { date: "2027-01-08", name: "Carozzi Promotional Race", place: "Pucón", distance: "Súper Sprint", url: "https://www.passline.com/eventos/carozzi-promotional-race-pucon-2027" },
  { date: "2027-01-10", name: "Itaú Ironman 70.3 Pucón", place: "Pucón, Araucanía", distance: "1,9 km · 90 km · 21,1 km", url: "https://www.ironman.com/im703-pucon" },
  { date: "2027-01-20", endDate: "2027-01-21", name: "Triatlón Caburgua", place: "Lago Caburgua, Pucón", distance: "Kids, Promocional, Sprint y Olímpico", url: "https://my.raceresult.com/409403/registration" },
];

/**
 * Carreras de running en Santiago y la Región Metropolitana, tomadas de
 * corre.cl/calendario (consultado el 2 de noviembre de 2026).
 */
const runningRaces: Competition[] = [
  { date: "2026-11-07", name: "Trail Altas Cumbres", place: "Puente Alto", distance: "4, 7, 14 y 21 km · trail", url: "https://corre.cl/evento/11944", type: "Running" },
  { date: "2026-11-07", name: "Corrida por la Inclusión", place: "La Granja", distance: "500 m, 1, 3 y 5 km", url: "https://corre.cl/evento/12239", type: "Running" },
  { date: "2026-11-07", name: "Wanderlust Come Together", place: "Las Condes", distance: "5 km", url: "https://corre.cl/evento/12257", type: "Running" },
  { date: "2026-11-08", name: "Corrida Soy Más Fit La Pintana", place: "La Pintana", distance: "3 y 10 km", url: "https://corre.cl/evento/11936", type: "Running" },
  { date: "2026-11-08", name: "The Color Run Santiago", place: "Huechuraba", distance: "5 km", url: "https://corre.cl/evento/12179", type: "Running" },
  { date: "2026-11-08", name: "Corrida 184 Años de la Universidad de Chile", place: "Santiago Centro", distance: "5 y 10 km", url: "https://corre.cl/evento/12216", type: "Running" },
  { date: "2026-11-08", name: "Legal Run", place: "Pudahuel", distance: "5 y 10 km", url: "https://corre.cl/evento/12288", type: "Running" },
  { date: "2026-11-08", name: "Corrida Familiar Recoleta", place: "Recoleta", distance: "2 y 7 km", url: "https://corre.cl/evento/12326", type: "Running" },
  { date: "2026-11-15", name: "FEDACHI Marathon", place: "Ñuñoa", distance: "5, 10, 21 y 42 km", url: "https://corre.cl/evento/12009", type: "Running" },
  { date: "2026-11-15", name: "Corrida MagiK por los Niños con Cáncer", place: "Providencia", distance: "2 y 5 km", url: "https://corre.cl/evento/12225", type: "Running" },
  { date: "2026-11-15", name: "Corrida Solidaria Duoc UC San Bernardo", place: "San Bernardo", distance: "2, 3,5 y 7 km", url: "https://corre.cl/evento/12245", type: "Running" },
  { date: "2026-11-15", name: "Gran Corrida Pudahuel Más Convivencia", place: "Pudahuel", distance: "3 y 5 km", url: "https://corre.cl/evento/12305", type: "Running" },
  { date: "2026-11-21", name: "Alhué Trail Run", place: "Alhué", distance: "3, 7, 12 y 21 km · trail", url: "https://corre.cl/evento/11667", type: "Running" },
  { date: "2026-11-22", name: "Corrida TECHO-Chile Santiago Centro", place: "Santiago Centro", distance: "2, 5 y 10 km", url: "https://corre.cl/evento/11992", type: "Running" },
  { date: "2026-11-22", name: "Chena Trail Naturaleza y Patrimonio", place: "San Bernardo", distance: "5, 13 y 21 km · trail", url: "https://corre.cl/evento/12254", type: "Running" },
  { date: "2026-11-28", name: "La Gran Travesía", place: "San José de Maipo", distance: "55 y 100 km · trail", url: "https://corre.cl/evento/11541", type: "Running" },
  { date: "2026-11-28", name: "Ñuñoa 10K Nocturna", place: "Ñuñoa", distance: "3, 5 y 10 km", url: "https://corre.cl/evento/12237", type: "Running" },
  { date: "2026-11-28", name: "Kms por tu Sonrisa, Corrida contra el Cáncer Oral", place: "Las Condes", distance: "2 y 5 km", url: "https://corre.cl/evento/12328", type: "Running" },
  { date: "2026-11-29", name: "Maratón de Melipilla", place: "Melipilla", distance: "5, 10, 21 y 42 km", url: "https://corre.cl/evento/12314", type: "Running" },
  { date: "2026-11-29", name: "Corrida Familiar Lo Prado", place: "Lo Prado", url: "https://corre.cl/evento/12330", type: "Running" },
  { date: "2026-12-06", name: "Corrida Gana Santiago", place: "Santiago Centro", distance: "5, 10 y 21 km", url: "https://corre.cl/evento/12069", type: "Running" },
  { date: "2026-12-06", name: "Corrida Solidaria Duoc UC Plaza Norte", place: "Huechuraba", distance: "2, 4 y 8 km", url: "https://corre.cl/evento/12246", type: "Running" },
  { date: "2026-12-06", name: "Running Festival by Salcobrand", place: "La Reina", distance: "2,5 km", url: "https://corre.cl/evento/12334", type: "Running" },
  { date: "2026-12-06", name: "Corrida Atlética Aniversario de Gendarmería", place: "Melipilla", distance: "4,5 km", url: "https://corre.cl/evento/12198", type: "Running" },
  { date: "2026-12-13", name: "Smart Fit Run", place: "Ñuñoa", distance: "3, 5 y 10 km", url: "https://corre.cl/evento/12227", type: "Running" },
  { date: "2026-12-13", name: "Corrida Santiago CCS", place: "Santiago Centro", distance: "5 y 15 km", url: "https://corre.cl/evento/12238", type: "Running" },
  { date: "2026-12-20", name: "Desafío Trail Running ParqueMet", place: "Providencia", distance: "5, 10 y 23 km · trail", url: "https://corre.cl/evento/11777", type: "Running" },
  { date: "2026-12-31", name: "Corrida San Silvestre Pomaire", place: "Melipilla", distance: "8,5 km", url: "https://corre.cl/evento/11898", type: "Running" },
  { date: "2027-01-17", name: "Barbie Run Santiago Centro", place: "Santiago Centro", distance: "2 y 5 km", url: "https://corre.cl/evento/12286", type: "Running" },
  { date: "2027-03-06", name: "Merrell Andes Mountain Sky Race", place: "Lo Barnechea", distance: "2, 10, 18 y 36 km · trail", url: "https://corre.cl/evento/12274", type: "Running" },
  { date: "2027-03-14", name: "Corrida de Peñalolén", place: "Peñalolén", distance: "6, 10 y 15 km", url: "https://corre.cl/evento/12212", type: "Running" },
  { date: "2027-04-04", name: "STGO21K by Asics", place: "Ñuñoa", distance: "10 y 21 km", url: "https://corre.cl/evento/12279", type: "Running" },
  { date: "2027-04-11", name: "Desafío Trail Running", place: "Providencia", distance: "5, 10 y 23 km · trail", url: "https://corre.cl/evento/12272", type: "Running" },
  { date: "2027-04-18", name: "Corrida Carabineros de Chile 100 Años", place: "Providencia", distance: "5, 10 y 21 km", url: "https://corre.cl/evento/12332", type: "Running" },
  { date: "2027-04-25", name: "Control 30K by Asics-Garmin", place: "Melipilla", distance: "5, 10, 21 y 30 km", url: "https://corre.cl/evento/12345", type: "Running" },
  { date: "2027-05-02", name: "Corramos Juntas, Cáncer de Mamas", place: "Puente Alto", url: "https://corre.cl/evento/12264", type: "Running" },
  { date: "2027-05-16", name: "Maratón de Santiago", place: "Santiago Centro", distance: "10, 21 y 42 km", url: "https://corre.cl/evento/12046", type: "Running" },
  { date: "2027-05-29", name: "Santiago Trail Race", place: "Las Condes", distance: "3, 12, 21 y 30 km · trail", url: "https://corre.cl/evento/12275", type: "Running" },
  { date: "2027-08-29", name: "Itaú Medio Maratón de Santiago (mujeres)", place: "Santiago", distance: "7 y 21 km", url: "https://corre.cl/evento/12235", type: "Running" },
  { date: "2027-08-29", name: "STGO21K by Asics Santiago", place: "Santiago", distance: "10 y 21 km", url: "https://corre.cl/evento/12280", type: "Running" },
  { date: "2027-10-17", name: "Corramos Juntas, Cáncer de Mamas", place: "La Reina", url: "https://corre.cl/evento/12265", type: "Running" },
  { date: "2027-11-13", name: "Desafío Trail Running Santa Martina Sunset", place: "Lo Barnechea", distance: "5, 13 y 25 km · trail", url: "https://corre.cl/evento/12271", type: "Running" },
  { date: "2027-12-19", name: "Desafío Trail Running", place: "Providencia", distance: "5, 10 y 23 km · trail", url: "https://corre.cl/evento/12273", type: "Running" },
];

competitions.push(...runningRaces);
export const results: Result[] = [];
