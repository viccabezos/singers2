import Link from "next/link";
import { HomeIcon, CalendarIcon, RefreshCwIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ErrorDisplayProps {
  title: string;
  message: string;
  icon?: React.ReactNode;
  actions?: {
    primary?: {
      label: string;
      href: string;
      icon?: React.ReactNode;
    };
    secondary?: {
      label: string;
      href: string;
      icon?: React.ReactNode;
    };
    retry?: {
      label: string;
      onClick: () => void;
      icon?: React.ReactNode;
    };
  };
  className?: string;
}

export function ErrorDisplay({
  title,
  message,
  icon,
  actions,
  className,
}: ErrorDisplayProps) {
  return (
    <div
      className={cn(
        "flex min-h-screen flex-col items-center justify-center",
        "bg-zinc-50 px-4 py-16 dark:bg-black",
        className
      )}
    >
      <div className="w-full max-w-md text-center">
        {/* Icon */}
        {icon && (
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
            {icon}
          </div>
        )}

        {/* Title */}
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
          {title}
        </h1>

        {/* Message */}
        <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
          {message}
        </p>

        {/* Actions */}
        {actions && (
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            {actions.retry && (
              <button
                onClick={actions.retry.onClick}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500"
              >
                {actions.retry.icon || <RefreshCwIcon className="h-4 w-4" />}
                {actions.retry.label}
              </button>
            )}

            {actions.primary && (
              <Link
                href={actions.primary.href}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500"
              >
                {actions.primary.icon || <HomeIcon className="h-4 w-4" />}
                {actions.primary.label}
              </Link>
            )}

            {actions.secondary && (
              <Link
                href={actions.secondary.href}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-medium text-zinc-900 ring-1 ring-zinc-200 transition-colors hover:bg-zinc-50 dark:bg-zinc-900 dark:text-zinc-50 dark:ring-zinc-800 dark:hover:bg-zinc-800"
              >
                {actions.secondary.icon || <CalendarIcon className="h-4 w-4" />}
                {actions.secondary.label}
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
