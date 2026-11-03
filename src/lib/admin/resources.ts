import type { Rol } from "@/lib/server/auth";

/**
 * Definición de las secciones administrables del panel.
 * Cada recurso es una tabla de Supabase con su formulario y listado.
 */
export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "date"
  | "select"
  | "multiselect"
  | "list" // una línea por elemento (text[])
  | "checkbox"
  | "image"
  | "relation"
  | "variants" // tallas con stock (jsonb)
  | "items"; // detalle de productos de un pedido (solo lectura)

export type Field = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: readonly string[];
  /** Para type "relation": tabla y columna a mostrar */
  relation?: { table: string; label: string };
  help?: string;
  placeholder?: string;
  readonly?: boolean;
  /** Ocupa el ancho completo del formulario */
  wide?: boolean;
  /** Valor a guardar si el campo queda vacío */
  default?: unknown;
};

export type Resource = {
  slug: string;
  table: string;
  title: string;
  singular: string;
  roles: Rol[];
  fields: Field[];
  columns: string[]; // campos que se muestran en el listado
  orderBy: { column: string; ascending: boolean }[];
  /** Rutas públicas a refrescar cuando se edita */
  revalidate: string[];
  canCreate?: boolean;
  description?: string;
};

const DISCIPLINAS = ["Natación", "Ciclismo", "Running"] as const;
export const DIAS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"] as const;

export const resources: Resource[] = [
  {
    slug: "inscripciones",
    table: "inscripciones",
    title: "Inscripciones",
    singular: "inscripción",
    roles: ["admin"],
    canCreate: false,
    description: "Solicitudes recibidas desde el formulario del sitio.",
    fields: [
      { name: "estado", label: "Estado", type: "select", options: ["pendiente", "contactado", "aceptada", "rechazada"], required: true },
      { name: "notas_admin", label: "Notas internas", type: "textarea", wide: true },
      { name: "folio", label: "Folio", type: "text", readonly: true },
      { name: "creado_en", label: "Recibida", type: "text", readonly: true },
      { name: "nombre", label: "Nombre", type: "text", readonly: true },
      { name: "fecha_nacimiento", label: "Fecha de nacimiento", type: "date", readonly: true },
      { name: "rut", label: "RUT", type: "text", readonly: true },
      { name: "email", label: "Correo", type: "text", readonly: true },
      { name: "telefono", label: "Teléfono", type: "text", readonly: true },
      { name: "emergencia_nombre", label: "Contacto de emergencia", type: "text", readonly: true },
      { name: "emergencia_telefono", label: "Teléfono emergencia", type: "text", readonly: true },
      { name: "experiencia", label: "Experiencia", type: "text", readonly: true },
      { name: "disciplinas", label: "Disciplinas", type: "list", readonly: true },
      { name: "competencias", label: "Competencias", type: "list", readonly: true },
      { name: "objetivos", label: "Objetivos", type: "textarea", readonly: true, wide: true },
      { name: "plan_id", label: "Plan elegido", type: "relation", relation: { table: "planes", label: "nombre" }, readonly: true },
    ],
    columns: ["creado_en", "folio", "nombre", "telefono", "estado"],
    orderBy: [{ column: "creado_en", ascending: false }],
    revalidate: [],
  },
  {
    slug: "deportistas",
    table: "deportistas",
    title: "Deportistas",
    singular: "deportista",
    roles: ["admin", "entrenador"],
    fields: [
      { name: "nombre", label: "Nombre completo", type: "text", required: true },
      { name: "estado", label: "Estado", type: "select", options: ["activo", "inactivo"], required: true },
      { name: "rut", label: "RUT", type: "text" },
      { name: "fecha_nacimiento", label: "Fecha de nacimiento", type: "date" },
      { name: "email", label: "Correo", type: "text" },
      { name: "telefono", label: "Teléfono", type: "text" },
      { name: "emergencia_nombre", label: "Contacto de emergencia", type: "text" },
      { name: "emergencia_telefono", label: "Teléfono emergencia", type: "text" },
      { name: "plan_id", label: "Plan", type: "relation", relation: { table: "planes", label: "nombre" } },
      { name: "fecha_ingreso", label: "Fecha de ingreso", type: "date", required: true },
      { name: "notas", label: "Notas internas", type: "textarea", wide: true },
      {
        name: "publico",
        label: "Mostrar en «Nuestros deportistas»",
        type: "checkbox",
        help: "Solo con autorización del deportista. Se publican foto, nombre, especialidad, año de ingreso, historia y trayectoria (nunca datos de contacto).",
      },
      { name: "especialidad", label: "Especialidad (pública)", type: "text", placeholder: "Ej: Triatleta – Tritotal Team | Maipú" },
      { name: "desde", label: "Integrante desde (año, público)", type: "number" },
      { name: "distancia", label: "Distancia de especialización (pública)", type: "text", placeholder: "Ej: 70.3 (1,9 km natación, 90 km ciclismo y 21,1 km running)" },
      { name: "historia", label: "Historia deportiva (pública)", type: "textarea", wide: true },
      { name: "orden_publico", label: "Orden en la página", type: "number", default: 0 },
      { name: "logros", label: "Trayectoria competitiva (pública)", type: "list", help: "Una por línea.", wide: true },
      { name: "foto_url", label: "Foto (pública)", type: "image" },
    ],
    columns: ["nombre", "telefono", "plan_id", "estado", "publico"],
    orderBy: [{ column: "nombre", ascending: true }],
    revalidate: ["/deportistas"],
  },
  {
    slug: "planes",
    table: "planes",
    title: "Planes y precios",
    singular: "plan",
    roles: ["admin"],
    fields: [
      { name: "nombre", label: "Nombre del plan", type: "text", required: true },
      { name: "modalidad", label: "Modalidad", type: "select", options: ["mensual", "trimestral", "otro"], required: true },
      { name: "descripcion", label: "Descripción", type: "textarea", wide: true },
      { name: "disciplinas", label: "Disciplinas incluidas", type: "multiselect", options: DISCIPLINAS },
      { name: "frecuencia", label: "Frecuencia de entrenamiento", type: "text", placeholder: "Ej: 5 sesiones por semana" },
      { name: "precio", label: "Precio (CLP)", type: "number", help: "Dejar vacío para mostrar «Precio por confirmar»." },
      { name: "beneficios", label: "Beneficios", type: "list", help: "Uno por línea.", wide: true },
      { name: "orden", label: "Orden", type: "number", help: "Menor número aparece primero.", default: 0 },
      { name: "destacado", label: "Destacar este plan", type: "checkbox" },
      { name: "activo", label: "Visible en el sitio", type: "checkbox" },
    ],
    columns: ["nombre", "modalidad", "precio", "activo"],
    orderBy: [{ column: "orden", ascending: true }],
    revalidate: ["/planes", "/inscripcion"],
  },
  {
    slug: "pedidos",
    table: "pedidos",
    title: "Pedidos tienda",
    singular: "pedido",
    roles: ["admin"],
    canCreate: false,
    description: "Compras hechas en la tienda del sitio.",
    fields: [
      { name: "estado", label: "Estado", type: "select", options: ["pendiente_pago", "pagado", "preparando", "entregado", "cancelado", "rechazado"], required: true },
      { name: "notas_admin", label: "Notas internas", type: "textarea", wide: true },
      { name: "numero", label: "N° de pedido", type: "text", readonly: true },
      { name: "creado_en", label: "Fecha", type: "text", readonly: true },
      { name: "items", label: "Productos", type: "items", readonly: true, wide: true },
      { name: "total", label: "Total (CLP)", type: "number", readonly: true },
      { name: "nombre", label: "Cliente", type: "text", readonly: true },
      { name: "email", label: "Correo", type: "text", readonly: true },
      { name: "telefono", label: "Teléfono", type: "text", readonly: true },
      { name: "entrega", label: "Entrega", type: "text", readonly: true },
      { name: "direccion", label: "Dirección", type: "text", readonly: true },
      { name: "comuna", label: "Comuna", type: "text", readonly: true },
      { name: "notas", label: "Comentarios del cliente", type: "textarea", readonly: true, wide: true },
      { name: "proveedor", label: "Medio de pago", type: "text", readonly: true },
      { name: "pago_id", label: "ID de pago Mercado Pago", type: "text", readonly: true },
      { name: "pago_estado", label: "Estado en Mercado Pago", type: "text", readonly: true },
    ],
    columns: ["creado_en", "numero", "nombre", "total", "estado"],
    orderBy: [{ column: "creado_en", ascending: false }],
    revalidate: [],
  },
  {
    slug: "productos",
    table: "productos",
    title: "Productos tienda",
    singular: "producto",
    roles: ["admin"],
    fields: [
      { name: "nombre", label: "Nombre", type: "text", required: true },
      { name: "categoria", label: "Categoría", type: "text", required: true, placeholder: "Ej: Poleras, Gorros, Accesorios" },
      { name: "precio", label: "Precio (CLP)", type: "number", required: true },
      { name: "orden", label: "Orden", type: "number", help: "Menor número aparece primero.", default: 0 },
      { name: "descripcion", label: "Descripción", type: "textarea", wide: true },
      { name: "imagen_url", label: "Foto", type: "image" },
      {
        name: "variantes",
        label: "Tallas y stock",
        type: "variants",
        required: true,
        wide: true,
        help: "Una talla por línea con su stock, ej. «M: 5». Sin número = sin control de stock. Para productos sin talla, escribe «Única».",
      },
      { name: "activo", label: "Visible en la tienda", type: "checkbox" },
    ],
    columns: ["imagen_url", "nombre", "precio", "variantes", "activo"],
    orderBy: [{ column: "orden", ascending: true }],
    revalidate: ["/tienda"],
  },
  {
    slug: "horarios",
    table: "horarios",
    title: "Horarios",
    singular: "horario",
    roles: ["admin", "entrenador"],
    fields: [
      { name: "dia", label: "Día", type: "select", options: DIAS, required: true },
      { name: "hora", label: "Hora", type: "text", required: true, placeholder: "06:30" },
      { name: "disciplina", label: "Tipo", type: "select", options: ["Natación", "Ciclismo", "Running", "Especial", "Actividad"], required: true },
      { name: "titulo", label: "Sesión", type: "text", required: true, placeholder: "Ej: Técnica de nado" },
      { name: "lugar", label: "Lugar", type: "text" },
    ],
    columns: ["dia", "hora", "disciplina", "titulo", "lugar"],
    orderBy: [{ column: "hora", ascending: true }],
    revalidate: ["/entrenamientos"],
  },
  {
    slug: "competencias",
    table: "competencias",
    title: "Competencias",
    singular: "competencia",
    roles: ["admin", "entrenador"],
    fields: [
      { name: "nombre", label: "Nombre", type: "text", required: true },
      { name: "fecha", label: "Fecha", type: "date", required: true },
      { name: "tipo", label: "Tipo", type: "select", options: ["Triatlón", "Running"], required: true, default: "Triatlón" },
      { name: "fecha_fin", label: "Fecha de término (si dura más de un día)", type: "date" },
      { name: "lugar", label: "Lugar", type: "text", required: true },
      { name: "distancia", label: "Distancia", type: "text", placeholder: "Ej: 70.3" },
      { name: "enlace", label: "Enlace oficial o de inscripción", type: "text", placeholder: "https://…" },
      { name: "descripcion", label: "Descripción", type: "textarea", wide: true },
    ],
    columns: ["fecha", "tipo", "nombre", "lugar", "distancia"],
    orderBy: [{ column: "fecha", ascending: false }],
    revalidate: ["/competencias"],
  },
  {
    slug: "resultados",
    table: "resultados",
    title: "Resultados",
    singular: "resultado",
    roles: ["admin", "entrenador"],
    fields: [
      { name: "competencia", label: "Competencia", type: "text", required: true },
      { name: "fecha", label: "Fecha", type: "date", required: true },
      { name: "deportista", label: "Deportista", type: "text", required: true },
      { name: "categoria", label: "Categoría", type: "text" },
      { name: "tiempo", label: "Tiempo", type: "text", placeholder: "04:52:10" },
      { name: "posicion", label: "Lugar / posición", type: "text" },
      { name: "nota", label: "Nota (marca personal, logro…)", type: "text", wide: true },
    ],
    columns: ["fecha", "competencia", "deportista", "tiempo", "posicion"],
    orderBy: [{ column: "fecha", ascending: false }],
    revalidate: ["/competencias"],
  },
  {
    slug: "entrenadores",
    table: "entrenadores",
    title: "Entrenadores",
    singular: "entrenador",
    roles: ["admin"],
    description: "Fichas que aparecen en la página Nosotros.",
    fields: [
      { name: "nombre", label: "Nombre", type: "text", required: true },
      { name: "cargo", label: "Cargo", type: "text", required: true },
      { name: "formacion", label: "Formación académica", type: "list", help: "Un título por línea.", wide: true },
      { name: "bio", label: "Perfil profesional", type: "textarea", wide: true },
      { name: "foto_url", label: "Foto", type: "image" },
      { name: "orden", label: "Orden", type: "number", help: "Menor número aparece primero.", default: 0 },
      { name: "activo", label: "Visible en el sitio", type: "checkbox" },
    ],
    columns: ["nombre", "cargo", "activo"],
    orderBy: [{ column: "orden", ascending: true }],
    revalidate: ["/nosotros"],
  },
  {
    slug: "fotos",
    table: "fotos",
    title: "Fotos",
    singular: "foto",
    roles: ["admin", "entrenador"],
    fields: [
      { name: "url", label: "Imagen", type: "image", required: true },
      { name: "alt", label: "Descripción breve", type: "text", required: true, help: "Ej: Equipo en el triatlón de Pucón" },
      { name: "categoria", label: "Categoría", type: "select", options: ["Equipo", "Entrenamientos", "Competencias", "Actividades sociales"], required: true },
    ],
    columns: ["url", "alt", "categoria"],
    orderBy: [{ column: "creado_en", ascending: false }],
    revalidate: ["/galeria"],
  },
  {
    slug: "videos",
    table: "videos",
    title: "Videos",
    singular: "video",
    roles: ["admin", "entrenador"],
    fields: [
      { name: "titulo", label: "Título", type: "text", required: true },
      { name: "youtube_id", label: "Enlace o ID de YouTube", type: "text", required: true, help: "Pega el enlace completo del video." },
    ],
    columns: ["titulo", "youtube_id"],
    orderBy: [{ column: "titulo", ascending: true }],
    revalidate: ["/galeria"],
  },
  {
    slug: "noticias",
    table: "noticias",
    title: "Noticias",
    singular: "noticia",
    roles: ["admin", "entrenador"],
    fields: [
      { name: "titulo", label: "Título", type: "text", required: true, wide: true },
      { name: "fecha", label: "Fecha", type: "date", required: true },
      { name: "publicado", label: "Publicada", type: "checkbox" },
      { name: "resumen", label: "Texto", type: "textarea", required: true, wide: true },
      { name: "imagen_url", label: "Imagen", type: "image" },
    ],
    columns: ["fecha", "titulo", "publicado"],
    orderBy: [{ column: "fecha", ascending: false }],
    revalidate: ["/galeria"],
  },
  {
    slug: "valores",
    table: "valores",
    title: "Valores",
    singular: "valor",
    roles: ["admin"],
    description: "Valores deportivos de la página Nosotros.",
    fields: [
      { name: "nombre", label: "Valor", type: "text", required: true },
      { name: "texto", label: "Descripción", type: "textarea", required: true, wide: true },
      { name: "orden", label: "Orden", type: "number", help: "Menor número aparece primero.", default: 0 },
    ],
    columns: ["nombre", "orden"],
    orderBy: [{ column: "orden", ascending: true }],
    revalidate: ["/nosotros"],
  },
  {
    slug: "auspiciadores",
    table: "auspiciadores",
    title: "Auspiciadores",
    singular: "auspiciador",
    roles: ["admin"],
    description: "Marcas que apoyan al equipo. Aparecen en la portada y en el pie de página.",
    fields: [
      { name: "nombre", label: "Nombre de la marca", type: "text", required: true },
      { name: "logo_url", label: "Logo (PNG con fondo transparente, ideal blanco o a color)", type: "image" },
      { name: "enlace", label: "Sitio web o Instagram", type: "text", placeholder: "https://…" },
      { name: "orden", label: "Orden", type: "number", help: "Menor número aparece primero.", default: 0 },
      { name: "activo", label: "Visible en el sitio", type: "checkbox" },
    ],
    columns: ["nombre", "orden", "activo"],
    orderBy: [{ column: "orden", ascending: true }],
    revalidate: ["/"],
  },
];

export const getResource = (slug: string) => resources.find((r) => r.slug === slug);

/** Textos editables de la sección "Contenido" (tabla contenido). */
export const contentKeys = [
  { clave: "hero_titulo", label: "Frase principal de la portada", type: "text" },
  { clave: "hero_subtitulo", label: "Subtítulo de la portada", type: "textarea" },
  { clave: "historia", label: "Historia del equipo", type: "textarea" },
  { clave: "mision", label: "Misión", type: "textarea" },
  { clave: "vision", label: "Visión", type: "textarea" },
  { clave: "filosofia", label: "Filosofía de entrenamiento", type: "textarea" },
  { clave: "comunidad", label: "Comunidad de deportistas", type: "textarea" },
  { clave: "instagram", label: "Instagram (enlace completo)", type: "text" },
  { clave: "email", label: "Correo oficial", type: "text" },
] as const;
