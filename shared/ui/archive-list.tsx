"use client";

import { cn } from "@/lib/utils";
import { EmptyState } from "./empty-state";
import { RestoreButton, DeleteButton, ActionButtonGroup } from "./action-buttons";
import { ConfirmActionButton } from "./action-buttons";
import { ArchiveRestoreIcon, Trash2Icon } from "lucide-react";
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

interface ArchiveListItem {
  id: string;
  name: string;
}

interface ArchiveListProps<T extends ArchiveListItem> {
  items: T[];
  onRestore: (id: string, name: string) => void;
  onDelete: (id: string, name: string) => void;
  renderItem: (item: T) => ReactNode;
  isPending?: boolean;
  emptyState?: {
    icon?: LucideIcon;
    title: string;
    description?: string;
  };
  className?: string;
}

export function ArchiveList<T extends ArchiveListItem>({
  items,
  onRestore,
  onDelete,
  renderItem,
  isPending = false,
  emptyState = {
    title: "No archived items",
    description: "Archived items will appear here.",
  },
  className,
}: ArchiveListProps<T>) {
  if (items.length === 0) {
    return (
      <div className={cn("rounded-lg bg-white shadow-sm dark:bg-zinc-900", className)}>
        <EmptyState
          icon={emptyState.icon}
          title={emptyState.title}
          description={emptyState.description}
        />
      </div>
    );
  }

  return (
    <div className={cn("rounded-lg bg-white shadow-sm dark:bg-zinc-900", className)}>
      <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex-1 min-w-0">{renderItem(item)}</div>
            <ActionButtonGroup>
              <ConfirmActionButton
                label="Restore"
                onConfirm={() => onRestore(item.id, item.name)}
                variant="default"
                size="sm"
                icon={ArchiveRestoreIcon}
                disabled={isPending}
                confirmTitle={`Restore "${item.name}"?`}
                confirmDescription="This item will be restored and become active again."
                confirmLabel="Restore"
                className="bg-green-600 hover:bg-green-700 text-white"
              />
              <ConfirmActionButton
                label="Delete"
                onConfirm={() => onDelete(item.id, item.name)}
                variant="destructive"
                size="sm"
                icon={Trash2Icon}
                disabled={isPending}
                confirmTitle={`Permanently delete "${item.name}"?`}
                confirmDescription="This action cannot be undone. This will permanently delete this item."
                confirmLabel="Delete"
              />
            </ActionButtonGroup>
          </div>
        ))}
      </div>
    </div>
  );
}

// Back link component for archive pages
interface BackLinkProps {
  href: string;
  label: string;
  className?: string;
}

export function BackLink({ href, label, className }: BackLinkProps) {
  return (
    <div className={cn("mt-4", className)}>
      <a
        href={href}
        className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
      >
        ← {label}
      </a>
    </div>
  );
}

// Archive link for list pages
interface ArchiveLinkProps {
  href: string;
  className?: string;
}

export function ArchiveLink({ href, className }: ArchiveLinkProps) {
  return (
    <div className={cn("mt-4", className)}>
      <a
        href={href}
        className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
      >
        View Archive →
      </a>
    </div>
  );
}

