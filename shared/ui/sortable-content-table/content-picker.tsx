"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Plus, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface ContentPickerProps<T> {
  searchPlaceholder: string;
  onSearch: (query: string) => Promise<T[]> | T[];
  onAdd: (item: T) => void;
  renderResult: (item: T) => React.ReactNode;
  getItemId: (item: T) => string;
  buttonLabel?: string;
  disabled?: boolean;
  debounceMs?: number;
}

export function ContentPicker<T>({
  searchPlaceholder,
  onSearch,
  onAdd,
  renderResult,
  getItemId,
  buttonLabel = "Add",
  disabled,
  debounceMs = 300,
}: ContentPickerProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<T[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Debounced search
  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const searchResults = await onSearch(query);
        setResults(searchResults);
      } catch {
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, isOpen, onSearch, debounceMs]);

  const handleOpen = useCallback(() => {
    setIsOpen(true);
    setQuery("");
    setResults([]);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setQuery("");
    setResults([]);
  }, []);

  const handleAdd = useCallback(
    (item: T) => {
      onAdd(item);
      handleClose();
    },
    [onAdd, handleClose]
  );

  if (!isOpen) {
    return (
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleOpen}
        disabled={disabled}
        className="gap-1"
      >
        <Plus className="h-4 w-4" />
        {buttonLabel}
      </Button>
    );
  }

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
      <div className="mb-3 flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <Input
            type="text"
            placeholder={searchPlaceholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10"
            autoFocus
          />
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handleClose}
          className="h-9 w-9 shrink-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="max-h-48 overflow-y-auto">
        {isSearching ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-5 w-5 animate-spin text-zinc-400" />
          </div>
        ) : results.length === 0 ? (
          <p className="py-4 text-center text-sm text-zinc-500 dark:text-zinc-400">
            {query ? "No results found" : "Start typing to search..."}
          </p>
        ) : (
          <ul className="divide-y divide-zinc-200 dark:divide-zinc-700">
            {results.map((item) => (
              <li key={getItemId(item)}>
                <button
                  type="button"
                  onClick={() => handleAdd(item)}
                  className={cn(
                    "w-full px-3 py-2 text-left transition-colors",
                    "hover:bg-zinc-100 dark:hover:bg-zinc-800",
                    "focus:bg-zinc-100 focus:outline-none dark:focus:bg-zinc-800"
                  )}
                >
                  {renderResult(item)}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

