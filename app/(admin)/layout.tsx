import { cookies } from "next/headers";
import { AdminNav } from "@/widgets/admin-nav";

const SIDEBAR_COOKIE_NAME = "sidebar_state";

export default async function AdminRouteGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const sidebarStateCookie = cookieStore.get(SIDEBAR_COOKIE_NAME);
  
  // Default to open if no cookie exists, otherwise parse the cookie value
  const defaultSidebarOpen = sidebarStateCookie?.value === "false" ? false : true;

  return <AdminNav defaultSidebarOpen={defaultSidebarOpen}>{children}</AdminNav>;
}
