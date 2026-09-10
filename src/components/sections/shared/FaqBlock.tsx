import { SectionHeading } from "@/components/ui/SectionHeading";
import { Accordion } from "@/components/ui/Accordion";
import { AmbientGlow } from "@/components/ui/AmbientGlow";

export function FaqBlock({
  eyebrow,
  title,
  text,
  items,
}: {
  eyebrow: string;
  title: string;
  text?: string;
  items: { q: string; a: string }[];
}) {
  return (
    <section className="py-24 bg-brand-ivory relative overflow-hidden">
      <AmbientGlow />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading eyebrow={eyebrow} title={title} text={text} />
        <Accordion items={items} />
      </div>
    </section>
  );
}
