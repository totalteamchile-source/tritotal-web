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
export const competitions: Competition[] = [];
export const results: Result[] = [];
