-- Surpass: esquema inicial para facturas PDF

create extension if not exists "pgcrypto";

create table if not exists public.facturas (
  id uuid primary key default gen_random_uuid(),
  numero_factura text not null,
  proveedor text not null,
  ruc_emisor text,
  fecha_emision text,
  fecha_vencimiento text,
  total_pagar numeric(12, 2),
  moneda text not null default 'PEN',
  archivo_url text,
  archivo_nombre text not null,
  archivo_path text,
  estado text not null default 'parsed' check (estado in ('parsed', 'pending')),
  subido_por uuid references auth.users(id),
  created_at timestamptz not null default now()
);

create table if not exists public.factura_items (
  id uuid primary key default gen_random_uuid(),
  factura_id uuid not null references public.facturas(id) on delete cascade,
  item text not null,
  cantidad numeric(12, 2) not null,
  unidad text not null,
  codigo text not null,
  descripcion text not null,
  valor_unitario numeric(12, 2) not null,
  descuento numeric(12, 2) not null default 0,
  precio_unitario numeric(12, 2) not null,
  valor_venta numeric(12, 2) not null
);

create index if not exists facturas_created_at_idx on public.facturas (created_at desc);
create index if not exists factura_items_factura_id_idx on public.factura_items (factura_id);

alter table public.facturas enable row level security;
alter table public.factura_items enable row level security;

create policy "Usuarios autenticados pueden leer facturas"
  on public.facturas for select
  to authenticated
  using (true);

create policy "Usuarios autenticados pueden insertar facturas"
  on public.facturas for insert
  to authenticated
  with check (true);

create policy "Usuarios autenticados pueden leer items"
  on public.factura_items for select
  to authenticated
  using (true);

create policy "Usuarios autenticados pueden insertar items"
  on public.factura_items for insert
  to authenticated
  with check (true);

insert into storage.buckets (id, name, public)
values ('facturas', 'facturas', true)
on conflict (id) do nothing;

create policy "Usuarios autenticados pueden subir PDFs"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'facturas');

create policy "Usuarios autenticados pueden leer PDFs"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'facturas');
