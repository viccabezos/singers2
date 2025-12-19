import { requireAuth } from "../middleware";
import Link from "next/link";
import { MusicIcon, ListMusicIcon, CalendarIcon } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  await requireAuth();

  const navItems = [
    {
      href: "/admin/songs",
      title: "Songs",
      description: "Manage your song library",
      icon: MusicIcon,
    },
    {
      href: "/admin/playlists",
      title: "Playlists",
      description: "Organize songs into playlists",
      icon: ListMusicIcon,
    },
    {
      href: "/admin/events",
      title: "Events",
      description: "Manage your choir events",
      icon: CalendarIcon,
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 p-4 dark:bg-black sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50 sm:text-3xl">
              Dashboard
            </h1>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Welcome to the back office
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/admin/logout">Logout</Link>
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="group">
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-zinc-100 p-2 dark:bg-zinc-800">
                      <item.icon className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
                    </div>
                    <div>
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        {item.title}
                      </CardTitle>
                      <CardDescription>{item.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
