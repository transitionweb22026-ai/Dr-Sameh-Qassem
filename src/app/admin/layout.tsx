import type { Metadata } from "next";
import { inter } from "@/lib/fonts";
import "../globals.css";

export const metadata: Metadata = {
  title: "Admin — Dr. Sameh Qassem",
  robots: { index: false, follow: false },
};

/**
 * Independent root layout for everything under /admin. This is a second
 * Next.js "root layout" living alongside `(site)/[locale]/layout.tsx` — see
 * https://nextjs.org/docs/app/api-reference/file-conventions/route-groups
 * ("Defining multiple root layouts"). The admin dashboard is a separate,
 * English-only, LTR tool and intentionally does not share the public site's
 * Navbar/Footer/locale routing.
 */
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" className={inter.variable}>
      <body className="antialiased bg-brand-ivory text-[#1e2d27] font-inter min-h-screen">
        {children}
      </body>
    </html>
  );
}
