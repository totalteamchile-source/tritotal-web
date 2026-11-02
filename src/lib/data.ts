import "server-only";
import { supabaseAdmin } from "@/lib/server/supabase";
import { site } from "@/config/site";
import type { Producto } from "@/lib/shop";
import { plans as localPlans, type Plan } from "@/content/plans";
import { weeklySchedule, competitions as localComps, results as localResults, type ScheduleItem, type Competition, type Result } from "@/content/events";
import { about as localAbout } from "@/content/about";
import { photos as localPhotos, videos as localVideos, news as localNews, type GalleryCategory } from "@/content/gallery";

/**
 * Capa de datos del sitio público.
 * Si Supabase está configurado (y las tablas existen), lee lo que se edita en el panel.
 * Si no, usa los archivos de src/content como respaldo.
 */
async function fromDb<T>(fn: (db: NonNullable<ReturnType<typeof supabaseAdmin>>) => Promise<T>, fallback: T): Promise<T> {
  const db = supabaseAdmin();
  if (!db) return fallback;
  try {
    return await fn(db);
  } catch (e) {
    console.error("[data]", (e as Error).message);
    return fallback;
  }
}

function must<T>(r: { data: T | null; error: { message: string } | null }): T {
  if (r.error) throw new Error(r.error.message);
  return r.data as T;
}

export const getPlans = () =>
  fromDb<Plan[]>(async (db) => {
    const rows = must(await db.from("planes").select("*").eq("activo", true).order("orden").order("creado_en"));
    return rows.map((p) => ({
      id: p.id,
      name: p.nombre,
      description: p.descripcion ?? "",
      disciplines: p.disciplinas ?? [],
      frequency: p.frecuencia,
      benefits: p.beneficios ?? [],
      price: p.precio,
      billing: p.modalidad,
      highlighted: p.destacado,
    }));
  }, localPlans);

export const getSchedule = () =>
  fromDb<ScheduleItem[]>(async (db) => {
    const rows = must(await db.from("horarios").select("*").order("hora"));
    return rows.map((h) => ({ day: h.dia, time: h.hora, discipline: h.disciplina, title: h.titulo, place: h.lugar ?? undefined }));
  }, weeklySchedule);

export const getCompetitions = () =>
  fromDb<Competition[]>(async (db) => {
    const rows = must(await db.from("competencias").select("*").order("fecha"));
    return rows.map((c) => ({ date: c.fecha, name: c.nombre, place: c.lugar, distance: c.distancia ?? undefined, endDate: c.fecha_fin ?? undefined, type: c.tipo === "Running" ? "Running" : "Triatlón", url: /^https?:\/\//i.test(c.enlace ?? "") ? c.enlace : undefined }));
  }, localComps);

export const getResults = () =>
  fromDb<Result[]>(async (db) => {
    const rows = must(await db.from("resultados").select("*").order("fecha", { ascending: false }).limit(200));
    return rows.map((r) => ({
      competition: r.competencia,
      date: r.fecha,
      athlete: r.deportista,
      category: r.categoria ?? undefined,
      time: r.tiempo ?? undefined,
      position: r.posicion ?? undefined,
      note: r.nota ?? undefined,
    }));
  }, localResults);

async function getContenido(): Promise<Record<string, string | null>> {
  return fromDb(async (db) => {
    const rows = must(await db.from("contenido").select("clave,valor"));
    return Object.fromEntries(rows.map((r) => [r.clave, r.valor]));
  }, {} as Record<string, string | null>);
}

export async function getAbout() {
  const fallback = {
    history: localAbout.history,
    mission: localAbout.mission,
    vision: localAbout.vision,
    philosophy: localAbout.philosophy,
    community: localAbout.community,
    values: localAbout.values,
    coaches: localAbout.coaches,
  };
  return fromDb(async (db) => {
    const [c, valores, entrenadores] = await Promise.all([
      getContenido(),
      db.from("valores").select("*").order("orden"),
      db.from("entrenadores").select("*").eq("activo", true).order("orden"),
    ]);
    return {
      history: c.historia ?? null,
      mission: c.mision ?? null,
      vision: c.vision ?? null,
      philosophy: c.filosofia ?? null,
      community: c.comunidad ?? null,
      values: must(valores).map((v) => ({ name: v.nombre, text: v.texto })),
      coaches: must(entrenadores).map((e) => ({ name: e.nombre, role: e.cargo, bio: e.bio ?? undefined, photo: e.foto_url ?? undefined })),
    };
  }, fallback);
}

export async function getContact() {
  const c = await getContenido();
  return { instagram: c.instagram || site.instagram, email: c.email || site.email };
}

export const getGallery = () =>
  fromDb(
    async (db) => {
      const [f, v, n] = await Promise.all([
        db.from("fotos").select("*").order("creado_en", { ascending: false }),
        db.from("videos").select("*").order("titulo"),
        db.from("noticias").select("*").eq("publicado", true).order("fecha", { ascending: false }).limit(30),
      ]);
      return {
        photos: [...must(f).map((p) => ({ src: p.url as string, alt: p.alt as string, category: p.categoria as GalleryCategory })), ...localPhotos],
        videos: must(v).map((x) => ({ title: x.titulo as string, youtubeId: x.youtube_id as string })),
        news: must(n).map((x) => ({
          date: new Date(x.fecha + "T12:00:00").toLocaleDateString("es-CL", { day: "numeric", month: "long", year: "numeric" }),
          title: x.titulo as string,
          summary: x.resumen as string,
          image: (x.imagen_url as string | null) ?? undefined,
        })),
      };
    },
    { photos: localPhotos, videos: localVideos, news: localNews as { date: string; title: string; summary: string; image?: string }[] },
  );

const PRODUCT_COLS = "id,nombre,descripcion,categoria,precio,imagen_url,variantes";

export const getProducts = () =>
  fromDb<Producto[]>(async (db) => must(await db.from("productos").select(PRODUCT_COLS).eq("activo", true).order("orden").order("creado_en")) as Producto[], []);

export const getProduct = (id: string) =>
  /^[0-9a-f-]{36}$/.test(id)
    ? fromDb<Producto | null>(async (db) => must(await db.from("productos").select(PRODUCT_COLS).eq("id", id).eq("activo", true).maybeSingle()) as Producto | null, null)
    : Promise.resolve(null);

export type DeportistaPublico = { id: string; nombre: string; especialidad: string | null; logros: string[]; foto_url: string | null };

/** Solo deportistas marcados como públicos, y solo campos públicos (nunca contacto). */
export const getPublicAthletes = () =>
  fromDb<DeportistaPublico[]>(
    async (db) =>
      must(
        await db
          .from("deportistas")
          .select("id,nombre,especialidad,logros,foto_url")
          .eq("publico", true)
          .eq("estado", "activo")
          .order("orden_publico")
          .order("nombre"),
      ) as DeportistaPublico[],
    [],
  );

export async function getHero() {
  const c = await getContenido();
  return { titulo: c.hero_titulo || null, subtitulo: c.hero_subtitulo || null };
}
