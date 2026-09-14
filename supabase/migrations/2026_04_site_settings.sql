-- Site-wide contact details (phone/WhatsApp number and social links) were
-- previously hard-coded in src/lib/site-config.ts and reused across many
-- pages (hero booking card, footer, floating actions, mobile drawer,
-- contact page). A single settings row makes them admin-editable in one
-- place, with every consumer reading the same source of truth.
--
-- A fixed single row (id = 1) rather than a free-form table: there is
-- exactly one site, so there is exactly one settings row — no create/delete
-- policies are needed, only select and update.

create table if not exists public.site_settings (
  id int primary key default 1,
  phone_display text not null default '+20 100 123 4567',
  phone_href text not null default 'tel:+201001234567',
  whatsapp_number text not null default '201001234567',
  facebook_url text,
  instagram_url text,
  tiktok_url text,
  updated_at timestamptz not null default now(),
  constraint site_settings_singleton check (id = 1)
);

insert into public.site_settings (id)
values (1)
on conflict (id) do nothing;

alter table public.site_settings enable row level security;

drop policy if exists "Public can read site_settings" on public.site_settings;
create policy "Public can read site_settings"
  on public.site_settings for select
  to anon, authenticated
  using (true);

drop policy if exists "Admins can update site_settings" on public.site_settings;
create policy "Admins can update site_settings"
  on public.site_settings for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());
