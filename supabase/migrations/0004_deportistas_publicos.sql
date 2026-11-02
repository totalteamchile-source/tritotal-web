-- Página pública "Nuestros deportistas".
-- Ejecutar en Supabase → SQL Editor DESPUÉS de 0002_panel.sql.
-- Solo se muestran los deportistas marcados como públicos (requiere su autorización).

alter table public.deportistas
  add column if not exists publico        boolean not null default false,
  add column if not exists foto_url       text,
  add column if not exists especialidad   text,      -- ej: "Triatleta 70.3"
  add column if not exists logros         text[] not null default '{}',
  add column if not exists orden_publico  integer not null default 0;
