import { redirect } from "next/navigation";
import { isAuthenticated } from "@/shared/lib/auth";

export async function requireAuth() {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    redirect("/admin/login");
  }
}

