-- Ejecutar en Supabase SQL Editor

-- Tabla RSVP
create table if not exists rsvps (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  confirmed_at timestamp with time zone default timezone('utc'::text, now()),
  message text,
  bringing_swimsuit boolean default false
);

-- Habilitar realtime para actualizaciones en vivo
alter publication supabase_realtime add table rsvps;

-- Política RLS: permitir inserts anónimos (para RSVP públicos)
alter table rsvps enable row level security;

create policy "Allow anonymous inserts" on rsvps
  for insert with check (true);

create policy "Allow anonymous reads" on rsvps
  for select using (true);
