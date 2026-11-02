-- Competencias: fecha de término y enlace oficial, más el calendario de triatlón
-- en Chile tomado de trichile.cl/calendario_nacional (consultado el 2026-11-02).
-- También carga carreras de running de Santiago desde corre.cl/calendario (misma fecha).
-- Se puede ejecutar más de una vez: no duplica competencias ya cargadas.

alter table public.competencias add column if not exists fecha_fin date;
alter table public.competencias add column if not exists enlace text;
alter table public.competencias add column if not exists tipo text not null default 'Triatlón';

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

insert into public.competencias (fecha, fecha_fin, nombre, lugar, distancia, enlace, tipo)
select v.fecha::date, v.fecha_fin::date, v.nombre, v.lugar, v.distancia, v.enlace, v.tipo
from (values
  ('2026-11-07', null, 'Trail Altas Cumbres', 'Puente Alto', '4, 7, 14 y 21 km · trail', 'https://corre.cl/evento/11944', 'Running'),
  ('2026-11-07', null, 'Corrida por la Inclusión', 'La Granja', '500 m, 1, 3 y 5 km', 'https://corre.cl/evento/12239', 'Running'),
  ('2026-11-07', null, 'Wanderlust Come Together', 'Las Condes', '5 km', 'https://corre.cl/evento/12257', 'Running'),
  ('2026-11-08', null, 'Corrida Soy Más Fit La Pintana', 'La Pintana', '3 y 10 km', 'https://corre.cl/evento/11936', 'Running'),
  ('2026-11-08', null, 'The Color Run Santiago', 'Huechuraba', '5 km', 'https://corre.cl/evento/12179', 'Running'),
  ('2026-11-08', null, 'Corrida 184 Años de la Universidad de Chile', 'Santiago Centro', '5 y 10 km', 'https://corre.cl/evento/12216', 'Running'),
  ('2026-11-08', null, 'Legal Run', 'Pudahuel', '5 y 10 km', 'https://corre.cl/evento/12288', 'Running'),
  ('2026-11-08', null, 'Corrida Familiar Recoleta', 'Recoleta', '2 y 7 km', 'https://corre.cl/evento/12326', 'Running'),
  ('2026-11-15', null, 'FEDACHI Marathon', 'Ñuñoa', '5, 10, 21 y 42 km', 'https://corre.cl/evento/12009', 'Running'),
  ('2026-11-15', null, 'Corrida MagiK por los Niños con Cáncer', 'Providencia', '2 y 5 km', 'https://corre.cl/evento/12225', 'Running'),
  ('2026-11-15', null, 'Corrida Solidaria Duoc UC San Bernardo', 'San Bernardo', '2, 3,5 y 7 km', 'https://corre.cl/evento/12245', 'Running'),
  ('2026-11-15', null, 'Gran Corrida Pudahuel Más Convivencia', 'Pudahuel', '3 y 5 km', 'https://corre.cl/evento/12305', 'Running'),
  ('2026-11-21', null, 'Alhué Trail Run', 'Alhué', '3, 7, 12 y 21 km · trail', 'https://corre.cl/evento/11667', 'Running'),
  ('2026-11-22', null, 'Corrida TECHO-Chile Santiago Centro', 'Santiago Centro', '2, 5 y 10 km', 'https://corre.cl/evento/11992', 'Running'),
  ('2026-11-22', null, 'Chena Trail Naturaleza y Patrimonio', 'San Bernardo', '5, 13 y 21 km · trail', 'https://corre.cl/evento/12254', 'Running'),
  ('2026-11-28', null, 'La Gran Travesía', 'San José de Maipo', '55 y 100 km · trail', 'https://corre.cl/evento/11541', 'Running'),
  ('2026-11-28', null, 'Ñuñoa 10K Nocturna', 'Ñuñoa', '3, 5 y 10 km', 'https://corre.cl/evento/12237', 'Running'),
  ('2026-11-28', null, 'Kms por tu Sonrisa, Corrida contra el Cáncer Oral', 'Las Condes', '2 y 5 km', 'https://corre.cl/evento/12328', 'Running'),
  ('2026-11-29', null, 'Maratón de Melipilla', 'Melipilla', '5, 10, 21 y 42 km', 'https://corre.cl/evento/12314', 'Running'),
  ('2026-11-29', null, 'Corrida Familiar Lo Prado', 'Lo Prado', null, 'https://corre.cl/evento/12330', 'Running'),
  ('2026-12-06', null, 'Corrida Gana Santiago', 'Santiago Centro', '5, 10 y 21 km', 'https://corre.cl/evento/12069', 'Running'),
  ('2026-12-06', null, 'Corrida Solidaria Duoc UC Plaza Norte', 'Huechuraba', '2, 4 y 8 km', 'https://corre.cl/evento/12246', 'Running'),
  ('2026-12-06', null, 'Running Festival by Salcobrand', 'La Reina', '2,5 km', 'https://corre.cl/evento/12334', 'Running'),
  ('2026-12-06', null, 'Corrida Atlética Aniversario de Gendarmería', 'Melipilla', '4,5 km', 'https://corre.cl/evento/12198', 'Running'),
  ('2026-12-13', null, 'Smart Fit Run', 'Ñuñoa', '3, 5 y 10 km', 'https://corre.cl/evento/12227', 'Running'),
  ('2026-12-13', null, 'Corrida Santiago CCS', 'Santiago Centro', '5 y 15 km', 'https://corre.cl/evento/12238', 'Running'),
  ('2026-12-20', null, 'Desafío Trail Running ParqueMet', 'Providencia', '5, 10 y 23 km · trail', 'https://corre.cl/evento/11777', 'Running'),
  ('2026-12-31', null, 'Corrida San Silvestre Pomaire', 'Melipilla', '8,5 km', 'https://corre.cl/evento/11898', 'Running'),
  ('2027-01-17', null, 'Barbie Run Santiago Centro', 'Santiago Centro', '2 y 5 km', 'https://corre.cl/evento/12286', 'Running'),
  ('2027-03-06', null, 'Merrell Andes Mountain Sky Race', 'Lo Barnechea', '2, 10, 18 y 36 km · trail', 'https://corre.cl/evento/12274', 'Running'),
  ('2027-03-14', null, 'Corrida de Peñalolén', 'Peñalolén', '6, 10 y 15 km', 'https://corre.cl/evento/12212', 'Running'),
  ('2027-04-04', null, 'STGO21K by Asics', 'Ñuñoa', '10 y 21 km', 'https://corre.cl/evento/12279', 'Running'),
  ('2027-04-11', null, 'Desafío Trail Running', 'Providencia', '5, 10 y 23 km · trail', 'https://corre.cl/evento/12272', 'Running'),
  ('2027-04-18', null, 'Corrida Carabineros de Chile 100 Años', 'Providencia', '5, 10 y 21 km', 'https://corre.cl/evento/12332', 'Running'),
  ('2027-04-25', null, 'Control 30K by Asics-Garmin', 'Melipilla', '5, 10, 21 y 30 km', 'https://corre.cl/evento/12345', 'Running'),
  ('2027-05-02', null, 'Corramos Juntas, Cáncer de Mamas', 'Puente Alto', null, 'https://corre.cl/evento/12264', 'Running'),
  ('2027-05-16', null, 'Maratón de Santiago', 'Santiago Centro', '10, 21 y 42 km', 'https://corre.cl/evento/12046', 'Running'),
  ('2027-05-29', null, 'Santiago Trail Race', 'Las Condes', '3, 12, 21 y 30 km · trail', 'https://corre.cl/evento/12275', 'Running'),
  ('2027-08-29', null, 'Itaú Medio Maratón de Santiago (mujeres)', 'Santiago', '7 y 21 km', 'https://corre.cl/evento/12235', 'Running'),
  ('2027-08-29', null, 'STGO21K by Asics Santiago', 'Santiago', '10 y 21 km', 'https://corre.cl/evento/12280', 'Running'),
  ('2027-10-17', null, 'Corramos Juntas, Cáncer de Mamas', 'La Reina', null, 'https://corre.cl/evento/12265', 'Running'),
  ('2027-11-13', null, 'Desafío Trail Running Santa Martina Sunset', 'Lo Barnechea', '5, 13 y 25 km · trail', 'https://corre.cl/evento/12271', 'Running'),
  ('2027-12-19', null, 'Desafío Trail Running', 'Providencia', '5, 10 y 23 km · trail', 'https://corre.cl/evento/12273', 'Running')
) as v(fecha, fecha_fin, nombre, lugar, distancia, enlace, tipo)
where not exists (
  select 1 from public.competencias c where c.nombre = v.nombre and c.fecha = v.fecha::date
);
