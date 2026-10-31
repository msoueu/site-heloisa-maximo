-- Rode uma vez no Supabase: SQL Editor > New query > cole tudo > Run.
-- Pode rodar de novo sem problema. Não apaga nenhum conteúdo.

-- 1. Corrige o painel: sem esta regra, a conta da advogada não conseguia se ver na lista de
-- administradoras, e o banco recusava toda gravação e todo envio de foto
drop policy if exists "admins: vê a própria linha" on public.admins;
create policy "admins: vê a própria linha" on public.admins
  for select to authenticated using (user_id = auth.uid());

-- 2. Autoriza a conta da advogada. O cadastro público está desligado, então só existem as contas
-- criadas no Supabase. A última consulta deste arquivo mostra quem ficou com acesso
insert into public.admins (user_id)
select id from auth.users
on conflict (user_id) do nothing;

-- 3. Validação no banco: recusa conteúdo que não seja um objeto JSON ou que passe de 2 MB
alter table public.site drop constraint if exists site_dados_validos;
alter table public.site add constraint site_dados_validos
  check (jsonb_typeof(dados) = 'object' and pg_column_size(dados) < 2000000);

-- 4. Quem pode fazer o quê com o conteúdo
drop policy if exists "site: leitura pública" on public.site;
drop policy if exists "site: só admin grava" on public.site;
drop policy if exists "site: só admin atualiza" on public.site;

create policy "site: leitura pública" on public.site
  for select using (true);
create policy "site: só admin grava" on public.site
  for insert to authenticated
  with check (auth.uid() in (select user_id from public.admins));
create policy "site: só admin atualiza" on public.site
  for update to authenticated
  using (auth.uid() in (select user_id from public.admins))
  with check (auth.uid() in (select user_id from public.admins));

-- 5. Fotos e vídeos: tamanho máximo e só estes formatos. SVG fica de fora porque pode conter script
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'midia', 'midia', true, 52428800,
  array['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "midia: só admin envia" on storage.objects;
drop policy if exists "midia: só admin altera" on storage.objects;
drop policy if exists "midia: só admin apaga" on storage.objects;

create policy "midia: só admin envia" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'midia' and auth.uid() in (select user_id from public.admins));
create policy "midia: só admin altera" on storage.objects
  for update to authenticated
  using (bucket_id = 'midia' and auth.uid() in (select user_id from public.admins))
  with check (bucket_id = 'midia' and auth.uid() in (select user_id from public.admins));
create policy "midia: só admin apaga" on storage.objects
  for delete to authenticated
  using (bucket_id = 'midia' and auth.uid() in (select user_id from public.admins));

-- 6. Confira: deve aparecer só o e-mail da advogada
select u.email as "contas com acesso ao painel"
from public.admins a join auth.users u on u.id = a.user_id;
