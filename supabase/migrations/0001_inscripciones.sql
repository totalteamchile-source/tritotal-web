-- Etapa 3: inscripciones de deportistas
-- Ejecutar en Supabase → SQL Editor (o con `supabase db push`).

create extension if not exists "pgcrypto";

create type estado_inscripcion as enum ('pendiente', 'contactado', 'aceptada', 'rechazada');

create table public.inscripciones (
  id                    uuid primary key default gen_random_uuid(),
  folio                 text not null unique,           -- código corto que ve el deportista
  creado_en             timestamptz not null default now(),
  estado                estado_inscripcion not null default 'pendiente',

  nombre                text not null,
  fecha_nacimiento      date not null,
  rut                   text,
  email                 text not null,
  telefono              text not null,
  emergencia_nombre     text not null,
  emergencia_telefono   text not null,

  experiencia           text not null,
  disciplinas           text[] not null default '{}',
  competencias          text[] not null default '{}',
  objetivos             text,
  plan_id               text,

  acepta_terminos       boolean not null check (acepta_terminos),
  acepta_terminos_en    timestamptz not null default now(),
  notas_admin           text
);

create index inscripciones_creado_en_idx on public.inscripciones (creado_en desc);
create index inscripciones_estado_idx on public.inscripciones (estado);
create index inscripciones_email_idx on public.inscripciones (lower(email));

-- Seguridad: RLS activado y SIN políticas públicas.
-- Solo el servidor (clave service_role) puede insertar/leer.
-- En la Etapa 5 se agregarán políticas para administradores y entrenadores.
alter table public.inscripciones enable row level security;
