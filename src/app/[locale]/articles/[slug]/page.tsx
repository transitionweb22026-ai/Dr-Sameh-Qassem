import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { buildAlternates } from "@/lib/seo";
import { getArticleImage, type Article } from "@/lib/articles";
import { AmbientGlow } from "@/components/ui/AmbientGlow";
import { FadeIn } from "@/components/motion/FadeIn";
import { FinalCta } from "@/components/layout/FinalCta";
import enMessages from "@/locales/en.json";
import arMessages from "@/locales/ar.json";

const messagesByLocale = { en: enMessages, ar: arMessages } as const;

async function getArticle(locale: string, slug: string): Promise<Article | undefined> {
  const t = await getTranslations({ locale, namespace: "articlesPage" });
  const featured = t.raw("featured") as Article;
  const items = t.raw("items") as Article[];
  return [featured, ...items].find((article) => article.slug === slug);
}

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => {
    const page = messagesByLocale[locale as keyof typeof messagesByLocale].articlesPage;
    const slugs = [page.featured.slug, ...page.items.map((item) => item.slug)];
    return slugs.map((slug) => ({ locale, slug }));
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = await getArticle(locale, slug);
  if (!article) return {};

  return {
    title: article.title,
    description: article.text,
    alternates: buildAlternates(locale, `/articles/${slug}`),
    openGraph: {
      description: article.text,
      images: [{ url: `/${locale}/opengraph-image`, width: 1200, height: 630 }],
    },
  };
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const article = await getArticle(locale, slug);
  if (!article) notFound();

  const common = await getTranslations({ locale, namespace: "common" });
  const image = article.image ?? getArticleImage(article.category);

  return (
    <>
      <section className="relative overflow-hidden bg-brand-ivory pt-28 pb-16 sm:pt-32">
        <AmbientGlow />
        <div className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <Link
              href="/articles"
              className="inline-flex items-center gap-2 text-sm font-bold text-brand-forest/70 hover:text-brand-gold transition-colors"
            >
              <ArrowRight className="h-4 w-4 rotate-180 rtl:rotate-0" />
              <span>{common("backToArticles")}</span>
            </Link>
          </FadeIn>

          <FadeIn delay={0.05}>
            <span className="mt-6 inline-flex w-fit items-center rounded-full bg-brand-gold/15 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wide text-brand-gold">
              {article.category}
            </span>
            <h1 className="mt-4 text-balance font-tajawal text-3xl font-black leading-tight tracking-tight text-brand-forest sm:text-4xl lg:text-5xl">
              {article.title}
            </h1>
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-semibold text-brand-700">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {article.date}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {article.readTime}
              </span>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="relative mt-8 aspect-video w-full overflow-hidden rounded-3xl border border-white/60 shadow-2xl">
              <Image
                src={image}
                alt={article.title}
                fill
                sizes="(min-width: 1024px) 768px, 100vw"
                className={article.image ? "object-cover" : "object-contain bg-brand-forest/5 p-10"}
                priority
              />
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="bg-brand-ivory pb-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <FadeIn delay={0.05}>
            <div className="space-y-5 text-base leading-relaxed text-brand-900/85 sm:text-lg">
              {article.content.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-10 rounded-2xl border border-brand-900/10 bg-white/60 p-5 text-xs leading-relaxed text-brand-700/80 sm:text-sm">
              {common("medicalDisclaimer")}
            </div>

            <div className="mt-10 border-t border-brand-900/10 pt-8">
              <Link
                href="/articles"
                className="inline-flex items-center gap-2 rounded-full bg-brand-forest px-6 py-3 text-sm font-bold text-white transition-all duration-300 hover:bg-brand-900 hover:scale-105 shadow-lg"
              >
                <ArrowRight className="h-4 w-4 rotate-180 rtl:rotate-0" />
                <span>{common("backToArticles")}</span>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      <FinalCta />
    </>
  );
}
