import Link from "next/link";
import { ChevronRightIcon, HomeIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PublicBreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function PublicBreadcrumbs({ items, className }: PublicBreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        "flex items-center gap-2 text-sm",
        className
      )}
    >
      <Link
        href="/"
        className="flex items-center gap-1 text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
      >
        <HomeIcon className="h-4 w-4" />
        <span className="hidden sm:inline">Home</span>
      </Link>

      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <ChevronRightIcon className="h-4 w-4 text-zinc-400" />
          {item.href ? (
            <Link
              href={item.href}
              className="text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 truncate max-w-[150px] sm:max-w-[200px]"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-zinc-900 dark:text-zinc-50 truncate max-w-[150px] sm:max-w-[200px]">
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}
