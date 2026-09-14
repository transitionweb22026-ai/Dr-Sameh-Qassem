-- ============================================================================
-- Dr. Sameh Qassem — CMS schema
-- Full-site content model: every page, every section, every repeatable card
-- on the public website becomes an editable database record.
--
-- Design notes for whoever maintains this next:
--   - `pages`        one row per public route (home, about, services, ...).
--   - `page_heroes`  1:1 with `pages` — the hero banner is a fixed shape
--                    (eyebrow/title/subtitle/CTAs/image) on every page, so it
--                    gets its own typed table instead of living in `sections`.
--   - `sections`     one row per named content block within a page (the
--                    "SectionHeading" pattern used everywhere on the site:
--                    eyebrow + title + optional text). A page has many.
--   - `content_items` the repeatable cards/bullets/stats/FAQs/etc *inside* a
--                    section. Shapes vary a lot (a stat needs a number+suffix,
--                    an article needs a slug+body, a discipline needs nested
--                    conditions) so common fields are real columns and the
--                    rest lives in `meta jsonb`. `parent_id` self-references
--                    this table so one level of nesting (e.g. a service
--                    discipline's list of conditions) doesn't need its own
--                    table.
--   - `media`        tracks files uploaded through the admin dashboard to the
--                    `cms-media` storage bucket, independent of ad-hoc image
--                    URLs typed into a field.
--   - `admin_profiles` marks which authenticated Supabase Auth users are
--                    allowed to write CMS content. Being logged in is not
--                    enough on its own — see the RLS section below.
--
-- Bootstrapping the first admin (there is no UI for this on purpose):
--   1. Create the user in Supabase Auth (dashboard → Authentication → Add
--      user, or supabase.auth.admin.createUser from a trusted script).
--   2. Run:  insert into public.admin_profiles (user_id) values ('<uuid>');
-- ============================================================================

create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
-- 1. Shared trigger: keep `updated_at` accurate on every write.
-- ----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ----------------------------------------------------------------------------
-- 2. admin_profiles — who is allowed to write CMS content.
-- ----------------------------------------------------------------------------
create table if not exists public.admin_profiles (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  full_name  text,
  role       text not null default 'admin',
  created_at timestamptz not null default now()
);

-- Small, fixed-cardinality lookup helper used by every write policy below.
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.admin_profiles where user_id = auth.uid()
  );
$$;

-- ----------------------------------------------------------------------------
-- 3. pages — one row per public route.
-- ----------------------------------------------------------------------------
create table if not exists public.pages (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  name_en     text not null,
  name_ar     text not null,
  order_index integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists pages_order_index_idx on public.pages (order_index);

drop trigger if exists set_updated_at on public.pages;
create trigger set_updated_at
  before update on public.pages
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- 4. page_heroes — 1:1 hero banner per page.
-- ----------------------------------------------------------------------------
create table if not exists public.page_heroes (
  id                     uuid primary key default gen_random_uuid(),
  page_id                uuid not null unique references public.pages (id) on delete cascade,
  eyebrow_en             text,
  eyebrow_ar             text,
  title_en               text not null default '',
  title_ar               text not null default '',
  title_highlight_en     text,
  title_highlight_ar     text,
  subtitle_en            text,
  subtitle_ar            text,
  primary_cta_label_en   text,
  primary_cta_label_ar   text,
  primary_cta_href       text,
  secondary_cta_label_en text,
  secondary_cta_label_ar text,
  secondary_cta_href     text,
  image_url              text,
  bg_3d_element          text,
  show_doctor            boolean not null default false,
  show_stats_bar         boolean not null default false,
  follow_label_en        text,
  follow_label_ar        text,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

create index if not exists page_heroes_page_id_idx on public.page_heroes (page_id);

drop trigger if exists set_updated_at on public.page_heroes;
create trigger set_updated_at
  before update on public.page_heroes
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- 5. sections — named content blocks within a page (eyebrow/title/text).
-- ----------------------------------------------------------------------------
create table if not exists public.sections (
  id                 uuid primary key default gen_random_uuid(),
  page_id            uuid not null references public.pages (id) on delete cascade,
  section_key        text not null,
  eyebrow_en         text,
  eyebrow_ar         text,
  title_en           text,
  title_ar           text,
  title_highlight_en text,
  title_highlight_ar text,
  text_en            text,
  text_ar            text,
  order_index        integer not null default 0,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  unique (page_id, section_key)
);

create index if not exists sections_page_id_idx on public.sections (page_id);
create index if not exists sections_page_order_idx on public.sections (page_id, order_index);

drop trigger if exists set_updated_at on public.sections;
create trigger set_updated_at
  before update on public.sections
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- 6. content_items — repeatable cards/bullets/stats/FAQs/articles/etc.
-- ----------------------------------------------------------------------------
create table if not exists public.content_items (
  id           uuid primary key default gen_random_uuid(),
  section_id   uuid not null references public.sections (id) on delete cascade,
  parent_id    uuid references public.content_items (id) on delete cascade,
  item_type    text not null,
  icon         text,
  image_url    text,
  title_en     text,
  title_ar     text,
  subtitle_en  text,
  subtitle_ar  text,
  text_en      text,
  text_ar      text,
  href         text,
  order_index  integer not null default 0,
  -- Type-specific extras that don't warrant their own column, e.g.
  -- { "value": 5000, "suffix": "+" } for a stat, or
  -- { "slug": "...", "content_en": [...], "content_ar": [...], "date": "...",
  --   "read_time": "...", "category_en": "...", "category_ar": "..." }
  -- for an article.
  meta         jsonb not null default '{}'::jsonb,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists content_items_section_id_idx on public.content_items (section_id);
create index if not exists content_items_parent_id_idx on public.content_items (parent_id);
create index if not exists content_items_item_type_idx on public.content_items (item_type);
create index if not exists content_items_section_order_idx on public.content_items (section_id, order_index);
create index if not exists content_items_meta_gin_idx on public.content_items using gin (meta);

drop trigger if exists set_updated_at on public.content_items;
create trigger set_updated_at
  before update on public.content_items
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- 7. media — files uploaded through the admin dashboard.
-- ----------------------------------------------------------------------------
create table if not exists public.media (
  id          uuid primary key default gen_random_uuid(),
  bucket_path text not null unique,
  url         text not null,
  alt_text_en text,
  alt_text_ar text,
  uploaded_by uuid references auth.users (id) on delete set null,
  created_at  timestamptz not null default now()
);

create index if not exists media_uploaded_by_idx on public.media (uploaded_by);

-- ----------------------------------------------------------------------------
-- 8. consultation_requests already exists (supabase/schema.sql) — add the
--    missing admin-read policy and updated_at bookkeeping without touching
--    its existing public-insert policy.
-- ----------------------------------------------------------------------------
create table if not exists public.consultation_requests (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  phone      text not null,
  service    text,
  clinic     text,
  message    text,
  locale     text,
  created_at timestamptz not null default now()
);

alter table public.consultation_requests enable row level security;

drop policy if exists "Public can submit consultation requests" on public.consultation_requests;
create policy "Public can submit consultation requests"
  on public.consultation_requests
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Admins can read consultation requests" on public.consultation_requests;
create policy "Admins can read consultation requests"
  on public.consultation_requests
  for select
  to authenticated
  using (public.is_admin());

-- ============================================================================
-- Row Level Security
-- Public (anon + authenticated): read-only SELECT on content tables.
-- Admins only (authenticated + admin_profiles row): INSERT/UPDATE/DELETE.
-- ============================================================================

alter table public.admin_profiles  enable row level security;
alter table public.pages           enable row level security;
alter table public.page_heroes     enable row level security;
alter table public.sections        enable row level security;
alter table public.content_items   enable row level security;
alter table public.media           enable row level security;

-- admin_profiles: an admin can see the roster; nobody can self-promote.
drop policy if exists "Admins can read admin roster" on public.admin_profiles;
create policy "Admins can read admin roster"
  on public.admin_profiles
  for select
  to authenticated
  using (public.is_admin());
-- No insert/update/delete policy is defined for admin_profiles on purpose:
-- granting admin access is a service-role-only / SQL-console-only action.

-- pages
drop policy if exists "Public can read pages" on public.pages;
create policy "Public can read pages"
  on public.pages for select
  to anon, authenticated
  using (true);

drop policy if exists "Admins can insert pages" on public.pages;
create policy "Admins can insert pages"
  on public.pages for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "Admins can update pages" on public.pages;
create policy "Admins can update pages"
  on public.pages for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins can delete pages" on public.pages;
create policy "Admins can delete pages"
  on public.pages for delete
  to authenticated
  using (public.is_admin());

-- page_heroes
drop policy if exists "Public can read page_heroes" on public.page_heroes;
create policy "Public can read page_heroes"
  on public.page_heroes for select
  to anon, authenticated
  using (true);

drop policy if exists "Admins can insert page_heroes" on public.page_heroes;
create policy "Admins can insert page_heroes"
  on public.page_heroes for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "Admins can update page_heroes" on public.page_heroes;
create policy "Admins can update page_heroes"
  on public.page_heroes for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins can delete page_heroes" on public.page_heroes;
create policy "Admins can delete page_heroes"
  on public.page_heroes for delete
  to authenticated
  using (public.is_admin());

-- sections
drop policy if exists "Public can read sections" on public.sections;
create policy "Public can read sections"
  on public.sections for select
  to anon, authenticated
  using (true);

drop policy if exists "Admins can insert sections" on public.sections;
create policy "Admins can insert sections"
  on public.sections for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "Admins can update sections" on public.sections;
create policy "Admins can update sections"
  on public.sections for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins can delete sections" on public.sections;
create policy "Admins can delete sections"
  on public.sections for delete
  to authenticated
  using (public.is_admin());

-- content_items
drop policy if exists "Public can read content_items" on public.content_items;
create policy "Public can read content_items"
  on public.content_items for select
  to anon, authenticated
  using (true);

drop policy if exists "Admins can insert content_items" on public.content_items;
create policy "Admins can insert content_items"
  on public.content_items for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "Admins can update content_items" on public.content_items;
create policy "Admins can update content_items"
  on public.content_items for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins can delete content_items" on public.content_items;
create policy "Admins can delete content_items"
  on public.content_items for delete
  to authenticated
  using (public.is_admin());

-- media
drop policy if exists "Public can read media" on public.media;
create policy "Public can read media"
  on public.media for select
  to anon, authenticated
  using (true);

drop policy if exists "Admins can insert media" on public.media;
create policy "Admins can insert media"
  on public.media for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "Admins can delete media" on public.media;
create policy "Admins can delete media"
  on public.media for delete
  to authenticated
  using (public.is_admin());

-- ============================================================================
-- Storage: `cms-media` bucket — public read, admin-only write.
-- ============================================================================

insert into storage.buckets (id, name, public)
values ('cms-media', 'cms-media', true)
on conflict (id) do nothing;

drop policy if exists "Public can read cms-media" on storage.objects;
create policy "Public can read cms-media"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'cms-media');

drop policy if exists "Admins can upload cms-media" on storage.objects;
create policy "Admins can upload cms-media"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'cms-media' and public.is_admin());

drop policy if exists "Admins can update cms-media" on storage.objects;
create policy "Admins can update cms-media"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'cms-media' and public.is_admin())
  with check (bucket_id = 'cms-media' and public.is_admin());

drop policy if exists "Admins can delete cms-media" on storage.objects;
create policy "Admins can delete cms-media"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'cms-media' and public.is_admin());

-- ============================================================================
-- Seed: the 9 public pages. Sections/content_items are intentionally left
-- empty here — import the current src/locales/{ar,en}.json content with a
-- one-time script rather than hand-written INSERTs (ask for it separately).
-- ============================================================================

insert into public.pages (slug, name_en, name_ar, order_index) values
  ('home',           'Home',           'الرئيسية',                 0),
  ('about',          'About',          'عن الدكتور',                1),
  ('services',       'Services',       'خدمات المرضى',              2),
  ('reviews',        'Reviews',        'آراء المرضى',               3),
  ('videos',         'Videos',         'الفيديوهات',                4),
  ('articles',       'Articles',       'المقالات',                  5),
  ('contact',        'Contact',        'تواصل معنا',                6),
  ('privacy-policy', 'Privacy Policy', 'سياسة الخصوصية',            7),
  ('terms',          'Terms',          'الشروط والأحكام',           8)
on conflict (slug) do nothing;
