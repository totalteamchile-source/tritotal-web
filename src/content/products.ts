import { FORMATO_DIGITAL, type Producto } from "@/lib/shop";

/**
 * Productos de respaldo cuando Supabase no está configurado.
 * Los mismos productos (con el mismo id) se crean en supabase/migrations/0009_productos_digitales.sql,
 * y desde ahí se editan en el panel → Productos tienda.
 * El PDF NUNCA va en este repositorio (es público): se sube desde el panel a un almacenamiento privado.
 */
export const products: Producto[] = [
  {
    id: "8c1f6a52-3d0e-4b8a-9f61-2a7c5d9e0b01",
    nombre: "Método Modular de Natación para Neurodivergencias",
    categoria: "Guías en PDF",
    precio: 15000,
    imagen_url: "/tienda/metodo-modular-natacion.webp",
    descripcion:
      "Del apoyo a la autonomía. Guía de enseñanza de natación para niños y adolescentes neurodivergentes, escrita por Iván Andrés Arraño Peña.\n\n" +
      "• 72 módulos organizados en 3 programas: Conexión con el agua, Construcción de habilidades y Autonomía y proyecto personal.\n" +
      "• Seguridad acuática, evaluación inicial, entorno sensorial, comunicación y apoyos visuales, regulación emocional y trabajo con la familia.\n" +
      "• Distancias en largos: sirve para piscinas de 20 m y 25 m.\n\n" +
      "Libro digital en PDF de 58 páginas. Es una guía de enseñanza: no reemplaza la evaluación ni las indicaciones de profesionales de salud.",
    variantes: [{ talla: FORMATO_DIGITAL, stock: null }],
    digital: true,
  },
];
