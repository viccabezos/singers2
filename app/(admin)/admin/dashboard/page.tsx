import { requireAuth } from "../middleware";
import Link from "next/link";
import { MusicIcon, ListMusicIcon, CalendarIcon } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { getEvents, getEventsCount, getRecentlyUpdatedEvents } from "@/shared/lib/events";
import { getSongsCount, getRecentlyUpdatedSongs } from "@/shared/lib/songs";
import { getPlaylistsCount, getRecentlyUpdatedPlaylists } from "@/shared/lib/playlists";
import { EventCalendar } from "@/widgets/event-calendar";
import { RecentActivity } from "@/widgets/recent-activity";
import { DraftAlert } from "@/widgets/draft-alert";

export default async function DashboardPage() {
  await requireAuth();

  // Fetch all visible (non-archived) events for the calendar
  const events = await getEvents({ is_archived: false });

  // Fetch counts for each content type
  const [
    songsCount, 
    playlistsCount, 
    eventsCount,
    hiddenSongsCount,
    draftPlaylistsCount,
    hiddenEventsCount,
    recentSongs,
    recentPlaylists,
    recentEvents,
  ] = await Promise.all([
    getSongsCount({ is_archived: false }),
    getPlaylistsCount({ is_archived: false }),
    getEventsCount({ is_archived: false }),
    getSongsCount({ is_archived: false, is_visible: false }),
    getPlaylistsCount({ is_archived: false, status: ["hidden", "in_progress"] }),
    getEventsCount({ is_archived: false, is_visible: false }),
    getRecentlyUpdatedSongs(5),
    getRecentlyUpdatedPlaylists(5),
    getRecentlyUpdatedEvents(5),
  ]);

  const navItems = [
    {
      href: "/admin/songs",
      title: "Songs",
      // description: "Manage your song library",
      icon: MusicIcon,
      count: songsCount,
    },
    {
      href: "/admin/playlists",
      title: "Playlists",
      // description: "Organize songs into playlists",
      icon: ListMusicIcon,
      count: playlistsCount,
    },
    {
      href: "/admin/events",
      title: "Events",
      // description: "Manage your choir events",
      icon: CalendarIcon,
      count: eventsCount,
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
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg group-hover:text-primary transition-colors">
                          {item.title}
                        </CardTitle>
                        <span className="text-sm font-medium text-muted-foreground">
                          {item.count}
                        </span>
                      </div>
                      {/* <CardDescription>{item.description}</CardDescription> */}
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>

        {/* Recent Activity and Calendar */}
        <div className="mt-8 grid gap-6 lg:grid-cols-3 items-start ">
          <div className="lg:col-span-1">
            <RecentActivity
              songs={recentSongs}
              playlists={recentPlaylists}
              events={recentEvents}
            />
          </div>
          <div className="lg:col-span-2">
            <EventCalendar events={events} />
          </div>
        </div>

        {/* Draft Alert */}
        <div className="mt-8">
          <DraftAlert 
            hiddenSongsCount={hiddenSongsCount}
            draftPlaylistsCount={draftPlaylistsCount}
            hiddenEventsCount={hiddenEventsCount}
          />
        </div>
      </div>
    </div>
  );
}
