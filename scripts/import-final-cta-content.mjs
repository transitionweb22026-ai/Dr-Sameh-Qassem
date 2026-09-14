// One-time import: seeds the "finalCta" section (title / title highlight /
// text) for every page that renders a FinalCta on its public page. Six pages
// share the same default copy (src/locales/*.json's top-level "finalCta"
// namespace); Contact keeps its existing custom override. Safe to re-run.
//
// Usage: node scripts/import-final-cta-content.mjs

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

async function upsertFinalCta(slug, fields) {
  const { data: page, error: pageError } = await supabase.from("pages").select("id").eq("slug", slug).single();
  if (pageError) throw pageError;

  const { error } = await supabase.from("sections").upsert(
    { page_id: page.id, section_key: "finalCta", order_index: 999, eyebrow_en: null, eyebrow_ar: null, ...fields },
    { onConflict: "page_id,section_key" }
  );
  if (error) throw error;
  console.log(`✓ ${slug} finalCta`);
}

async function main() {
  const shared = {
    title_en: en.finalCta.titleLine1,
    title_ar: ar.finalCta.titleLine1,
    title_highlight_en: en.finalCta.titleHighlight,
    title_highlight_ar: ar.finalCta.titleHighlight,
    text_en: en.finalCta.subtitle,
    text_ar: ar.finalCta.subtitle,
    image_url: null,
    meta: {},
  };

  for (const slug of ["home", "about", "services", "reviews", "videos", "articles"]) {
    await upsertFinalCta(slug, shared);
  }

  await upsertFinalCta("contact", {
    title_en: en.contact.finalCta.title,
    title_ar: ar.contact.finalCta.title,
    title_highlight_en: null,
    title_highlight_ar: null,
    text_en: en.contact.finalCta.text,
    text_ar: ar.contact.finalCta.text,
    image_url: null,
    meta: {},
  });

  console.log("\nDone. Final CTA content imported into Supabase.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
