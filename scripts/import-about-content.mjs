// One-time import: copies the About page's real content from
// src/locales/{en,ar}.json into the CMS tables (page_heroes, sections,
// content_items) so the admin dashboard opens with real data instead of
// empty forms. Safe to re-run — it upserts by natural key every time.
//
// Usage: node scripts/import-about-content.mjs

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
    .eq("slug", "about")
    .single();
  if (pageError) throw pageError;
  const pageId = page.id;
  console.log("about page_id:", pageId);

  // ---- Hero -----------------------------------------------------------
  const heroEn = en.about.hero;
  const heroAr = ar.about.hero;
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
      secondary_cta_href: "#timeline",
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

  // 1. Doctor's Message -----------------------------------------------------
  const dmEn = en.about.doctorMessage;
  const dmAr = ar.about.doctorMessage;
  const dmSectionId = await upsertSection(
    "doctorMessage",
    {
      eyebrow_en: null,
      eyebrow_ar: null,
      title_en: dmEn.headline,
      title_ar: dmAr.headline,
      image_url: dmEn.image,
      meta: {
        name_en: dmEn.name,
        name_ar: dmAr.name,
        role_en: dmEn.role,
        role_ar: dmAr.role,
        signature_en: dmEn.signature,
        signature_ar: dmAr.signature,
        qualification_short_en: dmEn.qualificationShort,
        qualification_short_ar: dmAr.qualificationShort,
        qualification_full_en: dmEn.qualificationFull,
        qualification_full_ar: dmAr.qualificationFull,
      },
    },
    0
  );
  await replaceItems(
    dmSectionId,
    "paragraph",
    dmEn.paragraphs.map((p, i) => ({
      section_id: dmSectionId,
      item_type: "paragraph",
      text_en: p,
      text_ar: dmAr.paragraphs[i],
      order_index: i,
      meta: {},
    }))
  );
  console.log("✓ doctorMessage + paragraphs");

  // 2. Timeline ---------------------------------------------------------------
  const tlEn = en.about.timelineSection;
  const tlAr = ar.about.timelineSection;
  const tlSectionId = await upsertSection(
    "timelineSection",
    { eyebrow_en: null, eyebrow_ar: null, title_en: tlEn.title, title_ar: tlAr.title },
    1
  );
  await replaceItems(
    tlSectionId,
    "milestone",
    tlEn.items.map((item, i) => ({
      section_id: tlSectionId,
      item_type: "milestone",
      title_en: item.title,
      title_ar: tlAr.items[i].title,
      text_en: item.text,
      text_ar: tlAr.items[i].text,
      order_index: i,
      meta: { year: item.year },
    }))
  );
  console.log("✓ timelineSection + items");

  // 3. Featured video -----------------------------------------------------------
  const vidEn = en.about.videoSection;
  const vidAr = ar.about.videoSection;
  await upsertSection(
    "videoSection",
    {
      eyebrow_en: null,
      eyebrow_ar: null,
      title_en: vidEn.title,
      title_ar: vidAr.title,
      text_en: vidEn.text,
      text_ar: vidAr.text,
      image_url: vidEn.poster,
      meta: { duration_en: vidEn.duration, duration_ar: vidAr.duration, video_url: vidEn.videoUrl || "" },
    },
    2
  );
  console.log("✓ videoSection");

  // 4. Expertise ------------------------------------------------------------
  const expEn = en.about.expertiseSection;
  const expAr = ar.about.expertiseSection;
  const expSectionId = await upsertSection(
    "expertiseSection",
    { eyebrow_en: null, eyebrow_ar: null, title_en: expEn.title, title_ar: expAr.title },
    3
  );
  const defaultExpertiseImages = ["/images/brain.png", "/images/spine.png", "/images/pediatric.png", "/images/nerves.png"];
  await replaceItems(
    expSectionId,
    "expertise",
    expEn.items.map((item, i) => ({
      section_id: expSectionId,
      item_type: "expertise",
      image_url: defaultExpertiseImages[i % defaultExpertiseImages.length],
      title_en: item.title,
      title_ar: expAr.items[i].title,
      text_en: item.text,
      text_ar: expAr.items[i].text,
      order_index: i,
      meta: {},
    }))
  );
  console.log("✓ expertiseSection + items");

  // 5. Certificates -----------------------------------------------------------
  const certEn = en.about.certificatesSection;
  const certAr = ar.about.certificatesSection;
  const certSectionId = await upsertSection(
    "certificatesSection",
    { eyebrow_en: null, eyebrow_ar: null, title_en: certEn.title, title_ar: certAr.title },
    4
  );
  await replaceItems(
    certSectionId,
    "certificate",
    certEn.items.map((item, i) => ({
      section_id: certSectionId,
      item_type: "certificate",
      title_en: item.title,
      title_ar: certAr.items[i].title,
      order_index: i,
      meta: { org_en: item.org, org_ar: certAr.items[i].org },
    }))
  );
  console.log("✓ certificatesSection + items");

  // 6. Stats --------------------------------------------------------------------
  const statsEn = en.about.statsSection;
  const statsAr = ar.about.statsSection;
  const statsSectionId = await upsertSection(
    "statsSection",
    {
      eyebrow_en: null,
      eyebrow_ar: null,
      title_en: statsEn.title,
      title_ar: statsAr.title,
      text_en: statsEn.text,
      text_ar: statsAr.text,
    },
    5
  );
  await replaceItems(
    statsSectionId,
    "stat",
    en.about.counters.map((item, i) => ({
      section_id: statsSectionId,
      item_type: "stat",
      icon: item.icon,
      title_en: item.label,
      title_ar: ar.about.counters[i].label,
      order_index: i,
      meta: { value: item.value, suffix: item.suffix },
    }))
  );
  console.log("✓ statsSection + items");

  console.log("\nDone. About page content imported into Supabase.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
