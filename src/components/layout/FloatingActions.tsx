"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Phone } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { WhatsAppIcon } from "@/components/ui/SocialIcons";

function FloatingButton({
  href,
  label,
  icon,
  textColorClass,
  glowColorClass,
  external,
  floatDelay,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  textColorClass: string;
  glowColorClass: string;
  external?: boolean;
  floatDelay: number;
}) {
  return (
    <motion.a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      aria-label={label}
      title={label}
      className="relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full liquid-glass-dark"
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", delay: floatDelay }}
      whileHover={{ scale: 1.1, rotate: 4 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.span
        aria-hidden="true"
        className={`absolute inset-0 -z-10 rounded-full ${glowColorClass} opacity-25 blur-md`}
        whileHover={{ opacity: 0.5, scale: 1.35 }}
        transition={{ duration: 0.3 }}
      />
      <span className={`relative ${textColorClass}`}>{icon}</span>
    </motion.a>
  );
}

export function FloatingActions() {
  const common = useTranslations("common");

  return (
    <div className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-50 flex flex-col gap-3 sm:gap-4">
      <FloatingButton
        href={`https://wa.me/${siteConfig.whatsappNumber}`}
        label={common("whatsapp")}
        icon={<WhatsAppIcon className="w-5 h-5 sm:w-6 sm:h-6" />}
        textColorClass="text-emerald-400"
        glowColorClass="bg-emerald-400"
        external
        floatDelay={0}
      />
      <FloatingButton
        href={siteConfig.phoneHref}
        label={common("callNow")}
        icon={<Phone className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={1.8} />}
        textColorClass="text-brand-gold"
        glowColorClass="bg-brand-gold"
        floatDelay={0.4}
      />
    </div>
  );
}
