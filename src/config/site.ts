/**
 * Configuración central del sitio.
 * Los campos en `null` están pendientes de confirmar por el administrador:
 * mientras sigan en null, el sitio los muestra como "pendiente" o los oculta.
 */
export const site = {
  name: "Tritotal Team",
  shortName: "Tritotal",
  description:
    "Equipo de triatlón y entrenamiento de resistencia: natación, ciclismo y running. Preparación para triatlón, Ironman 70.3 y Full Ironman.",
  // Dominio oficial: definir NEXT_PUBLIC_SITE_URL en el entorno al publicar.
  // Dominio oficial. Se puede sobrescribir con NEXT_PUBLIC_SITE_URL.
  url: process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL ? "https://www.tritotalteam.cl" : "http://localhost:3000"),
  locale: "es_CL",

  whatsapp: {
    display: "+56 9 5859 0907",
    number: "56958590907",
    defaultMessage:
      "Hola, quiero conocer más sobre Tritotal Team y sus planes de entrenamiento.",
  },

  // Pendientes: completar con los datos oficiales.
  instagram: null as string | null, // ej: "https://instagram.com/usuario"
  email: null as string | null, // ej: "contacto@dominio.cl"
  city: null as string | null,

  /**
   * Logotipos oficiales. Copiar los archivos a /public/brand/ y poner aquí la ruta.
   * Usar las versiones blancas (fondo transparente). Ancho/alto = tamaño real del archivo,
   * para que nunca se deformen.
   */
  logos: {
    principal: { src: "/brand/logo-principal-blanco.png", width: 518, height: 268 } as null | { src: string; width: number; height: number },
    secundario: { src: "/brand/logo-secundario-blanco.png", width: 1017, height: 304 } as null | { src: string; width: number; height: number },
  },
};

export const nav = [
  { href: "/", label: "Inicio" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/deportistas", label: "Nuestros deportistas" },
  { href: "/entrenamientos", label: "Entrenamientos" },
  { href: "/planes", label: "Planes" },
  { href: "/competencias", label: "Competencias" },
  { href: "/galeria", label: "Galería" },
  { href: "/tienda", label: "Tienda" },
  { href: "/contacto", label: "Contacto" },
];
