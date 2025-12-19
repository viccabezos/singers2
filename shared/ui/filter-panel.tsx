"use client";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchIcon } from "lucide-react";
import type { ReactNode } from "react";

interface FilterConfig {
  type: "search" | "select";
  id: string;
  label: string;
  placeholder?: string;
  options?: { value: string; label: string }[];
  colSpan?: number;
  icon?: boolean;
}

interface FilterPanelProps {
  filters: FilterConfig[];
  values: Record<string, string>;
  onChange: (id: string, value: string) => void;
  onApply: () => void;
  className?: string;
}

export function FilterPanel({
  filters,
  values,
  onChange,
  onApply,
  className,
}: FilterPanelProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onApply();
    }
  };

  return (
    <div
      className={cn(
        "mb-6 space-y-4 rounded-lg bg-white p-4 shadow-sm dark:bg-zinc-900",
        "sm:grid sm:gap-4",
        className
      )}
      style={{
        gridTemplateColumns: `repeat(${filters.length + 1}, minmax(0, 1fr))`,
      }}
    >
      {filters.map((filter) => (
        <div
          key={filter.id}
          className={filter.colSpan ? `sm:col-span-${filter.colSpan}` : ""}
          style={filter.colSpan ? { gridColumn: `span ${filter.colSpan}` } : undefined}
        >
          <label
            htmlFor={filter.id}
            className="block text-sm font-medium text-zinc-900 dark:text-zinc-50"
          >
            {filter.label}
          </label>
          {filter.type === "search" ? (
            <div className="relative mt-1">
              {filter.icon && (
                <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              )}
              <Input
                id={filter.id}
                type="text"
                value={values[filter.id] || ""}
                onChange={(e) => onChange(filter.id, e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={filter.placeholder}
                className={filter.icon ? "pl-10" : ""}
              />
            </div>
          ) : (
            <Select
              value={values[filter.id] || undefined}
              onValueChange={(value) => onChange(filter.id, value)}
            >
              <SelectTrigger id={filter.id} className="mt-1 w-full">
                <SelectValue placeholder={filter.placeholder || "Select..."} />
              </SelectTrigger>
              <SelectContent>
                {filter.options
                  ?.filter((option) => option.value !== "")
                  .map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          )}
        </div>
      ))}
      <div className="flex items-end">
        <Button onClick={onApply} className="w-full">
          Apply Filters
        </Button>
      </div>
    </div>
  );
}

// Simpler inline filter row for events-style filtering
interface InlineFiltersProps {
  children: ReactNode;
  className?: string;
}

export function InlineFilters({ children, className }: InlineFiltersProps) {
  return (
    <div className={cn("mb-6 flex flex-col gap-4 sm:flex-row", className)}>
      {children}
    </div>
  );
}

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
  className?: string;
}

export function SearchInput({
  value,
  onChange,
  onSubmit,
  placeholder = "Search...",
  className,
}: SearchInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && onSubmit) {
      onSubmit();
    }
  };

  return (
    <div className={cn("relative flex-1", className)}>
      <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="pl-10"
      />
    </div>
  );
}

interface FilterSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  className?: string;
}

export function FilterSelect({
  value,
  onChange,
  options,
  placeholder = "Select...",
  className,
}: FilterSelectProps) {
  return (
    <Select value={value || undefined} onValueChange={onChange}>
      <SelectTrigger className={cn("w-full sm:w-auto", className)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options
          .filter((option) => option.value !== "")
          .map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  );
}

