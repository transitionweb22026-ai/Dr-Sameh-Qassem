import { Suspense } from "react";
import { LoginForm } from "@/components/admin/LoginForm";

export default function AdminLoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-brand-ivory px-4 py-12">
      <div
        className="pointer-events-none absolute -top-24 -start-24 h-96 w-96 rounded-full bg-brand-gold/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-24 -end-24 h-96 w-96 rounded-full bg-brand-700/10 blur-3xl"
        aria-hidden="true"
      />
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
