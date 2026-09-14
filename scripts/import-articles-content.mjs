// One-time import: copies the Articles page's real content from
// src/locales/{en,ar}.json into the CMS tables. The "featured" article
// becomes order_index 0 of the unified articlesSection list (the public page
// always treats the first item as the featured card), and every article's
// full body becomes a nested list of "paragraph" child items so the
// per-article detail page can render it. Safe to re-run.
//
// Usage: node scripts/import-articles-content.mjs

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
    .eq("slug", "articles")
    .single();
  if (pageError) throw pageError;
  const pageId = page.id;
  console.log("articles page_id:", pageId);

  const heroEn = en.articlesPage.hero;
  const heroAr = ar.articlesPage.hero;
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
      primary_cta_href: "/contact",
      secondary_cta_label_en: heroEn.secondaryCta,
      secondary_cta_label_ar: heroAr.secondaryCta,
      secondary_cta_href: "#articles-grid",
      image_url: heroEn.image,
      bg_3d_element: "network",
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

  // 1. Articles (featured first, then the rest) — each with nested paragraphs -
  const articlesSectionId = await upsertSection(
    "articlesSection",
    { eyebrow_en: null, eyebrow_ar: null, title_en: null, title_ar: null },
    0
  );

  const { error: delParaError } = await supabase
    .from("content_items")
    .delete()
    .eq("section_id", articlesSectionId)
    .eq("item_type", "paragraph");
  if (delParaError) throw delParaError;
  const { error: delArticleError } = await supabase
    .from("content_items")
    .delete()
    .eq("section_id", articlesSectionId)
    .eq("item_type", "article");
  if (delArticleError) throw delArticleError;

  const allEn = [en.articlesPage.featured, ...en.articlesPage.items];
  const allAr = [ar.articlesPage.featured, ...ar.articlesPage.items];

  for (let i = 0; i < allEn.length; i++) {
    const item = allEn[i];
    const itemAr = allAr[i];
    const { data: articleRow, error: articleInsError } = await supabase
      .from("content_items")
      .insert({
        section_id: articlesSectionId,
        item_type: "article",
        image_url: item.image ?? null,
        title_en: item.title,
        title_ar: itemAr.title,
        text_en: item.text,
        text_ar: itemAr.text,
        order_index: i,
        meta: {
          slug: item.slug,
          category_en: item.category,
          category_ar: itemAr.category,
          date_en: item.date,
          date_ar: itemAr.date,
          read_time_en: item.readTime,
          read_time_ar: itemAr.readTime,
        },
      })
      .select("id")
      .single();
    if (articleInsError) throw articleInsError;

    const paragraphRows = item.content.map((paragraph, j) => ({
      section_id: articlesSectionId,
      parent_id: articleRow.id,
      item_type: "paragraph",
      text_en: paragraph,
      text_ar: itemAr.content[j],
      order_index: j,
      meta: {},
    }));
    const { error: paraInsError } = await supabase.from("content_items").insert(paragraphRows);
    if (paraInsError) throw paraInsError;
  }
  console.log(`✓ articlesSection + ${allEn.length} articles (with paragraphs)`);

  // 2. Stats (admin-editable; not currently displayed on the live page) ---------
  const statsSectionId = await upsertSection(
    "stats",
    { eyebrow_en: null, eyebrow_ar: null, title_en: null, title_ar: null },
    1
  );
  const { error: delStatsError } = await supabase
    .from("content_items")
    .delete()
    .eq("section_id", statsSectionId)
    .eq("item_type", "stat");
  if (delStatsError) throw delStatsError;
  const { error: statsInsError } = await supabase.from("content_items").insert(
    en.articlesPage.stats.map((item, i) => ({
      section_id: statsSectionId,
      item_type: "stat",
      icon: item.icon,
      title_en: item.label,
      title_ar: ar.articlesPage.stats[i].label,
      order_index: i,
      meta: { value: item.value, suffix: item.suffix },
    }))
  );
  if (statsInsError) throw statsInsError;
  console.log("✓ stats + items");

  console.log("\nDone. Articles page content imported into Supabase.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
