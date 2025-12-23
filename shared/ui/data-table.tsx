"use client";

import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { EmptyState } from "./empty-state";
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

export interface Column<T> {
  key: string;
  header: string;
  accessor?: keyof T;
  render?: (item: T, index: number) => ReactNode;
  className?: string;
  hideOnMobile?: boolean;
}

interface DataTableProps<T extends { id: string }> {
  data: T[];
  columns: Column<T>[];
  selectable?: boolean;
  selectedIds?: Set<string>;
  onSelectionChange?: (ids: Set<string>) => void;
  emptyState?: {
    icon?: LucideIcon;
    title: string;
    description?: string;
    action?: {
      label: string;
      href?: string;
      onClick?: () => void;
    };
  };
  className?: string;
}

export function DataTable<T extends { id: string }>({
  data,
  columns,
  selectable = false,
  selectedIds = new Set(),
  onSelectionChange,
  emptyState,
  className,
}: DataTableProps<T>) {
  const allSelected = data.length > 0 && selectedIds.size === data.length;

  const handleSelectAll = () => {
    if (!onSelectionChange) return;
    if (allSelected) {
      onSelectionChange(new Set());
    } else {
      onSelectionChange(new Set(data.map((item) => item.id)));
    }
  };

  const handleSelectOne = (id: string) => {
    if (!onSelectionChange) return;
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    onSelectionChange(newSelected);
  };

  if (data.length === 0 && emptyState) {
    return (
      <div className={cn("rounded-lg bg-white shadow-sm dark:bg-zinc-900", className)}>
        <EmptyState
          icon={emptyState.icon}
          title={emptyState.title}
          description={emptyState.description}
          action={emptyState.action}
        />
      </div>
    );
  }

  return (
    <div className={cn("rounded-lg bg-white shadow-sm dark:bg-zinc-900", className)}>
      <Table>
        <TableHeader>
          <TableRow>
            {selectable && (
              <TableHead className="w-12">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all"
                />
              </TableHead>
            )}
            {columns.map((column) => (
              <TableHead
                key={column.key}
                className={cn(
                  column.className,
                  column.hideOnMobile && "hidden sm:table-cell"
                )}
              >
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => (
            <TableRow 
              key={item.id}
              className={index % 2 === 1 ? "bg-zinc-50 dark:bg-zinc-800/50" : ""}
            >
              {selectable && (
                <TableCell>
                  <Checkbox
                    checked={selectedIds.has(item.id)}
                    onCheckedChange={() => handleSelectOne(item.id)}
                    aria-label={`Select row ${index + 1}`}
                  />
                </TableCell>
              )}
              {columns.map((column) => (
                <TableCell
                  key={column.key}
                  className={cn(
                    column.className,
                    column.hideOnMobile && "hidden sm:table-cell"
                  )}
                >
                  {column.render
                    ? column.render(item, index)
                    : column.accessor
                    ? String(item[column.accessor] ?? "-")
                    : "-"}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

// Bulk actions bar that appears when items are selected
// Inline horizontal scrollable bar (under filters/search)
interface BulkActionsBarProps {
  selectedCount: number;
  onClearSelection: () => void;
  children: ReactNode;
  className?: string;
}

export function BulkActionsBar({
  selectedCount,
  onClearSelection,
  children,
  className,
}: BulkActionsBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div
      className={cn(
        "mb-4 flex items-center gap-2 rounded-lg bg-zinc-100 p-2 dark:bg-zinc-800 overflow-x-auto",
        className
      )}
    >
      {/* Mobile: short label */}
      <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 shrink-0 md:hidden">
        {selectedCount} sel.
      </span>
      {/* Desktop: full label */}
      <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 shrink-0 hidden md:inline">
        {selectedCount} selected
      </span>
      <div className="flex items-center gap-2">
        {children}
      </div>
      <button
        onClick={onClearSelection}
        className="shrink-0 rounded-md bg-zinc-600 px-2 py-1 text-sm font-medium text-white hover:bg-zinc-700 ml-auto"
      >
        <span className="md:hidden">Clear</span>
        <span className="hidden md:inline">Clear Selection</span>
      </button>
    </div>
  );
}

// Card-style list for events and other card-based displays
interface DataCardListProps<T extends { id: string }> {
  data: T[];
  renderCard: (item: T, index: number) => ReactNode;
  emptyState?: {
    icon?: LucideIcon;
    title: string;
    description?: string;
    action?: {
      label: string;
      href?: string;
      onClick?: () => void;
    };
  };
  className?: string;
}

export function DataCardList<T extends { id: string }>({
  data,
  renderCard,
  emptyState,
  className,
}: DataCardListProps<T>) {
  if (data.length === 0 && emptyState) {
    return (
      <div className={cn("rounded-lg bg-white shadow-sm dark:bg-zinc-900", className)}>
        <EmptyState
          icon={emptyState.icon}
          title={emptyState.title}
          description={emptyState.description}
          action={emptyState.action}
        />
      </div>
    );
  }

  return (
    <div className={cn("rounded-lg bg-white shadow-sm dark:bg-zinc-900", className)}>
      <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
        {data.map((item, index) => renderCard(item, index))}
      </div>
    </div>
  );
}

