import { NextResponse } from "next/server";
import { deleteSession } from "@/shared/lib/auth";

export async function GET(request: Request) {
  await deleteSession();
  const url = new URL(request.url);
  return NextResponse.redirect(new URL("/admin/login", url.origin));
}

