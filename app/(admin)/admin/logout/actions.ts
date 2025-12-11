"use server";

import { redirect } from "next/navigation";
import { deleteSession } from "@/shared/lib/auth";

export async function logoutAction() {
  await deleteSession();
  redirect("/admin/login");
}

