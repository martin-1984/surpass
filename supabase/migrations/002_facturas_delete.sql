-- Permite reemplazar facturas duplicadas (mismo proveedor + número)

create policy "Usuarios autenticados pueden eliminar facturas"
  on public.facturas for delete
  to authenticated
  using (true);

create policy "Usuarios autenticados pueden eliminar items"
  on public.factura_items for delete
  to authenticated
  using (true);

create policy "Usuarios autenticados pueden eliminar PDFs"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'facturas');
