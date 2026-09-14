-- Every page's hero renders a floating "booking card" (title, supporting
-- text, and a CTA button label) that was previously hard-coded from the
-- shared `common.bookingCard` translation on every page. Add typed columns
-- (matching the existing `follow_label_en/ar` pattern) so each page's hero
-- can carry — and the admin can edit — its own copy. Additive and safe to
-- run against the already-migrated database.

alter table public.page_heroes
  add column if not exists booking_card_title_en text,
  add column if not exists booking_card_title_ar text,
  add column if not exists booking_card_text_en text,
  add column if not exists booking_card_text_ar text,
  add column if not exists booking_card_cta_en text,
  add column if not exists booking_card_cta_ar text;
