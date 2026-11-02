-- Competencias: fecha de término y enlace oficial, más el calendario de triatlón
-- en Chile tomado de trichile.cl/calendario_nacional (consultado el 2026-11-02).
-- Se puede ejecutar más de una vez: no duplica competencias ya cargadas.

alter table public.competencias add column if not exists fecha_fin date;
alter table public.competencias add column if not exists enlace text;

insert into public.competencias (fecha, fecha_fin, nombre, lugar, distancia, enlace)
select v.fecha::date, v.fecha_fin::date, v.nombre, v.lugar, v.distancia, v.enlace
from (values
  ('2026-11-07', '2026-11-08', 'Copa del Mundo de Triatlón Iquique', 'Iquique', 'Federada', 'https://fechitri.cl/'),
  ('2026-11-21', '2026-11-22', 'Topman Rapel', 'Rapel', 'Sprint y Kids', 'https://www.triatletas.cl/topman-rapel-2026/'),
  ('2026-11-29', null, 'Ironman e Ironman 70.3 Valdivia', 'Valdivia', '140.6 y 70.3', 'https://www.trichile.cl/calendario_nacional'),
  ('2026-12-06', null, 'Triatlón Parque de la Familia', 'Lugar por confirmar', 'Sprint', 'https://www.hlsport.cl/triatlon-parque-de-la-familia-2026/'),
  ('2026-12-06', null, 'Patagonman', 'Patagonia', 'Ironman extremo', 'https://www.patagonman.com/es/enrollment'),
  ('2026-12-12', null, 'Triatlón Viña del Mar', 'Viña del Mar', 'Sprint y Kids · Federada', 'https://triatlonchile.cl/'),
  ('2026-12-13', null, 'TriSeries Frutillar', 'Frutillar', 'Olímpico, Sprint y Súper Sprint', 'https://welcu.com/chile-finisher/triseries2026'),
  ('2026-12-19', null, 'Tri Zapallar', 'Zapallar', 'Olímpico', 'https://www.trichile.cl/calendario_nacional'),
  ('2027-01-07', null, 'Carozzi Kids Challenge', 'Pucón', 'Kids · Federada', 'https://www.passline.com/eventos/carozzi-kids-challenge-pucon-2027'),
  ('2027-01-08', null, 'Carozzi Sprint Race', 'Pucón', 'Sprint · Federada', 'https://www.passline.com/eventos/carozzi-sprint-race-pucon-2027'),
  ('2027-01-08', null, 'Carozzi Promotional Race', 'Pucón', 'Súper Sprint', 'https://www.passline.com/eventos/carozzi-promotional-race-pucon-2027'),
  ('2027-01-10', null, 'Itaú Ironman 70.3 Pucón', 'Pucón, Araucanía', '1,9 km · 90 km · 21,1 km', 'https://www.ironman.com/im703-pucon'),
  ('2027-01-20', '2027-01-21', 'Triatlón Caburgua', 'Lago Caburgua, Pucón', 'Kids, Promocional, Sprint y Olímpico', 'https://my.raceresult.com/409403/registration')
) as v(fecha, fecha_fin, nombre, lugar, distancia, enlace)
where not exists (
  select 1 from public.competencias c where c.nombre = v.nombre and c.fecha = v.fecha::date
);
