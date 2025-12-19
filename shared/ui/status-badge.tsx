import { cn } from "@/lib/utils";
import { EyeIcon, EyeOffIcon, StarIcon } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type VisibilityStatus = "visible" | "hidden";
type PlaylistStatus = "visible" | "hidden" | "in_progress" | "archived";
type EventStatus = "current" | "past";

interface StatusBadgeProps {
  variant: VisibilityStatus | PlaylistStatus | EventStatus;
  showIcon?: boolean;
  className?: string;
}

const statusConfig: Record<
  VisibilityStatus | PlaylistStatus | EventStatus,
  { label: string; className: string; icon?: LucideIcon }
> = {
  visible: {
    label: "Visible",
    className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    icon: EyeIcon,
  },
  hidden: {
    label: "Hidden",
    className: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    icon: EyeOffIcon,
  },
  in_progress: {
    label: "In Progress",
    className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  },
  archived: {
    label: "Archived",
    className: "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200",
  },
  current: {
    label: "Current",
    className: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
    icon: StarIcon,
  },
  past: {
    label: "Past",
    className: "bg-zinc-200 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400",
  },
};

export function StatusBadge({ variant, showIcon = false, className }: StatusBadgeProps) {
  const config = statusConfig[variant];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
        config.className,
        className
      )}
    >
      {showIcon && Icon && <Icon className="h-3 w-3" />}
      {config.label}
    </span>
  );
}

// Convenience component for visibility status
interface VisibilityBadgeProps {
  isVisible: boolean;
  showIcon?: boolean;
  className?: string;
}

export function VisibilityBadge({ isVisible, showIcon = false, className }: VisibilityBadgeProps) {
  return (
    <StatusBadge
      variant={isVisible ? "visible" : "hidden"}
      showIcon={showIcon}
      className={className}
    />
  );
}

