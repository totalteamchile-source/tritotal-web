-- Entrenadores: formación académica y ficha del fundador.
-- Se puede ejecutar más de una vez.

alter table public.entrenadores add column if not exists formacion text[];

insert into public.entrenadores (nombre, cargo, formacion, bio, orden, activo)
select 'Iván Andrés Arraño Peña', 'Fundador y entrenador de triatlón',
  array['Profesor de Educación Física.', 'Magíster en Alto Rendimiento Deportivo – Universidad Mayor.'],
  'Iván Andrés Arraño Peña es profesor de Educación Física, entrenador de triatlón y Magíster en Alto Rendimiento Deportivo de la Universidad Mayor.

Fundador de Tritotal Team, equipo de triatlón de la comuna de Maipú, creado en 2017. Cuenta con experiencia en la planificación, dirección y desarrollo de procesos de entrenamiento, habiendo preparado a más de 50 deportistas.

Su trabajo se enfoca en la formación deportiva, el desarrollo del rendimiento físico y la preparación de triatletas para competencias de distintas distancias, incluyendo Ironman 70.3 y Full Ironman.',
  0, true
where not exists (select 1 from public.entrenadores where nombre = 'Iván Andrés Arraño Peña');
