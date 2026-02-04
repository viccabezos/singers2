import Link from "next/link";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface PublicHeaderProps {
  className?: string;
}

export function PublicHeader({ className }: PublicHeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-zinc-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60",
        "dark:border-zinc-800 dark:bg-zinc-900/95 dark:supports-[backdrop-filter]:bg-zinc-900/60",
        className
      )}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 transition-opacity hover:opacity-80"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
              <CalendarIcon className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
              Les Chanteurs
            </span>
          </Link>

          <nav className="flex items-center gap-4">
            <Link
              href="/events"
              className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
            >
              Events
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
