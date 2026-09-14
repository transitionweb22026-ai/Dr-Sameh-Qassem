/**
 * Maps each page slug to the content sections its admin screen should show
 * as tabs, beyond the Hero tab every page already gets. Keys match the
 * `sectionKey` naming already used in src/locales/{ar,en}.json (e.g.
 * `home.surgeriesSection`) so the two stay easy to cross-reference.
 *
 * A tab renders even before a `sections` row exists for it — saving the
 * section heading form creates that row on first save.
 */
export const CMS_SECTION_REGISTRY: Record<string, { key: string; label: string }[]> = {
  home: [
    { key: "about", label: "About Preview" },
    { key: "surgeriesSection", label: "Specialties" },
    { key: "treatmentsSection", label: "Treatments" },
    { key: "testimonialsSection", label: "Testimonials" },
    { key: "videosSection", label: "Videos Preview" },
    { key: "articlesSection", label: "Articles Preview" },
    { key: "faqSection", label: "FAQ" },
    { key: "statsSection", label: "Stats" },
    { key: "finalCta", label: "Final CTA" },
  ],
  about: [
    { key: "doctorMessage", label: "Doctor's Message" },
    { key: "timelineSection", label: "Timeline" },
    { key: "videoSection", label: "Featured Video" },
    { key: "expertiseSection", label: "Expertise" },
    { key: "certificatesSection", label: "Certificates" },
    { key: "statsSection", label: "Stats" },
    { key: "finalCta", label: "Final CTA" },
  ],
  services: [
    { key: "disciplinesSection", label: "Specialties" },
    { key: "conditionsSection", label: "Condition Details" },
    { key: "workflowSection", label: "Workflow" },
    { key: "faqSection", label: "FAQ" },
    { key: "finalCta", label: "Final CTA" },
  ],
  reviews: [
    { key: "gridSection", label: "Reviews" },
    { key: "finalCta", label: "Final CTA" },
  ],
  videos: [
    { key: "videosSection", label: "Videos" },
    { key: "finalCta", label: "Final CTA" },
  ],
  articles: [
    { key: "articlesSection", label: "Articles" },
    { key: "finalCta", label: "Final CTA" },
  ],
  contact: [
    { key: "faq", label: "FAQ" },
    { key: "finalCta", label: "Final CTA" },
  ],
  // Privacy Policy and Terms don't render a FinalCta section on the public
  // page, so they don't get a tab for one — see LegalSection instead.
  "privacy-policy": [{ key: "legalSections", label: "Policy Sections" }],
  terms: [{ key: "legalSections", label: "Terms Sections" }],
};
