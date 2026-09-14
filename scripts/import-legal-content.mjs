// One-time import: copies the Privacy Policy and Terms pages' real content
// from src/locales/{en,ar}.json into the CMS tables. Each legal section
// becomes a top-level content item, with its bullet list as nested child
// items (parent_id) — the same one-level-nesting pattern used for Services'
// disciplines/conditions and Articles' body paragraphs. Safe to re-run.
//
// The "last updated" date has no matching page_heroes column and stays as
// static copy (t("hero.lastUpdated")) rather than adding a new column for
// a single low-churn field.
//
// Usage: node scripts/import-legal-content.mjs

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

async function importLegalPage(slug, localeKey, sectionKey) {
  const { data: page, error: pageError } = await supabase.from("pages").select("id").eq("slug", slug).single();
  if (pageError) throw pageError;
  const pageId = page.id;
  console.log(`${slug} page_id:`, pageId);

  const heroEn = en[localeKey].hero;
  const heroAr = ar[localeKey].hero;
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
      primary_cta_label_en: null,
      primary_cta_label_ar: null,
      primary_cta_href: null,
      secondary_cta_label_en: null,
      secondary_cta_label_ar: null,
      secondary_cta_href: null,
      image_url: null,
      bg_3d_element: null,
      show_doctor: false,
      show_stats_bar: false,
      follow_label_en: null,
      follow_label_ar: null,
    },
    { onConflict: "page_id" }
  );
  if (heroError) throw heroError;
  console.log("✓ hero");

  const { data: section, error: sectionError } = await supabase
    .from("sections")
    .upsert(
      { page_id: pageId, section_key: sectionKey, order_index: 0, eyebrow_en: null, eyebrow_ar: null, title_en: null, title_ar: null },
      { onConflict: "page_id,section_key" }
    )
    .select("id")
    .single();
  if (sectionError) throw sectionError;
  const sectionId = section.id;

  const { error: delBulletError } = await supabase
    .from("content_items")
    .delete()
    .eq("section_id", sectionId)
    .eq("item_type", "bullet");
  if (delBulletError) throw delBulletError;
  const { error: delSecError } = await supabase
    .from("content_items")
    .delete()
    .eq("section_id", sectionId)
    .eq("item_type", "legalSection");
  if (delSecError) throw delSecError;

  const sectionsEn = en[localeKey].sections;
  const sectionsAr = ar[localeKey].sections;

  for (let i = 0; i < sectionsEn.length; i++) {
    const item = sectionsEn[i];
    const itemAr = sectionsAr[i];
    const { data: legalRow, error: legalInsError } = await supabase
      .from("content_items")
      .insert({
        section_id: sectionId,
        item_type: "legalSection",
        icon: item.icon,
        title_en: item.title,
        title_ar: itemAr.title,
        text_en: item.text,
        text_ar: itemAr.text,
        order_index: i,
        meta: {},
      })
      .select("id")
      .single();
    if (legalInsError) throw legalInsError;

    const bulletRows = (item.list ?? []).map((bullet, j) => ({
      section_id: sectionId,
      parent_id: legalRow.id,
      item_type: "bullet",
      text_en: bullet,
      text_ar: itemAr.list[j],
      order_index: j,
      meta: {},
    }));
    if (bulletRows.length > 0) {
      const { error: bulletInsError } = await supabase.from("content_items").insert(bulletRows);
      if (bulletInsError) throw bulletInsError;
    }
  }
  console.log(`✓ ${sectionKey} + ${sectionsEn.length} legal sections (with bullets)`);
}

async function main() {
  await importLegalPage("privacy-policy", "privacyPolicy", "legalSections");
  await importLegalPage("terms", "terms", "legalSections");
  console.log("\nDone. Privacy Policy and Terms content imported into Supabase.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
