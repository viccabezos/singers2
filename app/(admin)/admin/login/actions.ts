"use server";

import { redirect } from "next/navigation";
import { createSession, verifyPassword } from "@/shared/lib/auth";

export async function loginAction(formData: FormData) {
  const password = formData.get("password") as string;

  if (!password) {
    redirect("/admin/login?error=password_required");
  }

  const isValid = await verifyPassword(password);

  if (!isValid) {
    redirect("/admin/login?error=invalid_password");
  }

  await createSession();
  redirect("/admin/dashboard");
}

