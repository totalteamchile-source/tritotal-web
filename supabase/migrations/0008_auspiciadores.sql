-- Auspiciadores (sponsors) que se muestran en la portada y el pie de página.
create table if not exists public.auspiciadores (
  id        uuid primary key default gen_random_uuid(),
  nombre    text not null,
  logo_url  text,
  enlace    text,
  orden     integer not null default 0,
  activo    boolean not null default true
);
alter table public.auspiciadores enable row level security;
