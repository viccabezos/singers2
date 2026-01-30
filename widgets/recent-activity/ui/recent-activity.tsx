"use client";

import { useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { enUS } from "date-fns/locale";
import { MusicIcon, ListMusicIcon, CalendarIcon, ChevronRightIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type { Song } from "@/shared/types/song";
import type { Playlist } from "@/shared/types/playlist";
import type { Event } from "@/shared/types/event";

interface RecentActivityProps {
  songs: Song[];
  playlists: Playlist[];
  events: Event[];
}

type TabType = "songs" | "playlists" | "events";

interface ActivityItem {
  id: string;
  title: string;
  subtitle?: string;
  updated_at: string;
  href: string;
  icon: React.ElementType;
  status?: string;
  is_visible?: boolean;
}

export function RecentActivity({ songs, playlists, events }: RecentActivityProps) {
  const [activeTab, setActiveTab] = useState<TabType>("songs");

  const formatTimeAgo = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { 
        addSuffix: true,
        locale: enUS 
      });
    } catch {
      return "Unknown";
    }
  };

  const songsItems: ActivityItem[] = songs.map((song) => ({
    id: song.id,
    title: song.title,
    subtitle: song.artist_composer || undefined,
    updated_at: song.updated_at,
    href: `/admin/songs/${song.id}`,
    icon: MusicIcon,
    is_visible: song.is_visible,
  }));

  const playlistsItems: ActivityItem[] = playlists.map((playlist) => ({
    id: playlist.id,
    title: playlist.name,
    subtitle: playlist.description || undefined,
    updated_at: playlist.updated_at,
    href: `/admin/playlists/${playlist.id}`,
    icon: ListMusicIcon,
    status: playlist.status,
  }));

  const eventsItems: ActivityItem[] = events.map((event) => ({
    id: event.id,
    title: event.name,
    subtitle: event.event_date,
    updated_at: event.updated_at,
    href: `/admin/events/${event.id}`,
    icon: CalendarIcon,
    is_visible: event.is_visible,
  }));

  const getStatusBadge = (item: ActivityItem) => {
    if (activeTab === "songs") {
      return item.is_visible === false ? (
        <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-200">
          Hidden
        </span>
      ) : null;
    }
    
    if (activeTab === "playlists" && item.status) {
      const statusColors: Record<string, string> = {
        visible: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200",
        hidden: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200",
        in_progress: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200",
        archived: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
      };
      
      return (
        <span className={cn(
          "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize",
          statusColors[item.status] || statusColors.hidden
        )}>
          {item.status.replace("_", " ")}
        </span>
      );
    }
    
    if (activeTab === "events") {
      return item.is_visible === false ? (
        <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-200">
          Hidden
        </span>
      ) : (
        <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-200">
          Visible
        </span>
      );
    }
    
    return null;
  };

  const renderItemList = (items: ActivityItem[]) => {
    if (items.length === 0) {
      return (
        <p className="text-sm text-muted-foreground py-4 text-center">
          No recent activity
        </p>
      );
    }

    return (
      <div className="space-y-1">
        {items.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="group flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-accent/50"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-zinc-100 dark:bg-zinc-800">
              <item.icon className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm truncate">
                  {item.title}
                </span>
                {getStatusBadge(item)}
              </div>
              {item.subtitle && (
                <p className="text-xs text-muted-foreground truncate">
                  {item.subtitle}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground shrink-0">
              <span>{formatTimeAgo(item.updated_at)}</span>
              <ChevronRightIcon className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </Link>
        ))}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Recently Updated</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabType)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="songs">
              <MusicIcon className="h-4 w-4 mr-2" />
              Songs
            </TabsTrigger>
            <TabsTrigger value="playlists">
              <ListMusicIcon className="h-4 w-4 mr-2" />
              Playlists
            </TabsTrigger>
            <TabsTrigger value="events">
              <CalendarIcon className="h-4 w-4 mr-2" />
              Events
            </TabsTrigger>
          </TabsList>
          <TabsContent value="songs" className="mt-4">
            {renderItemList(songsItems)}
          </TabsContent>
          <TabsContent value="playlists" className="mt-4">
            {renderItemList(playlistsItems)}
          </TabsContent>
          <TabsContent value="events" className="mt-4">
            {renderItemList(eventsItems)}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
