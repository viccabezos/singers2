"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Link from "next/link";
import { PencilIcon, ArchiveIcon, Trash2Icon, RotateCcwIcon } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface ActionButtonProps {
  label: string;
  onClick?: () => void;
  href?: string;
  variant?: "default" | "secondary" | "destructive" | "outline" | "ghost";
  size?: "default" | "sm";
  icon?: LucideIcon;
  disabled?: boolean;
  className?: string;
}

export function ActionButton({
  label,
  onClick,
  href,
  variant = "secondary",
  size = "sm",
  icon: Icon,
  disabled = false,
  className,
}: ActionButtonProps) {
  const buttonContent = (
    <>
      {Icon && <Icon className="h-3 w-3" />}
      {label}
    </>
  );

  if (href) {
    return (
      <Button
        asChild
        variant={variant}
        size={size}
        className={cn("inline-flex items-center gap-1", className)}
      >
        <Link href={href}>{buttonContent}</Link>
      </Button>
    );
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={onClick}
      disabled={disabled}
      className={cn("inline-flex items-center gap-1", className)}
    >
      {buttonContent}
    </Button>
  );
}

interface ConfirmActionButtonProps {
  label: string;
  onConfirm: () => void;
  variant?: "default" | "secondary" | "destructive" | "outline" | "ghost";
  size?: "default" | "sm";
  icon?: LucideIcon;
  disabled?: boolean;
  confirmTitle: string;
  confirmDescription: string;
  confirmLabel?: string;
  cancelLabel?: string;
  className?: string;
}

export function ConfirmActionButton({
  label,
  onConfirm,
  variant = "destructive",
  size = "sm",
  icon: Icon,
  disabled = false,
  confirmTitle,
  confirmDescription,
  confirmLabel = "Continue",
  cancelLabel = "Cancel",
  className,
}: ConfirmActionButtonProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant={variant}
          size={size}
          disabled={disabled}
          className={cn("inline-flex items-center gap-1", className)}
        >
          {Icon && <Icon className="h-3 w-3" />}
          {label}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{confirmTitle}</AlertDialogTitle>
          <AlertDialogDescription>{confirmDescription}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>{confirmLabel}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// Pre-configured action buttons for common use cases
// These buttons show icon-only on mobile for space efficiency

interface EditButtonProps {
  href: string;
  className?: string;
}

export function EditButton({ href, className }: EditButtonProps) {
  return (
    <>
      {/* Mobile: Icon only */}
      <Button
        asChild
        variant="secondary"
        size="icon"
        className={cn("h-8 w-8 md:hidden", className)}
      >
        <Link href={href}>
          <PencilIcon className="h-4 w-4" />
          <span className="sr-only">Edit</span>
        </Link>
      </Button>
      {/* Desktop: Full button */}
      <Button
        asChild
        variant="secondary"
        size="sm"
        className={cn("hidden md:inline-flex", className)}
      >
        <Link href={href}>Edit</Link>
      </Button>
    </>
  );
}

interface DeleteButtonProps {
  onDelete: () => void;
  itemName: string;
  disabled?: boolean;
  className?: string;
}

export function DeleteButton({ onDelete, itemName, disabled, className }: DeleteButtonProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <>
          {/* Mobile: Icon only */}
          <Button
            variant="destructive"
            size="icon"
            disabled={disabled}
            className={cn("h-8 w-8 md:hidden", className)}
          >
            <Trash2Icon className="h-4 w-4" />
            <span className="sr-only">Delete</span>
          </Button>
          {/* Desktop: Full button */}
          <Button
            variant="destructive"
            size="sm"
            disabled={disabled}
            className={cn("hidden md:inline-flex", className)}
          >
            Delete
          </Button>
        </>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete &quot;{itemName}&quot;?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this item.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onDelete}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

interface ArchiveButtonProps {
  onArchive: () => void;
  itemName: string;
  disabled?: boolean;
  className?: string;
}

export function ArchiveButton({ onArchive, itemName, disabled, className }: ArchiveButtonProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <>
          {/* Mobile: Icon only */}
          <Button
            variant="destructive"
            size="icon"
            disabled={disabled}
            className={cn("h-8 w-8 md:hidden", className)}
          >
            <ArchiveIcon className="h-4 w-4" />
            <span className="sr-only">Archive</span>
          </Button>
          {/* Desktop: Full button */}
          <Button
            variant="destructive"
            size="sm"
            disabled={disabled}
            className={cn("hidden md:inline-flex", className)}
          >
            Archive
          </Button>
        </>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Archive &quot;{itemName}&quot;?</AlertDialogTitle>
          <AlertDialogDescription>
            This item will be moved to the archive. You can restore it later.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onArchive}>Archive</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

interface RestoreButtonProps {
  onRestore: () => void;
  disabled?: boolean;
  className?: string;
}

export function RestoreButton({ onRestore, disabled, className }: RestoreButtonProps) {
  return (
    <>
      {/* Mobile: Icon only */}
      <Button
        variant="default"
        size="icon"
        onClick={onRestore}
        disabled={disabled}
        className={cn("h-8 w-8 bg-green-600 hover:bg-green-700 text-white md:hidden", className)}
      >
        <RotateCcwIcon className="h-4 w-4" />
        <span className="sr-only">Restore</span>
      </Button>
      {/* Desktop: Full button */}
      <Button
        variant="default"
        size="sm"
        onClick={onRestore}
        disabled={disabled}
        className={cn("hidden bg-green-600 hover:bg-green-700 text-white md:inline-flex", className)}
      >
        Restore
      </Button>
    </>
  );
}

// Action button group for consistent spacing
interface ActionButtonGroupProps {
  children: React.ReactNode;
  className?: string;
}

export function ActionButtonGroup({ children, className }: ActionButtonGroupProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {children}
    </div>
  );
}

