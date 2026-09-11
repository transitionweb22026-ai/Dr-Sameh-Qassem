/** Builds canonical + hreflang alternates for a given page path, pointing
 * each locale at its own equivalent page rather than the generic homepage. */
export function buildAlternates(locale: string, path: string) {
  const cleanPath = path === "/" ? "" : path;
  return {
    canonical: `/${locale}${cleanPath}`,
    languages: {
      ar: `/ar${cleanPath}`,
      en: `/en${cleanPath}`,
    },
  };
}
