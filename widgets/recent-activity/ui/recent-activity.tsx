"use client";

import { useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { enUS } from "date-fns/locale";
import {
  MusicIcon,
  ListMusicIcon,
  CalendarIcon,
  ChevronRightIcon,
  FileMusicIcon,
  ListIcon,
  CalendarDaysIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge, type DashboardStatus } from "@/shared/ui";
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
  status?: string;
  is_visible?: boolean;
}

const TAB_CONFIG = {
  songs: {
    icon: MusicIcon,
    emptyIcon: FileMusicIcon,
    emptyMessage: "No songs updated recently",
  },
  playlists: {
    icon: ListMusicIcon,
    emptyIcon: ListIcon,
    emptyMessage: "No playlists updated recently",
  },
  events: {
    icon: CalendarIcon,
    emptyIcon: CalendarDaysIcon,
    emptyMessage: "No events updated recently",
  },
} as const;

function formatTimeAgo(dateString: string): string {
  try {
    return formatDistanceToNow(new Date(dateString), {
      addSuffix: true,
      locale: enUS,
    });
  } catch {
    return "Unknown";
  }
}

function toActivityItem(song: Song): ActivityItem {
  return {
    id: song.id,
    title: song.title,
    subtitle: song.artist_composer || undefined,
    updated_at: song.updated_at,
    href: `/admin/songs/${song.id}`,
    is_visible: song.is_visible,
  };
}

function toActivityItemPlaylist(playlist: Playlist): ActivityItem {
  return {
    id: playlist.id,
    title: playlist.name,
    subtitle: playlist.description || undefined,
    updated_at: playlist.updated_at,
    href: `/admin/playlists/${playlist.id}`,
    status: playlist.status,
  };
}

function toActivityItemEvent(event: Event): ActivityItem {
  return {
    id: event.id,
    title: event.name,
    subtitle: event.event_date,
    updated_at: event.updated_at,
    href: `/admin/events/${event.id}`,
    is_visible: event.is_visible,
  };
}

function getStatusBadge(item: ActivityItem, activeTab: TabType) {
  if (activeTab === "playlists" && item.status) {
    return <StatusBadge status={item.status as DashboardStatus} />;
  }

  const status = item.is_visible === false ? "hidden" : "visible";
  return <StatusBadge status={status} />;
}

function ActivityItemRow({
  item,
  activeTab,
  index,
}: {
  item: ActivityItem;
  activeTab: TabType;
  index: number;
}) {
  const isOdd = index % 2 === 1;

  return (
    <Link
      href={item.href}
      className={cn(
        "group flex flex-col p-2 items-start gap-3 rounded-lg transition-colors hover:bg-accent/50 min-h-[44px]",
        isOdd && "bg-zinc-100 dark:bg-zinc-800/50"
      )}
    >
      <div className="flex-1 w-full space-y-0">
        <div className="flex items-center w-full justify-between">
          <span className="font-medium text-sm truncate">{item.title}</span>
          {getStatusBadge(item, activeTab)}
        </div>
        {item.subtitle && (
          <p className="text-xs text-muted-foreground truncate">
            {item.subtitle}
          </p>
        )}
      </div>
      <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0 pt-0.5 w-full justify-end">
        <span className="hidden sm:inline">
          ({formatTimeAgo(item.updated_at)})
        </span>
        <ChevronRightIcon className="h-4 w-4 group-hover:opacity-80 transition-opacity" />
      </div>
    </Link>
  );
}

function ActivityList({
  items,
  activeTab,
}: {
  items: ActivityItem[];
  activeTab: TabType;
}) {
  const config = TAB_CONFIG[activeTab];
  const EmptyIcon = config.emptyIcon;

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <EmptyIcon className="h-8 w-8 text-muted-foreground/50" />
        <p className="mt-3 text-sm text-muted-foreground">
          {config.emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-1 overflow-y-auto pr-1 flex-1">
      {items.map((item, index) => (
        <ActivityItemRow
          key={item.id}
          item={item}
          activeTab={activeTab}
          index={index}
        />
      ))}
    </div>
  );
}

function TabButton({ tab }: { tab: TabType }) {
  const config = TAB_CONFIG[tab];
  const Icon = config.icon;

  return (
    <TabsTrigger
      value={tab}
      className={cn(
        "text-xs gap-1.5 data-[state=active]:bg-background data-[state=active]:shadow-sm",
        "transition-all duration-200"
      )}
    >
      <Icon className="h-3.5 w-3.5" />
    </TabsTrigger>
  );
}

export function RecentActivity({
  songs,
  playlists,
  events,
}: RecentActivityProps) {
  const [activeTab, setActiveTab] = useState<TabType>("songs");

  const songsItems = songs.map(toActivityItem);
  const playlistsItems = playlists.map(toActivityItemPlaylist);
  const eventsItems = events.map(toActivityItemEvent);

  const tabContent = {
    songs: songsItems,
    playlists: playlistsItems,
    events: eventsItems,
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="shrink-0">
        <CardTitle className="text-base">Recently Updated</CardTitle>
      </CardHeader>
      <CardContent className="pt-0 flex-1 flex flex-col min-h-0">
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as TabType)}
          className="flex flex-col h-full"
        >
          <TabsList className="grid w-full grid-cols-3 h-9 bg-muted/50">
            {(Object.keys(TAB_CONFIG) as TabType[]).map((tab) => (
              <TabButton key={tab} tab={tab} />
            ))}
          </TabsList>

          {(Object.keys(TAB_CONFIG) as TabType[]).map((tab) => (
            <TabsContent key={tab} value={tab} className="mt-3 flex-1 min-h-0 overflow-hidden">
              <ActivityList items={tabContent[tab]} activeTab={tab} />
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
