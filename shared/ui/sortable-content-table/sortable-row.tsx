"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface SortableRowProps {
  id: string;
  children: React.ReactNode;
  disabled?: boolean;
}

export function SortableRow({ id, children, disabled }: SortableRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      className={cn(
        isDragging && "opacity-50 bg-zinc-100 dark:bg-zinc-800",
        disabled && "opacity-50"
      )}
    >
      <TableCell className="w-10 px-2">
        <button
          type="button"
          className={cn(
            "flex h-10 w-10 cursor-grab items-center justify-center rounded text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300",
            isDragging && "cursor-grabbing",
            disabled && "cursor-not-allowed opacity-50"
          )}
          {...attributes}
          {...listeners}
          disabled={disabled}
        >
          <GripVertical className="h-4 w-4" />
        </button>
      </TableCell>
      {children}
    </TableRow>
  );
}

