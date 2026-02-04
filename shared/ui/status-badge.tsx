import { cn } from "@/lib/utils";
import {
  EyeIcon,
  EyeOffIcon,
  StarIcon,
  ArchiveIcon,
  HistoryIcon,
  CalendarIcon,
  Loader2,
  FilePenLineIcon,
  ActivityIcon,
  RefreshCcwIcon,
  ConstructionIcon,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

/**
 * Unified status type for all dashboard entities
 */
export type DashboardStatus =
  | "visible" // Published and visible to public
  | "hidden" // Published but hidden from public
  | "in_progress" // Work in progress (playlists)
  | "draft" // Draft state
  | "archived" // Soft-deleted/archived
  | "current" // Current event
  | "past" // Past event (by date)
  | "upcoming" // Future event (by date)
  | "featured"; // Featured content

// Legacy type aliases for backward compatibility
export type VisibilityStatus = "visible" | "hidden";
export type PlaylistStatus = "visible" | "hidden" | "in_progress" | "archived";
export type EventStatus = "current" | "past";

interface StatusBadgeProps {
  /** The status to display */
  status?: DashboardStatus;
  /** Legacy prop - use 'status' instead */
  variant?: DashboardStatus;
  className?: string;
}

const statusConfig: Record<
  DashboardStatus,
  { label: string; className: string; icon: LucideIcon }
> = {
  visible: {
    label: "Visible",
    className:
      "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
    icon: EyeIcon,
  },
  hidden: {
    label: "Hidden",
    className:
      "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
    icon: EyeOffIcon,
  },
  in_progress: {
    label: "In Progress",
    className:
      "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
    icon: ConstructionIcon,
  },
  draft: {
    label: "Draft",
    className:
      "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
    icon: FilePenLineIcon,
  },
  archived: {
    label: "Archived",
    className:
      "bg-zinc-100 text-zinc-600 dark:bg-zinc-800/30 dark:text-zinc-400",
    icon: ArchiveIcon,
  },
  current: {
    label: "Current",
    className:
      "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
    icon: StarIcon,
  },
  featured: {
    label: "Featured",
    className:
      "bg-yellow-400 text-yellow-700 dark:bg-yellow-500/30 dark:text-yellow-300",
    icon: StarIcon,
  },
  past: {
    label: "Past",
    className:
      "bg-zinc-200 text-zinc-500 dark:bg-zinc-700/30 dark:text-zinc-400",
    icon: HistoryIcon,
  },
  upcoming: {
    label: "Upcoming",
    className:
      "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
    icon: CalendarIcon,
  },
};

/**
 * StatusBadge - Displays a status indicator as an icon-only badge with tooltip
 *
 * All statuses are displayed as a 24px circular icon with a tooltip on hover.
 * This provides visual consistency and saves space in data tables.
 */
export function StatusBadge({ status, variant, className }: StatusBadgeProps) {
  // Support both 'status' (new) and 'variant' (legacy) props
  const statusValue = status ?? variant;

  if (!statusValue) {
    return null;
  }

  const config = statusConfig[statusValue];
  const Icon = config.icon;

  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            className={cn(
              "inline-flex items-center justify-center h-6 w-6 rounded-full cursor-help",
              config.className,
              className
            )}
          >
            <Icon
              className={cn(
                "h-3.5 w-3.5",
                statusValue === "current" && "fill-transparent stroke-[2]",
                statusValue === "featured" && "fill-current"
              )}
            />
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p>{config.label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
