-- Productos digitales (PDF) en la tienda.
-- Ejecutar en Supabase → SQL Editor después de 0003_tienda.sql. Se puede ejecutar más de una vez.

alter table public.productos add column if not exists digital boolean not null default false;
-- Ruta del archivo dentro del bucket privado "productos-digitales" (nunca una URL pública).
alter table public.productos add column if not exists archivo text;

-- Los pedidos que solo traen productos digitales no tienen retiro ni despacho.
alter table public.pedidos drop constraint if exists pedidos_entrega_check;
alter table public.pedidos add constraint pedidos_entrega_check check (entrega in ('retiro','despacho','digital'));

-- Bucket PRIVADO: los PDF solo se entregan con un enlace temporal después de un pago confirmado.
insert into storage.buckets (id, name, public)
values ('productos-digitales', 'productos-digitales', false)
on conflict (id) do update set public = false;

-- Producto inicial (mismo id que src/content/products.ts). El PDF se sube desde el panel → Productos tienda.
insert into public.productos (id, nombre, descripcion, categoria, precio, imagen_url, variantes, digital, orden)
values (
  '8c1f6a52-3d0e-4b8a-9f61-2a7c5d9e0b01',
  'Método Modular de Natación para Neurodivergencias',
  E'Del apoyo a la autonomía. Guía de enseñanza de natación para niños y adolescentes neurodivergentes, escrita por Iván Andrés Arraño Peña.\n\n• 72 módulos organizados en 3 programas: Conexión con el agua, Construcción de habilidades y Autonomía y proyecto personal.\n• Seguridad acuática, evaluación inicial, entorno sensorial, comunicación y apoyos visuales, regulación emocional y trabajo con la familia.\n• Distancias en largos: sirve para piscinas de 20 m y 25 m.\n\nLibro digital en PDF de 58 páginas. Es una guía de enseñanza: no reemplaza la evaluación ni las indicaciones de profesionales de salud.',
  'Guías en PDF',
  15000,
  '/tienda/metodo-modular-natacion.webp',
  '[{"talla":"PDF","stock":null}]',
  true,
  1
)
on conflict (id) do nothing;
