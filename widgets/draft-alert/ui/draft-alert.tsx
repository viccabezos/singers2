import Link from "next/link";
import { AlertCircleIcon, MusicIcon, ListMusicIcon, CalendarIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface DraftAlertProps {
  hiddenSongsCount: number;
  draftPlaylistsCount: number;
  hiddenEventsCount: number;
}

export function DraftAlert({ 
  hiddenSongsCount, 
  draftPlaylistsCount, 
  hiddenEventsCount 
}: DraftAlertProps) {
  const totalDrafts = hiddenSongsCount + draftPlaylistsCount + hiddenEventsCount;
  
  if (totalDrafts === 0) {
    return null;
  }

  const items = [];
  
  if (hiddenSongsCount > 0) {
    items.push({
      count: hiddenSongsCount,
      label: hiddenSongsCount === 1 ? "hidden song" : "hidden songs",
      href: "/admin/songs",
      icon: MusicIcon,
    });
  }
  
  if (draftPlaylistsCount > 0) {
    items.push({
      count: draftPlaylistsCount,
      label: draftPlaylistsCount === 1 ? "draft playlist" : "draft playlists",
      href: "/admin/playlists",
      icon: ListMusicIcon,
    });
  }
  
  if (hiddenEventsCount > 0) {
    items.push({
      count: hiddenEventsCount,
      label: hiddenEventsCount === 1 ? "hidden event" : "hidden events",
      href: "/admin/events",
      icon: CalendarIcon,
    });
  }

  return (
    <Alert className="bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800">
      <AlertCircleIcon className="h-4 w-4 text-amber-600 dark:text-amber-400" />
      <AlertTitle className="text-amber-800 dark:text-amber-200">
        Unpublished Items
      </AlertTitle>
      <AlertDescription className="text-amber-700 dark:text-amber-300">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
          {items.map((item, index) => (
            <span key={item.href} className="flex items-center gap-1">
              {index > 0 && <span className="text-amber-400">•</span>}
              <Link 
                href={item.href}
                className="inline-flex items-center gap-1 hover:underline underline-offset-2"
              >
                <item.icon className="h-3.5 w-3.5" />
                <span>{item.count} {item.label}</span>
              </Link>
            </span>
          ))}
        </div>
      </AlertDescription>
    </Alert>
  );
}
