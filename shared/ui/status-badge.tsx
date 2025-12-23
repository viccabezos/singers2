import { cn } from "@/lib/utils";
import { EyeIcon, EyeOffIcon, StarIcon } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type VisibilityStatus = "visible" | "hidden";
type PlaylistStatus = "visible" | "hidden" | "in_progress" | "archived";
type EventStatus = "current" | "past";

interface StatusBadgeProps {
  variant: VisibilityStatus | PlaylistStatus | EventStatus;
  showIcon?: boolean;
  /** Show compact version on mobile (shorter labels or icon-only for some variants) */
  compactOnMobile?: boolean;
  className?: string;
}

const statusConfig: Record<
  VisibilityStatus | PlaylistStatus | EventStatus,
  { label: string; shortLabel?: string; className: string; icon?: LucideIcon }
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
    shortLabel: "WIP",
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

export function StatusBadge({ variant, showIcon = false, compactOnMobile = false, className }: StatusBadgeProps) {
  const config = statusConfig[variant];
  const Icon = config.icon;

  // For visibility variants (visible/hidden), show icon-only on mobile
  const isVisibilityVariant = variant === "visible" || variant === "hidden";

  if (compactOnMobile && isVisibilityVariant && Icon) {
    return (
      <>
        {/* Mobile: Icon only */}
        <span
          className={cn(
            "inline-flex items-center justify-center rounded-full p-1.5 md:hidden",
            config.className,
            className
          )}
          title={config.label}
        >
          <Icon className="h-3.5 w-3.5" />
        </span>
        {/* Desktop: Full badge */}
        <span
          className={cn(
            "hidden items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium md:inline-flex",
            config.className,
            className
          )}
        >
          {showIcon && Icon && <Icon className="h-3 w-3" />}
          {config.label}
        </span>
      </>
    );
  }

  // For other variants, use short label on mobile if available
  if (compactOnMobile && config.shortLabel) {
    return (
      <>
        {/* Mobile: Short label */}
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium md:hidden",
            config.className,
            className
          )}
        >
          {showIcon && Icon && <Icon className="h-3 w-3" />}
          {config.shortLabel}
        </span>
        {/* Desktop: Full label */}
        <span
          className={cn(
            "hidden items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium md:inline-flex",
            config.className,
            className
          )}
        >
          {showIcon && Icon && <Icon className="h-3 w-3" />}
          {config.label}
        </span>
      </>
    );
  }

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
  /** Show icon-only on mobile to save space */
  compactOnMobile?: boolean;
  className?: string;
}

export function VisibilityBadge({ 
  isVisible, 
  showIcon = false, 
  compactOnMobile = false,
  className 
}: VisibilityBadgeProps) {
  const Icon = isVisible ? EyeIcon : EyeOffIcon;
  
  if (compactOnMobile) {
    return (
      <>
        {/* Mobile: Icon only */}
        <span
          className={cn(
            "inline-flex items-center justify-center rounded-full p-1.5 md:hidden",
            isVisible 
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
              : "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
            className
          )}
          title={isVisible ? "Visible" : "Hidden"}
        >
          <Icon className="h-3.5 w-3.5" />
        </span>
        {/* Desktop: Full badge */}
        <StatusBadge
          variant={isVisible ? "visible" : "hidden"}
          showIcon={showIcon}
          className={cn("hidden md:inline-flex", className)}
        />
      </>
    );
  }

  return (
    <StatusBadge
      variant={isVisible ? "visible" : "hidden"}
      showIcon={showIcon}
      className={className}
    />
  );
}

