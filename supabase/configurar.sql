-- Rode uma vez no Supabase: SQL Editor > New query > cole tudo > Run.

-- Quem pode editar o site (só os usuários listados aqui)
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade
);
alter table public.admins enable row level security;

-- Conteúdo do site: uma única linha (id = 1) com tudo em JSON
create table if not exists public.site (
  id int primary key check (id = 1),
  dados jsonb not null,
  atualizado_em timestamptz not null default now()
);
alter table public.site enable row level security;

create policy "site: leitura pública" on public.site
  for select using (true);

create policy "site: só admin grava" on public.site
  for insert with check (auth.uid() in (select user_id from public.admins));

create policy "site: só admin atualiza" on public.site
  for update using (auth.uid() in (select user_id from public.admins));

-- Fotos e vídeos enviados pelo painel
insert into storage.buckets (id, name, public)
values ('midia', 'midia', true)
on conflict (id) do nothing;

create policy "midia: só admin envia" on storage.objects
  for insert with check (bucket_id = 'midia' and auth.uid() in (select user_id from public.admins));

create policy "midia: só admin altera" on storage.objects
  for update using (bucket_id = 'midia' and auth.uid() in (select user_id from public.admins));

create policy "midia: só admin apaga" on storage.objects
  for delete using (bucket_id = 'midia' and auth.uid() in (select user_id from public.admins));
