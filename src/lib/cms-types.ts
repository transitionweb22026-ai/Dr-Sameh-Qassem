export type Page = {
  id: string;
  slug: string;
  name_en: string;
  name_ar: string;
  order_index: number;
};

export type PageHero = {
  id: string;
  page_id: string;
  eyebrow_en: string | null;
  eyebrow_ar: string | null;
  title_en: string;
  title_ar: string;
  title_highlight_en: string | null;
  title_highlight_ar: string | null;
  subtitle_en: string | null;
  subtitle_ar: string | null;
  primary_cta_label_en: string | null;
  primary_cta_label_ar: string | null;
  primary_cta_href: string | null;
  secondary_cta_label_en: string | null;
  secondary_cta_label_ar: string | null;
  secondary_cta_href: string | null;
  image_url: string | null;
  bg_3d_element: string | null;
  show_doctor: boolean;
  show_stats_bar: boolean;
  follow_label_en: string | null;
  follow_label_ar: string | null;
};

export type HeroInput = Omit<PageHero, "id" | "page_id">;

export type Section = {
  id: string;
  page_id: string;
  section_key: string;
  eyebrow_en: string | null;
  eyebrow_ar: string | null;
  title_en: string | null;
  title_ar: string | null;
  title_highlight_en: string | null;
  title_highlight_ar: string | null;
  text_en: string | null;
  text_ar: string | null;
  image_url: string | null;
  meta: Record<string, unknown>;
  order_index: number;
};

export type SectionInput = Omit<Section, "id" | "page_id" | "section_key" | "order_index"> & {
  order_index?: number;
};

export type ContentItem = {
  id: string;
  section_id: string;
  parent_id: string | null;
  item_type: string;
  icon: string | null;
  image_url: string | null;
  title_en: string | null;
  title_ar: string | null;
  subtitle_en: string | null;
  subtitle_ar: string | null;
  text_en: string | null;
  text_ar: string | null;
  href: string | null;
  order_index: number;
  meta: Record<string, unknown>;
};

export type ContentItemInput = Omit<ContentItem, "id" | "section_id"> & {
  section_id?: string;
};

export type MediaAsset = {
  id: string;
  bucket_path: string;
  url: string;
  alt_text_en: string | null;
  alt_text_ar: string | null;
  created_at: string;
};

export type ConsultationRequest = {
  id: string;
  name: string;
  phone: string;
  service: string | null;
  clinic: string | null;
  message: string | null;
  locale: string | null;
  created_at: string;
};
