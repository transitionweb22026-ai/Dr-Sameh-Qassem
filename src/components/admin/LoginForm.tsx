"use client";

import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Lock, Mail } from "lucide-react";
import { createSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/browser";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    if (!isSupabaseConfigured) {
      setError("Supabase is not configured on this deployment.");
      return;
    }

    setLoading(true);
    const supabase = createSupabaseBrowserClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    const next = searchParams.get("next") ?? "/admin/dashboard";
    router.replace(next);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="liquid-glass w-full max-w-sm rounded-3xl p-8 space-y-5">
      <div className="text-center space-y-1">
        <h1 className="text-xl font-bold text-brand-forest">Admin Sign In</h1>
        <p className="text-sm text-brand-800/70">Dr. Sameh Qassem — Content Dashboard</p>
      </div>

      <label className="block space-y-1.5">
        <span className="text-xs font-semibold uppercase tracking-wide text-brand-700">
          Email
        </span>
        <span className="flex items-center gap-2 rounded-xl border border-brand-900/15 bg-white/70 px-3.5 py-2.5">
          <Mail className="h-4 w-4 text-brand-gold shrink-0" />
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full bg-transparent text-sm text-brand-forest outline-none"
            placeholder="admin@example.com"
          />
        </span>
      </label>

      <label className="block space-y-1.5">
        <span className="text-xs font-semibold uppercase tracking-wide text-brand-700">
          Password
        </span>
        <span className="flex items-center gap-2 rounded-xl border border-brand-900/15 bg-white/70 px-3.5 py-2.5">
          <Lock className="h-4 w-4 text-brand-gold shrink-0" />
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full bg-transparent text-sm text-brand-forest outline-none"
            placeholder="••••••••"
          />
        </span>
      </label>

      {error ? (
        <p role="alert" className="text-sm font-medium text-red-600">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-forest px-6 py-3 text-sm font-bold text-white transition-all duration-300 hover:bg-brand-900 disabled:opacity-60"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        <span>{loading ? "Signing in…" : "Sign in"}</span>
      </button>
    </form>
  );
}
