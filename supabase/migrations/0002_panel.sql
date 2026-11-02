-- Etapa 5: panel de administración
-- Ejecutar en Supabase → SQL Editor DESPUÉS de 0001_inscripciones.sql.
--
-- Seguridad: todas las tablas tienen RLS activado y ninguna política pública.
-- El sitio lee y escribe solo desde el servidor (clave service_role), y el panel
-- verifica el rol del usuario (admin / entrenador) antes de cada operación.

-- Usuarios del panel ---------------------------------------------------------
create table public.perfiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  email      text not null,
  nombre     text,
  rol        text not null check (rol in ('admin', 'entrenador')),
  creado_en  timestamptz not null default now()
);

-- Planes y membresías --------------------------------------------------------
create table public.planes (
  id           uuid primary key default gen_random_uuid(),
  nombre       text not null,
  descripcion  text,
  disciplinas  text[] not null default '{}',
  frecuencia   text,
  beneficios   text[] not null default '{}',
  precio       integer check (precio is null or precio >= 0),  -- CLP; null = por confirmar
  modalidad    text not null default 'mensual' check (modalidad in ('mensual', 'trimestral', 'otro')),
  destacado    boolean not null default false,
  activo       boolean not null default true,
  orden        integer not null default 0,
  creado_en    timestamptz not null default now()
);

-- Deportistas (miembros del equipo) -----------------------------------------
create table public.deportistas (
  id                   uuid primary key default gen_random_uuid(),
  nombre               text not null,
  rut                  text,
  email                text,
  telefono             text,
  fecha_nacimiento     date,
  emergencia_nombre    text,
  emergencia_telefono  text,
  plan_id              uuid references public.planes (id) on delete set null,
  estado               text not null default 'activo' check (estado in ('activo', 'inactivo')),
  fecha_ingreso        date not null default current_date,
  inscripcion_id       uuid references public.inscripciones (id) on delete set null,
  notas                text,
  creado_en            timestamptz not null default now()
);
create index deportistas_estado_idx on public.deportistas (estado);

-- Entrenadores (ficha pública en "Nosotros") --------------------------------
create table public.entrenadores (
  id        uuid primary key default gen_random_uuid(),
  nombre    text not null,
  cargo     text not null,
  bio       text,
  foto_url  text,
  orden     integer not null default 0,
  activo    boolean not null default true
);

-- Horarios semanales ---------------------------------------------------------
create table public.horarios (
  id          uuid primary key default gen_random_uuid(),
  dia         text not null check (dia in ('Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo')),
  hora        text not null,  -- "06:30"
  disciplina  text not null check (disciplina in ('Natación','Ciclismo','Running','Especial','Actividad')),
  titulo      text not null,
  lugar       text
);

-- Competencias y resultados -------------------------------------------------
create table public.competencias (
  id           uuid primary key default gen_random_uuid(),
  fecha        date not null,
  nombre       text not null,
  lugar        text not null,
  distancia    text,
  descripcion  text
);

create table public.resultados (
  id           uuid primary key default gen_random_uuid(),
  fecha        date not null,
  competencia  text not null,
  deportista   text not null,
  categoria    text,
  tiempo       text,
  posicion     text,
  nota         text
);

-- Galería, videos y noticias ------------------------------------------------
create table public.fotos (
  id         uuid primary key default gen_random_uuid(),
  url        text not null,
  alt        text not null,
  categoria  text not null check (categoria in ('Equipo','Entrenamientos','Competencias','Actividades sociales')),
  creado_en  timestamptz not null default now()
);

create table public.videos (
  id          uuid primary key default gen_random_uuid(),
  titulo      text not null,
  youtube_id  text not null
);

create table public.noticias (
  id          uuid primary key default gen_random_uuid(),
  fecha       date not null default current_date,
  titulo      text not null,
  resumen     text not null,
  imagen_url  text,
  publicado   boolean not null default true
);

-- Textos editables ("Nosotros", redes) ---------------------------------------
create table public.contenido (
  clave  text primary key,
  valor  text
);

create table public.valores (
  id      uuid primary key default gen_random_uuid(),
  nombre  text not null,
  texto   text not null,
  orden   integer not null default 0
);

-- RLS: activado en todo, sin políticas públicas ------------------------------
alter table public.perfiles     enable row level security;
alter table public.planes       enable row level security;
alter table public.deportistas  enable row level security;
alter table public.entrenadores enable row level security;
alter table public.horarios     enable row level security;
alter table public.competencias enable row level security;
alter table public.resultados   enable row level security;
alter table public.fotos        enable row level security;
alter table public.videos       enable row level security;
alter table public.noticias     enable row level security;
alter table public.contenido    enable row level security;
alter table public.valores      enable row level security;

-- Almacenamiento de imágenes (lectura pública, escritura solo servidor) ------
insert into storage.buckets (id, name, public)
values ('medios', 'medios', true)
on conflict (id) do nothing;
