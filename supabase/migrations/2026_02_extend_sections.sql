-- Extend `sections` with the same flexibility `content_items` already has:
-- some section headers carry their own image (e.g. Home's "About the
-- Surgeon" preview photo) or extra settings (a CTA label/href, a video URL)
-- that don't fit the eyebrow/title/text shape. Additive and safe to run
-- against the already-migrated database.

alter table public.sections
  add column if not exists image_url text,
  add column if not exists meta jsonb not null default '{}'::jsonb;

create index if not exists sections_meta_gin_idx on public.sections using gin (meta);
