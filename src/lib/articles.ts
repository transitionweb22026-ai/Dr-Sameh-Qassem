export type Article = {
  slug: string;
  date: string;
  readTime: string;
  category: string;
  title: string;
  text: string;
  content: string[];
  image?: string;
};

const categoryImageMap: Record<string, string> = {
  "Brain Surgery": "/images/brain.png",
  "General Awareness": "/images/brain.png",
  Spine: "/images/spine.png",
  "Skull Base": "/images/pediatric.png",
  Vascular: "/images/brain.png",
  Epilepsy: "/images/nerves.png",
  "جراحات المخ": "/images/brain.png",
  "توعية عامة": "/images/brain.png",
  "العمود الفقري": "/images/spine.png",
  "قاع الجمجمة": "/images/pediatric.png",
  "الأوعية الدموية": "/images/brain.png",
  الصرع: "/images/nerves.png",
};

export function getArticleImage(category: string): string {
  return categoryImageMap[category] ?? "/images/brain.png";
}
