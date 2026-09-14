import { redirect } from "next/navigation";
import { NotAdminError, requireAdmin } from "@/lib/supabase/admin";
import { listPages } from "@/lib/controllers/pages";
import { Sidebar } from "@/components/admin/Sidebar";
import { Topbar } from "@/components/admin/Topbar";

// Every /admin/dashboard/* screen is per-request and auth-gated — never
// attempt to prerender it at build time (this also avoids build failures
// on deployments where Supabase env vars aren't set until runtime).
export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // The proxy already redirects signed-out visitors away from /admin/*, but
  // Server Functions can be reached even if a future proxy matcher change
  // stops covering this route — so every admin surface re-checks here too.
  let email = "";
  try {
    const { user } = await requireAdmin();
    email = user.email ?? "";
  } catch (error) {
    if (error instanceof NotAdminError) {
      redirect("/admin/login");
    }
    throw error;
  }

  const pagesResult = await listPages();
  const pages = pagesResult.ok ? pagesResult.data : [];

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-brand-ivory">
      <div
        className="pointer-events-none absolute -top-24 -start-24 h-96 w-96 rounded-full bg-brand-gold/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-1/3 -end-24 h-96 w-96 rounded-full bg-brand-700/10 blur-3xl"
        aria-hidden="true"
      />

      <Sidebar pages={pages} />
      <div className="relative z-10 flex min-w-0 flex-1 flex-col">
        <Topbar email={email} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
