// One-time import: copies the Services page's real content from
// src/locales/{en,ar}.json into the CMS tables. Safe to re-run.
//
// Usage: node scripts/import-services-content.mjs

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
    .eq("slug", "services")
    .single();
  if (pageError) throw pageError;
  const pageId = page.id;
  console.log("services page_id:", pageId);

  const heroEn = en.services.hero;
  const heroAr = ar.services.hero;
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
      secondary_cta_href: "#disciplines",
      image_url: heroEn.image,
      bg_3d_element: "bone",
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

  async function replaceItems(sectionId, itemType, parentId, items) {
    let query = supabase.from("content_items").delete().eq("section_id", sectionId).eq("item_type", itemType);
    query = parentId === undefined ? query.is("parent_id", null) : query.eq("parent_id", parentId);
    const { error: delError } = await query;
    if (delError) throw delError;

    if (items.length === 0) return [];
    const { data, error: insError } = await supabase.from("content_items").insert(items).select("id");
    if (insError) throw insError;
    return data;
  }

  // 1. Disciplines (+ nested conditions) --------------------------------------
  const discEn = en.services.disciplinesSection;
  const discAr = ar.services.disciplinesSection;
  const discSectionId = await upsertSection(
    "disciplinesSection",
    { eyebrow_en: null, eyebrow_ar: null, title_en: discEn.title, title_ar: discAr.title },
    0
  );

  // Clear all discipline + condition items for this section first (children
  // reference disciplines by id, so delete children before re-inserting).
  const { error: delCondError } = await supabase
    .from("content_items")
    .delete()
    .eq("section_id", discSectionId)
    .eq("item_type", "condition");
  if (delCondError) throw delCondError;
  const { error: delDiscError } = await supabase
    .from("content_items")
    .delete()
    .eq("section_id", discSectionId)
    .eq("item_type", "discipline");
  if (delDiscError) throw delDiscError;

  for (let i = 0; i < discEn.items.length; i++) {
    const item = discEn.items[i];
    const itemAr = discAr.items[i];
    const { data: disciplineRow, error: discInsError } = await supabase
      .from("content_items")
      .insert({
        section_id: discSectionId,
        item_type: "discipline",
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
    if (discInsError) throw discInsError;

    const conditionRows = item.conditions.map((cond, j) => ({
      section_id: discSectionId,
      parent_id: disciplineRow.id,
      item_type: "condition",
      title_en: cond.title,
      title_ar: itemAr.conditions[j].title,
      text_en: cond.text,
      text_ar: itemAr.conditions[j].text,
      order_index: j,
      meta: {},
    }));
    const { error: condInsError } = await supabase.from("content_items").insert(conditionRows);
    if (condInsError) throw condInsError;
  }
  console.log("✓ disciplinesSection + disciplines + conditions");

  // 2. Condition Details (heading only — reuses disciplinesSection's items) ---
  const condSecEn = en.services.conditionsSection;
  const condSecAr = ar.services.conditionsSection;
  await upsertSection(
    "conditionsSection",
    { eyebrow_en: null, eyebrow_ar: null, title_en: condSecEn.title, title_ar: condSecAr.title },
    1
  );
  console.log("✓ conditionsSection (heading only)");

  // 3. Workflow -----------------------------------------------------------------
  const wfEn = en.services.workflowSection;
  const wfAr = ar.services.workflowSection;
  const wfSectionId = await upsertSection(
    "workflowSection",
    { eyebrow_en: null, eyebrow_ar: null, title_en: wfEn.title, title_ar: wfAr.title },
    2
  );
  await replaceItems(
    wfSectionId,
    "step",
    undefined,
    wfEn.steps.map((step, i) => ({
      section_id: wfSectionId,
      item_type: "step",
      title_en: step.title,
      title_ar: wfAr.steps[i].title,
      text_en: step.text,
      text_ar: wfAr.steps[i].text,
      order_index: i,
      meta: {},
    }))
  );
  console.log("✓ workflowSection + steps");

  // 4. FAQ ------------------------------------------------------------------------
  const faqEn = en.services.faqSection;
  const faqAr = ar.services.faqSection;
  const faqSectionId = await upsertSection(
    "faqSection",
    { eyebrow_en: null, eyebrow_ar: null, title_en: faqEn.title, title_ar: faqAr.title },
    3
  );
  await replaceItems(
    faqSectionId,
    "faq",
    undefined,
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

  // 5. Stats (admin-editable; not currently displayed on the live page,
  // matching the existing static site — kept populated so the tab isn't empty) --
  const statsSectionId = await upsertSection(
    "stats",
    { eyebrow_en: null, eyebrow_ar: null, title_en: null, title_ar: null },
    4
  );
  await replaceItems(
    statsSectionId,
    "stat",
    undefined,
    en.services.stats.map((item, i) => ({
      section_id: statsSectionId,
      item_type: "stat",
      icon: item.icon,
      title_en: item.label,
      title_ar: ar.services.stats[i].label,
      order_index: i,
      meta: { value: item.value, suffix: item.suffix },
    }))
  );
  console.log("✓ stats + items");

  console.log("\nDone. Services page content imported into Supabase.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
