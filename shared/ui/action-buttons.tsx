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

interface EditButtonProps {
  href: string;
  className?: string;
}

export function EditButton({ href, className }: EditButtonProps) {
  return (
    <ActionButton
      label="Edit"
      href={href}
      variant="secondary"
      size="sm"
      className={className}
    />
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
    <ConfirmActionButton
      label="Delete"
      onConfirm={onDelete}
      variant="destructive"
      size="sm"
      disabled={disabled}
      confirmTitle={`Delete "${itemName}"?`}
      confirmDescription="This action cannot be undone. This will permanently delete this item."
      confirmLabel="Delete"
      className={className}
    />
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
    <ConfirmActionButton
      label="Archive"
      onConfirm={onArchive}
      variant="destructive"
      size="sm"
      disabled={disabled}
      confirmTitle={`Archive "${itemName}"?`}
      confirmDescription="This item will be moved to the archive. You can restore it later."
      confirmLabel="Archive"
      className={className}
    />
  );
}

interface RestoreButtonProps {
  onRestore: () => void;
  disabled?: boolean;
  className?: string;
}

export function RestoreButton({ onRestore, disabled, className }: RestoreButtonProps) {
  return (
    <ActionButton
      label="Restore"
      onClick={onRestore}
      variant="default"
      size="sm"
      disabled={disabled}
      className={cn("bg-green-600 hover:bg-green-700 text-white", className)}
    />
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

