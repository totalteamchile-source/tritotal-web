/**
 * Contenido de "Nosotros". Todo marcado `null` queda como espacio editable
 * y se muestra en el sitio como "Contenido pendiente".
 * No se inventan nombres, antecedentes ni certificaciones.
 */
export const about = {
  history: null as string | null,
  mission: null as string | null,
  vision: null as string | null,
  philosophy: null as string | null,
  values: [] as { name: string; text: string }[],
  community: null as string | null,
  coaches: [] as {
    name: string;
    role: string;
    bio?: string;
    photo?: string; // ruta en /public/fotos/
  }[],
};
