// One-time import: copies the Home page's real content from
// src/locales/{en,ar}.json into the CMS tables (page_heroes, sections,
// content_items) so the admin dashboard opens with real data instead of
// empty forms. Safe to re-run — it upserts by natural key every time.
//
// Usage: node scripts/import-home-content.mjs

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
const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const en = JSON.parse(readFileSync(path.join(root, "src/locales/en.json"), "utf8"));
const ar = JSON.parse(readFileSync(path.join(root, "src/locales/ar.json"), "utf8"));

async function main() {
  const { data: page, error: pageError } = await supabase
    .from("pages")
    .select("id")
    .eq("slug", "home")
    .single();
  if (pageError) throw pageError;
  const pageId = page.id;
  console.log("home page_id:", pageId);

  // ---- Hero -----------------------------------------------------------
  const heroEn = en.home.hero;
  const heroAr = ar.home.hero;
  const { error: heroError } = await supabase.from("page_heroes").upsert(
    {
      page_id: pageId,
      eyebrow_en: heroEn.eyebrow,
      eyebrow_ar: heroAr.eyebrow,
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
      secondary_cta_href: "/services",
      image_url: heroEn.image,
      bg_3d_element: "brain",
      show_doctor: true,
      show_stats_bar: false,
      follow_label_en: en.common.followUs,
      follow_label_ar: ar.common.followUs,
    },
    { onConflict: "page_id" }
  );
  if (heroError) throw heroError;
  console.log("✓ hero");

  // ---- Sections + content items ----------------------------------------
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
    // Clear existing items of this type for this section, then insert fresh
    // — simplest way to keep a re-run idempotent without diffing.
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

  // 1. About preview ------------------------------------------------------
  const aboutEn = en.home.about;
  const aboutAr = ar.home.about;
  const aboutSectionId = await upsertSection(
    "about",
    {
      eyebrow_en: aboutEn.eyebrow,
      eyebrow_ar: aboutAr.eyebrow,
      title_en: aboutEn.title,
      title_ar: aboutAr.title,
      title_highlight_en: aboutEn.titleHighlight,
      title_highlight_ar: aboutAr.titleHighlight,
      text_en: aboutEn.text,
      text_ar: aboutAr.text,
      image_url: aboutEn.image,
      meta: { cta_en: aboutEn.cta, cta_ar: aboutAr.cta, video_url: aboutEn.videoUrl, main_title_en: aboutEn.mainTitle, main_title_ar: aboutAr.mainTitle },
    },
    0
  );
  await replaceItems(
    aboutSectionId,
    "bullet",
    aboutEn.bullets.map((b, i) => ({
      section_id: aboutSectionId,
      item_type: "bullet",
      icon: b.icon,
      title_en: b.title,
      title_ar: aboutAr.bullets[i].title,
      text_en: b.text,
      text_ar: aboutAr.bullets[i].text,
      order_index: i,
      meta: {},
    }))
  );
  console.log("✓ about + bullets");

  // 2. Surgeries / Specialties ---------------------------------------------
  const surgeriesEn = en.home.surgeriesSection;
  const surgeriesAr = ar.home.surgeriesSection;
  const surgeriesSectionId = await upsertSection(
    "surgeriesSection",
    {
      ...Object.fromEntries(
        ["eyebrow", "title", "text"].flatMap((k) => [
          [`${k}_en`, surgeriesEn[k] ?? null],
          [`${k}_ar`, surgeriesAr[k] ?? null],
        ])
      ),
      meta: { cta_en: surgeriesEn.cta, cta_ar: surgeriesAr.cta },
    },
    1
  );
  await replaceItems(
    surgeriesSectionId,
    "card",
    surgeriesEn.items.map((item, i) => ({
      section_id: surgeriesSectionId,
      item_type: "card",
      icon: item.icon,
      title_en: item.title,
      title_ar: surgeriesAr.items[i].title,
      text_en: item.text,
      text_ar: surgeriesAr.items[i].text,
      order_index: i,
      meta: { tags_en: item.tags, tags_ar: surgeriesAr.items[i].tags },
    }))
  );
  console.log("✓ surgeriesSection + cards");

  // 3. Treatments -----------------------------------------------------------
  const treatmentsEn = en.home.treatmentsSection;
  const treatmentsAr = ar.home.treatmentsSection;
  const treatmentsSectionId = await upsertSection(
    "treatmentsSection",
    {
      ...Object.fromEntries(
        ["eyebrow", "title", "text"].flatMap((k) => [
          [`${k}_en`, treatmentsEn[k] ?? null],
          [`${k}_ar`, treatmentsAr[k] ?? null],
        ])
      ),
      meta: { cta_en: treatmentsEn.cta, cta_ar: treatmentsAr.cta },
    },
    2
  );
  await replaceItems(
    treatmentsSectionId,
    "treatment",
    treatmentsEn.items.map((item, i) => ({
      section_id: treatmentsSectionId,
      item_type: "treatment",
      image_url: item.image,
      title_en: item.title,
      title_ar: treatmentsAr.items[i].title,
      text_en: item.text,
      text_ar: treatmentsAr.items[i].text,
      order_index: i,
      meta: { note_en: item.note, note_ar: treatmentsAr.items[i].note },
    }))
  );
  console.log("✓ treatmentsSection + items");

  // 4. Testimonials preview (snapshot of the first 3 reviews) ---------------
  const testimonialsEn = en.home.testimonialsSection;
  const testimonialsAr = ar.home.testimonialsSection;
  const testimonialsSectionId = await upsertSection(
    "testimonialsSection",
    {
      ...Object.fromEntries(
        ["eyebrow", "title", "text"].flatMap((k) => [
          [`${k}_en`, testimonialsEn[k] ?? null],
          [`${k}_ar`, testimonialsAr[k] ?? null],
        ])
      ),
      meta: { cta_en: testimonialsEn.cta, cta_ar: testimonialsAr.cta },
    },
    3
  );
  const reviewsEnItems = en.reviews.items.slice(0, 3);
  const reviewsArItems = ar.reviews.items.slice(0, 3);
  await replaceItems(
    testimonialsSectionId,
    "testimonial",
    reviewsEnItems.map((item, i) => ({
      section_id: testimonialsSectionId,
      item_type: "testimonial",
      title_en: item.name,
      title_ar: reviewsArItems[i].name,
      text_en: item.text,
      text_ar: reviewsArItems[i].text,
      order_index: i,
      meta: {
        location_en: item.location,
        location_ar: reviewsArItems[i].location,
        procedure_en: item.procedure,
        procedure_ar: reviewsArItems[i].procedure,
        category_en: item.category,
        category_ar: reviewsArItems[i].category,
        rating: item.rating,
      },
    }))
  );
  console.log("✓ testimonialsSection + preview items");

  // 5. Videos preview (snapshot of the first 3 videos) -----------------------
  const videosEn = en.home.videosSection;
  const videosAr = ar.home.videosSection;
  const videosSectionId = await upsertSection(
    "videosSection",
    {
      ...Object.fromEntries(
        ["eyebrow", "title", "text"].flatMap((k) => [
          [`${k}_en`, videosEn[k] ?? null],
          [`${k}_ar`, videosAr[k] ?? null],
        ])
      ),
      meta: { cta_en: videosEn.cta, cta_ar: videosAr.cta },
    },
    4
  );
  const videoEnItems = en.videosPage.items.slice(0, 3);
  const videoArItems = ar.videosPage.items.slice(0, 3);
  await replaceItems(
    videosSectionId,
    "video",
    videoEnItems.map((item, i) => ({
      section_id: videosSectionId,
      item_type: "video",
      title_en: item.title,
      title_ar: videoArItems[i].title,
      order_index: i,
      meta: {
        category_en: item.category,
        category_ar: videoArItems[i].category,
        duration: item.duration,
        video_url: item.videoUrl ?? "",
      },
    }))
  );
  console.log("✓ videosSection + preview items");

  // 6. Articles preview (matches ArticlesPreview.tsx's [0,2,1] order) --------
  const articlesEn = en.home.articlesSection;
  const articlesAr = ar.home.articlesSection;
  const articlesSectionId = await upsertSection(
    "articlesSection",
    {
      ...Object.fromEntries(
        ["eyebrow", "title", "text"].flatMap((k) => [
          [`${k}_en`, articlesEn[k] ?? null],
          [`${k}_ar`, articlesAr[k] ?? null],
        ])
      ),
      meta: { cta_en: articlesEn.cta, cta_ar: articlesAr.cta },
    },
    5
  );
  const previewOrder = [0, 2, 1];
  await replaceItems(
    articlesSectionId,
    "article",
    previewOrder.map((sourceIndex, i) => {
      const item = en.articlesPage.items[sourceIndex];
      const itemAr = ar.articlesPage.items[sourceIndex];
      return {
        section_id: articlesSectionId,
        item_type: "article",
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
      };
    })
  );
  console.log("✓ articlesSection + preview items");

  // 7. FAQ --------------------------------------------------------------------
  const faqEn = en.home.faqSection;
  const faqAr = ar.home.faqSection;
  const faqSectionId = await upsertSection(
    "faqSection",
    Object.fromEntries(
      ["eyebrow", "title", "text"].flatMap((k) => [
        [`${k}_en`, faqEn[k] ?? null],
        [`${k}_ar`, faqAr[k] ?? null],
      ])
    ),
    6
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
  console.log("✓ faqSection + items");

  // 8. Stats --------------------------------------------------------------------
  const statsSectionEn = en.home.statsSection;
  const statsSectionAr = ar.home.statsSection;
  const statsSectionId = await upsertSection(
    "statsSection",
    Object.fromEntries(
      ["eyebrow", "title", "text"].flatMap((k) => [
        [`${k}_en`, statsSectionEn[k] ?? null],
        [`${k}_ar`, statsSectionAr[k] ?? null],
      ])
    ),
    7
  );
  await replaceItems(
    statsSectionId,
    "stat",
    en.home.stats.map((item, i) => ({
      section_id: statsSectionId,
      item_type: "stat",
      icon: item.icon,
      title_en: item.label,
      title_ar: ar.home.stats[i].label,
      order_index: i,
      meta: { value: item.value, suffix: item.suffix },
    }))
  );
  console.log("✓ statsSection + items");

  console.log("\nDone. Home page content imported into Supabase.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
