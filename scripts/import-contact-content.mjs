// One-time import: copies the Contact page's real content from
// src/locales/{en,ar}.json into the CMS tables. Only the hero and the two
// registered admin sections (faq, stats) are in CMS scope — ClinicInfo,
// ClinicMap, and BookingForm read from site-wide config, not per-page
// content, matching CMS_SECTION_REGISTRY. Safe to re-run.
//
// Usage: node scripts/import-contact-content.mjs

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

async function main() {
  const { data: page, error: pageError } = await supabase
    .from("pages")
    .select("id")
    .eq("slug", "contact")
    .single();
  if (pageError) throw pageError;
  const pageId = page.id;
  console.log("contact page_id:", pageId);

  const heroEn = en.contact.hero;
  const heroAr = ar.contact.hero;
  const { error: heroError } = await supabase.from("page_heroes").upsert(
    {
      page_id: pageId,
      eyebrow_en: null,
      eyebrow_ar: null,
      title_en: heroEn.title,
      title_ar: heroAr.title,
      title_highlight_en: heroEn.titleHighlight,
      title_highlight_ar: heroAr.titleHighlight,
      subtitle_en: heroEn.subtitle,
      subtitle_ar: heroAr.subtitle,
      primary_cta_label_en: heroEn.primaryCta,
      primary_cta_label_ar: heroAr.primaryCta,
      primary_cta_href: "tel:+201001234567",
      secondary_cta_label_en: heroEn.secondaryCta,
      secondary_cta_label_ar: heroAr.secondaryCta,
      secondary_cta_href: "#booking-form",
      image_url: heroEn.image,
      bg_3d_element: "skull",
      show_doctor: true,
      show_stats_bar: false,
      follow_label_en: en.common.followUs,
      follow_label_ar: ar.common.followUs,
    },
    { onConflict: "page_id" }
  );
  if (heroError) throw heroError;
  console.log("✓ hero");

  async function upsertSection(sectionKey, fields, orderIndex) {
    const { data, error } = await supabase
      .from("sections")
      .upsert(
        { page_id: pageId, section_key: sectionKey, order_index: orderIndex, ...fields },
        { onConflict: "page_id,section_key" }
      )
      .select("id")
      .single();
    if (error) throw error;
    return data.id;
  }

  async function replaceItems(sectionId, itemType, items) {
    const { error: delError } = await supabase
      .from("content_items")
      .delete()
      .eq("section_id", sectionId)
      .eq("item_type", itemType);
    if (delError) throw delError;
    if (items.length === 0) return;
    const { error: insError } = await supabase.from("content_items").insert(items);
    if (insError) throw insError;
  }

  // 1. FAQ ------------------------------------------------------------------------
  const faqEn = en.contact.faq;
  const faqAr = ar.contact.faq;
  const faqSectionId = await upsertSection(
    "faq",
    { eyebrow_en: null, eyebrow_ar: null, title_en: faqEn.title, title_ar: faqAr.title },
    0
  );
  await replaceItems(
    faqSectionId,
    "faq",
    faqEn.items.map((item, i) => ({
      section_id: faqSectionId,
      item_type: "faq",
      title_en: item.q,
      title_ar: faqAr.items[i].q,
      text_en: item.a,
      text_ar: faqAr.items[i].a,
      order_index: i,
      meta: {},
    }))
  );
  console.log("✓ faq + items");

  // 2. Stats (admin-editable; not currently displayed on the live page) ---------
  const statsSectionId = await upsertSection(
    "stats",
    { eyebrow_en: null, eyebrow_ar: null, title_en: null, title_ar: null },
    1
  );
  await replaceItems(
    statsSectionId,
    "stat",
    en.contact.stats.map((item, i) => ({
      section_id: statsSectionId,
      item_type: "stat",
      icon: item.icon,
      title_en: item.label,
      title_ar: ar.contact.stats[i].label,
      order_index: i,
      meta: { value: item.value, suffix: item.suffix },
    }))
  );
  console.log("✓ stats + items");

  console.log("\nDone. Contact page content imported into Supabase.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
