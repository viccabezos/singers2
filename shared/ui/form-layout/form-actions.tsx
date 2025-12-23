"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FormAction {
  label: string;
  onClick: () => void;
  variant?: "default" | "secondary" | "destructive" | "outline" | "ghost";
  disabled?: boolean;
}

interface FormActionsProps {
  primaryLabel: string;
  primaryLoadingLabel?: string;
  onCancel?: () => void;
  cancelLabel?: string;
  extraActions?: FormAction[];
  isPending?: boolean;
  className?: string;
}

export function FormActions({
  primaryLabel,
  primaryLoadingLabel = "Saving...",
  onCancel,
  cancelLabel = "Cancel",
  extraActions,
  isPending = false,
  className,
}: FormActionsProps) {
  return (
    // Left-align on mobile (avoid FAB overlap), right-align on desktop
    <div className={cn("flex justify-start gap-4 md:justify-end", className)}>
      {/* Extra actions (leftmost) */}
      {extraActions?.map((action, index) => (
        <Button
          key={index}
          type="button"
          variant={action.variant || "secondary"}
          onClick={action.onClick}
          disabled={isPending || action.disabled}
        >
          {action.label}
        </Button>
      ))}

      {/* Cancel button */}
      {onCancel && (
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isPending}
        >
          {cancelLabel}
        </Button>
      )}

      {/* Primary button (rightmost) */}
      <Button type="submit" disabled={isPending}>
        {isPending ? primaryLoadingLabel : primaryLabel}
      </Button>
    </div>
  );
}

