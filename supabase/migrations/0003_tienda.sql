-- Etapa 4: tienda (productos, pedidos y pagos)
-- Ejecutar en Supabase → SQL Editor DESPUÉS de 0002_panel.sql.

create table public.productos (
  id           uuid primary key default gen_random_uuid(),
  nombre       text not null,
  descripcion  text,
  categoria    text not null default 'Ropa',
  precio       integer not null check (precio > 0),            -- CLP
  imagen_url   text,
  -- Tallas con stock: [{"talla":"M","stock":5}, {"talla":"Única","stock":null}]
  -- stock null = sin control de stock
  variantes    jsonb not null default '[{"talla":"Única","stock":null}]',
  activo       boolean not null default true,
  orden        integer not null default 0,
  creado_en    timestamptz not null default now()
);

create table public.pedidos (
  id           uuid primary key default gen_random_uuid(),
  numero       text not null unique,                            -- ej: P-7K3QX9
  creado_en    timestamptz not null default now(),
  estado       text not null default 'pendiente_pago'
               check (estado in ('pendiente_pago','pagado','preparando','entregado','cancelado','rechazado')),
  nombre       text not null,
  email        text not null,
  telefono     text not null,
  entrega      text not null check (entrega in ('retiro','despacho')),
  direccion    text,
  comuna       text,
  notas        text,
  -- [{"producto_id","nombre","talla","cantidad","precio"}]
  items        jsonb not null,
  total        integer not null check (total > 0),
  proveedor    text,                                            -- 'mercadopago' | 'whatsapp'
  pago_id      text,
  pago_estado  text,
  pagado_en    timestamptz,
  notas_admin  text
);
create index pedidos_creado_en_idx on public.pedidos (creado_en desc);
create index pedidos_estado_idx on public.pedidos (estado);

alter table public.productos enable row level security;
alter table public.pedidos   enable row level security;

-- Descuenta el stock de un pedido una sola vez (se llama al confirmarse el pago).
create or replace function public.descontar_stock(p_pedido uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  it jsonb;
begin
  for it in select jsonb_array_elements(items) from pedidos where id = p_pedido loop
    update productos p
       set variantes = (
         select jsonb_agg(
                  case when v->>'talla' = it->>'talla' and v->'stock' <> 'null'::jsonb
                       then jsonb_set(v, '{stock}', to_jsonb(greatest((v->>'stock')::int - (it->>'cantidad')::int, 0)))
                       else v end
                  order by ord)
           from jsonb_array_elements(p.variantes) with ordinality as t(v, ord))
     where p.id = (it->>'producto_id')::uuid;
  end loop;
end;
$$;
revoke all on function public.descontar_stock(uuid) from public, anon, authenticated;
