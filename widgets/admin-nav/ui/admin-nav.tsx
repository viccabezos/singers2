"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboardIcon,
  MusicIcon,
  ListMusicIcon,
  CalendarIcon,
  LogOutIcon,
  MenuIcon,
  PlusIcon,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

const navItems = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboardIcon,
  },
  {
    title: "Songs",
    href: "/admin/songs",
    icon: MusicIcon,
  },
  {
    title: "Playlists",
    href: "/admin/playlists",
    icon: ListMusicIcon,
  },
  {
    title: "Events",
    href: "/admin/events",
    icon: CalendarIcon,
  },
];

interface AdminNavProps {
  children: React.ReactNode;
}

export function AdminNav({ children }: AdminNavProps) {
  const pathname = usePathname();
  const isMobile = useIsMobile();

  // Don't show navigation on login/logout pages
  const isAuthPage = pathname === "/admin/login" || pathname === "/admin/logout" || pathname === "/admin";
  
  if (isAuthPage) {
    return <>{children}</>;
  }

  const isActive = (href: string) => {
    if (!pathname) return false;
    if (href === "/admin/dashboard") {
      return pathname === "/admin/dashboard";
    }
    return pathname.startsWith(href);
  };

  // Mobile: Bottom drawer with FAB trigger
  if (isMobile) {
    return (
      <div className="min-h-svh flex flex-col relative">
        {/* Page content - no header, cleaner look */}
        <main className="flex-1">{children}</main>

        {/* Floating Action Button - bottom right, thumb-reachable */}
        <Drawer>
          <DrawerTrigger asChild>
            <Button
              size="icon"
              className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg"
            >
              <MenuIcon className="h-6 w-6" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            {/* Quick Actions - compact, at the top for easy thumb access */}
            <div className="px-4 pt-2 pb-3 border-b">
              <div className="grid grid-cols-3 gap-2">
                <DrawerClose asChild>
                  <Link
                    href="/admin/songs/new"
                    className="flex flex-col items-center gap-1 rounded-lg border p-2 text-center hover:bg-muted transition-colors"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <MusicIcon className="h-4 w-4" />
                    </div>
                    <span className="text-[10px] font-medium">Song</span>
                  </Link>
                </DrawerClose>
                <DrawerClose asChild>
                  <Link
                    href="/admin/playlists/new"
                    className="flex flex-col items-center gap-1 rounded-lg border p-2 text-center hover:bg-muted transition-colors"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <ListMusicIcon className="h-4 w-4" />
                    </div>
                    <span className="text-[10px] font-medium">Playlist</span>
                  </Link>
                </DrawerClose>
                <DrawerClose asChild>
                  <Link
                    href="/admin/events/new"
                    className="flex flex-col items-center gap-1 rounded-lg border p-2 text-center hover:bg-muted transition-colors"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <CalendarIcon className="h-4 w-4" />
                    </div>
                    <span className="text-[10px] font-medium">Event</span>
                  </Link>
                </DrawerClose>
              </div>
            </div>

            {/* Navigation - compact */}
            <div className="px-4 py-2">
              <nav className="grid gap-0.5">
                {navItems.map((item) => (
                  <DrawerClose key={item.href} asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                        isActive(item.href)
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.title}
                    </Link>
                  </DrawerClose>
                ))}
              </nav>
            </div>

            <div className="border-t px-4 py-2">
              <DrawerClose asChild>
                <Link
                  href="/admin/logout"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  <LogOutIcon className="h-4 w-4" />
                  Logout
                </Link>
              </DrawerClose>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    );
  }

  // Desktop/Tablet: Collapsible sidebar with trigger button
  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" variant="sidebar">
        <SidebarHeader className="border-b border-sidebar-border">
          <div className="flex items-center gap-2 px-2 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <MusicIcon className="h-4 w-4" />
            </div>
            <span className="font-semibold text-lg group-data-[collapsible=icon]:hidden">
              Singers Admin
            </span>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive(item.href)}
                      tooltip={item.title}
                    >
                      <Link href={item.href}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="border-t border-sidebar-border">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Logout">
                <Link href="/admin/logout">
                  <LogOutIcon className="h-4 w-4" />
                  <span>Logout</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>

      <SidebarInset>
        {/* Desktop header with sidebar toggle */}
        <header className="sticky top-0 z-40 flex h-16 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 ">
          <SidebarTrigger className="-ml-1" />
        </header>
        
        {/* Page content */}
        <div className="flex-1">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
