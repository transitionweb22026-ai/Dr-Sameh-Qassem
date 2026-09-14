// One-time import: seeds the booking-card fields (title/text/CTA label) on
// every page's hero with the shared default copy (src/locales/*.json's
// "common.bookingCard"). Requires the 2026_03_hero_booking_card.sql
// migration to have been applied first. Safe to re-run.
//
// Usage: node scripts/import-booking-card-content.mjs

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

function loadEnvLocal() {
  const envPath = path.join(root, ".env.local");
  const content = readFileSync(envPath, "utf8");
  const env = {};
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    env[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
  }
  return env;
}

const env = loadEnvLocal();
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const en = JSON.parse(readFileSync(path.join(root, "src/locales/en.json"), "utf8"));
const ar = JSON.parse(readFileSync(path.join(root, "src/locales/ar.json"), "utf8"));

const PAGES_WITH_BOOKING_CARD = ["home", "about", "services", "reviews", "videos", "articles", "contact"];

async function main() {
  const { data: pages, error: pagesError } = await supabase
    .from("pages")
    .select("id, slug")
    .in("slug", PAGES_WITH_BOOKING_CARD);
  if (pagesError) throw pagesError;

  for (const page of pages) {
    const { error } = await supabase
      .from("page_heroes")
      .update({
        booking_card_title_en: en.common.bookingCard.title,
        booking_card_title_ar: ar.common.bookingCard.title,
        booking_card_text_en: en.common.bookingCard.text,
        booking_card_text_ar: ar.common.bookingCard.text,
        booking_card_cta_en: en.common.bookingCard.cta,
        booking_card_cta_ar: ar.common.bookingCard.cta,
      })
      .eq("page_id", page.id);
    if (error) throw error;
    console.log(`✓ ${page.slug} booking card`);
  }

  console.log("\nDone. Booking card content imported into Supabase.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
