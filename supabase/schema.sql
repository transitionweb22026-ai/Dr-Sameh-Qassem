-- Consultation / booking requests submitted from the Contact page.
create table if not exists consultation_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  service text,
  clinic text,
  message text,
  locale text,
  created_at timestamptz not null default now()
);

alter table consultation_requests enable row level security;

-- Allow anonymous inserts from the public website (booking form),
-- but never allow the public anon key to read submissions back.
create policy "Public can submit consultation requests"
  on consultation_requests
  for insert
  to anon
  with check (true);
