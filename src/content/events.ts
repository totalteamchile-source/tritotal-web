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
};

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
export const results: Result[] = [];
