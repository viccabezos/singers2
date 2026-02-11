"use client";

import { useState } from "react";
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
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { SearchIcon, SlidersHorizontalIcon, XIcon } from "lucide-react";
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
  onApply?: () => void;
  className?: string;
}

export function FilterPanel({
  filters,
  values,
  onChange,
  onApply,
  className,
}: FilterPanelProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Find search filter
  const searchFilter = filters.find((f) => f.type === "search");
  const otherFilters = filters.filter((f) => f.type !== "search");

  // Count active filters (non-default values)
  const activeFilterCount = otherFilters.filter(
    (f) => values[f.id] && values[f.id] !== "all"
  ).length;

  // Clear all filters
  const handleClearFilters = () => {
    otherFilters.forEach((f) => onChange(f.id, "all"));
  };

  return (
    <>
      {/* Mobile: Search bar + Filter button */}
      <div className={cn("mb-6 md:hidden", className)}>
        <div className="flex gap-2">
          {/* Search input */}
          {searchFilter && (
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <Input
                type="text"
                value={values[searchFilter.id] || ""}
                onChange={(e) => onChange(searchFilter.id, e.target.value)}
                placeholder={searchFilter.placeholder || "Search..."}
                className="pl-10"
              />
            </div>
          )}

          {/* Filter button with drawer */}
          {otherFilters.length > 0 && (
            <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
              <DrawerTrigger asChild>
                <Button variant="outline" size="icon" className="relative shrink-0">
                  <SlidersHorizontalIcon className="h-4 w-4" />
                  {activeFilterCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                      {activeFilterCount}
                    </span>
                  )}
                  <span className="sr-only">Filters</span>
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader className="pb-2">
                  <DrawerTitle>Filters</DrawerTitle>
                </DrawerHeader>
                <div className="space-y-4 px-4 pb-4">
                  {otherFilters.map((filter) => (
                    <div key={filter.id}>
                      <label
                        htmlFor={filter.id}
                        className="block text-sm font-medium text-zinc-900 dark:text-zinc-50 mb-1"
                      >
                        {filter.label}
                      </label>
                      <Select
                        value={values[filter.id] || undefined}
                        onValueChange={(value) => onChange(filter.id, value)}
                      >
                        <SelectTrigger id={filter.id} className="w-full">
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
                    </div>
                  ))}
                  
                  {/* Apply button */}
                  {onApply && (
                    <Button
                      size="sm"
                      onClick={() => {
                        onApply();
                        setDrawerOpen(false);
                      }}
                      className="w-full"
                    >
                      Apply Filters
                    </Button>
                  )}
                  
                  {/* Clear button - only show if filters are active */}
                  {activeFilterCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClearFilters}
                      className="text-muted-foreground w-full"
                    >
                      <XIcon className="h-4 w-4 mr-1" />
                      Clear filters
                    </Button>
                  )}
                </div>
              </DrawerContent>
            </Drawer>
          )}
        </div>
      </div>

      {/* Desktop: Inline filter bar */}
      <div
        className={cn(
          "mb-6 hidden items-center gap-3 rounded-lg bg-white p-3 shadow-sm dark:bg-zinc-900 md:flex",
          className
        )}
      >
        {/* Search input */}
        {searchFilter && (
          <div className="relative flex-1 max-w-sm">
            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <Input
              type="text"
              value={values[searchFilter.id] || ""}
              onChange={(e) => onChange(searchFilter.id, e.target.value)}
              placeholder={searchFilter.placeholder || "Search..."}
              className="pl-10"
            />
          </div>
        )}

        {/* Select filters inline */}
        {otherFilters.map((filter) => (
          <Select
            key={filter.id}
            value={values[filter.id] || undefined}
            onValueChange={(value) => onChange(filter.id, value)}
          >
            <SelectTrigger className="w-auto min-w-[140px]">
              <SelectValue placeholder={filter.placeholder || filter.label} />
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
        ))}

        {/* Apply button */}
        {onApply && (
          <Button
            size="sm"
            onClick={onApply}
            className="shrink-0"
          >
            Apply
          </Button>
        )}

        {/* Clear filters button (only show if filters are active) */}
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="text-muted-foreground shrink-0"
          >
            <XIcon className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>
    </>
  );
}

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
