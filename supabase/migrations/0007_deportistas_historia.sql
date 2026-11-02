-- Nuestros deportistas: año de ingreso, historia y distancia de especialización (públicos).
-- Se puede ejecutar más de una vez.

alter table public.deportistas add column if not exists desde integer;
alter table public.deportistas add column if not exists historia text;
alter table public.deportistas add column if not exists distancia text;
