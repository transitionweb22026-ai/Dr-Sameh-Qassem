import { redirect } from "next/navigation";

// The proxy already sends signed-out visitors to /admin/login for any
// /admin/* path, so reaching this page at all means there's a valid
// session — just forward straight into the dashboard.
export default function AdminIndexPage() {
  redirect("/admin/dashboard");
}
