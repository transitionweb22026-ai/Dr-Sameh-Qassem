import { notFound } from "next/navigation";
import { getPageBySlug } from "@/lib/controllers/pages";
import { getHeroByPageId } from "@/lib/controllers/heroes";
import { listSectionsByPageId } from "@/lib/controllers/sections";
import { listContentItemsBySection } from "@/lib/controllers/contentItems";
import { CMS_SECTION_REGISTRY } from "@/lib/cms-section-registry";
import { PageTabs, type SectionTab } from "@/components/admin/PageTabs";

export default async function AdminPageDetail({
  params,
}: {
  params: Promise<{ pageSlug: string }>;
}) {
  const { pageSlug } = await params;

  const pageResult = await getPageBySlug(pageSlug);
  if (!pageResult.ok || !pageResult.data) notFound();
  const page = pageResult.data;

  const [heroResult, sectionsResult] = await Promise.all([
    getHeroByPageId(page.id),
    listSectionsByPageId(page.id),
  ]);
  const hero = heroResult.ok ? heroResult.data : null;
  const existingSections = sectionsResult.ok ? sectionsResult.data : [];

  const registryEntries = CMS_SECTION_REGISTRY[pageSlug] ?? [];

  const sectionTabs: SectionTab[] = await Promise.all(
    registryEntries.map(async (entry) => {
      const section = existingSections.find((s) => s.section_key === entry.key) ?? null;
      const itemsResult = section
        ? await listContentItemsBySection(section.id)
        : { ok: true as const, data: [] };
      return {
        key: entry.key,
        label: entry.label,
        section,
        items: itemsResult.ok ? itemsResult.data : [],
      };
    })
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-brand-forest">{page.name_en}</h1>
        <p className="mt-1 text-sm text-brand-800/70">{page.name_ar}</p>
      </div>

      <PageTabs page={page} hero={hero} sectionTabs={sectionTabs} />
    </div>
  );
}
