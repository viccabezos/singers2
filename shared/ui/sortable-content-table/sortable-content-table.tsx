"use client";

import { useCallback } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SortableRow } from "./sortable-row";
import { ContentPicker } from "./content-picker";

export interface ContentColumn<T> {
  key: string;
  header?: string;
  width?: string;
  className?: string;
  render: (item: T, index: number) => React.ReactNode;
}

export interface ContentPickerConfig<T, S = T> {
  searchPlaceholder: string;
  onSearch: (query: string) => Promise<S[]> | S[];
  onAdd: (item: S) => void;
  renderResult: (item: S) => React.ReactNode;
  getItemId: (item: S) => string;
  buttonLabel?: string;
}

export interface SortableContentTableProps<T, S = T> {
  // Data
  items: T[];
  onReorder: (items: T[]) => void;
  onRemove: (id: string) => void;

  // Item identification
  getItemId: (item: T) => string;

  // Display configuration
  columns: ContentColumn<T>[];
  emptyState?: {
    icon?: React.ComponentType<{ className?: string }>;
    title: string;
    description?: string;
  };

  // Picker configuration (optional)
  picker?: ContentPickerConfig<T, S>;

  // State
  disabled?: boolean;

  // Styling
  className?: string;
}

export function SortableContentTable<T, S = T>({
  items,
  onReorder,
  onRemove,
  getItemId,
  columns,
  emptyState,
  picker,
  disabled,
  className,
}: SortableContentTableProps<T, S>) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (over && active.id !== over.id) {
        const oldIndex = items.findIndex(
          (item) => getItemId(item) === active.id
        );
        const newIndex = items.findIndex((item) => getItemId(item) === over.id);
        const newItems = arrayMove(items, oldIndex, newIndex);
        onReorder(newItems);
      }
    },
    [items, getItemId, onReorder]
  );

  const itemIds = items.map(getItemId);

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header with picker */}
      {picker && (
        <div className="flex justify-end">
          <ContentPicker
            searchPlaceholder={picker.searchPlaceholder}
            onSearch={picker.onSearch}
            onAdd={picker.onAdd}
            renderResult={picker.renderResult}
            getItemId={picker.getItemId}
            buttonLabel={picker.buttonLabel}
            disabled={disabled}
          />
        </div>
      )}

      {/* Empty state */}
      {items.length === 0 && emptyState && (
        <div className="py-12 text-center">
          {emptyState.icon && (
            <emptyState.icon className="mx-auto h-12 w-12 text-zinc-400" />
          )}
          <h3 className="mt-2 text-sm font-medium text-zinc-900 dark:text-zinc-50">
            {emptyState.title}
          </h3>
          {emptyState.description && (
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              {emptyState.description}
            </p>
          )}
        </div>
      )}

      {/* Table */}
      {items.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToVerticalAxis]}
        >
          <SortableContext
            items={itemIds}
            strategy={verticalListSortingStrategy}
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10" />
                  <TableHead className="w-12 text-center">#</TableHead>
                  {columns.map((column) => (
                    <TableHead
                      key={column.key}
                      className={column.className}
                      style={column.width ? { width: column.width } : undefined}
                    >
                      {column.header}
                    </TableHead>
                  ))}
                  <TableHead className="w-16" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item, index) => (
                  <SortableRow
                    key={getItemId(item)}
                    id={getItemId(item)}
                    disabled={disabled}
                  >
                    <TableCell className="w-12 text-center text-sm font-medium text-zinc-500">
                      {index + 1}
                    </TableCell>
                    {columns.map((column) => (
                      <TableCell
                        key={column.key}
                        className={column.className}
                        style={
                          column.width ? { width: column.width } : undefined
                        }
                      >
                        {column.render(item, index)}
                      </TableCell>
                    ))}
                    <TableCell className="w-16">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => onRemove(getItemId(item))}
                        disabled={disabled}
                        className="h-8 w-8 text-red-500 hover:bg-red-100 hover:text-red-700 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </SortableRow>
                ))}
              </TableBody>
            </Table>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}

