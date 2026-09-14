import { LogOut } from "lucide-react";
import { signOutAdmin } from "@/lib/controllers/auth";

export function Topbar({ email }: { email: string }) {
  return (
    <header className="liquid-glass flex items-center justify-between gap-4 px-4 py-3 lg:px-6">
      <div className="text-sm font-semibold text-brand-forest lg:hidden">Admin</div>
      <div className="hidden text-sm text-brand-800/70 lg:block">Signed in as {email}</div>
      <form action={signOutAdmin}>
        <button
          type="submit"
          className="flex items-center gap-2 rounded-full border border-brand-900/15 px-4 py-2 text-xs font-bold text-brand-forest transition-colors hover:bg-brand-100/60"
        >
          <LogOut className="h-3.5 w-3.5" />
          Sign out
        </button>
      </form>
    </header>
  );
}
