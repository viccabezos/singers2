"use client";

import { cn } from "@/lib/utils";

interface FormLayoutProps {
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  error?: string | null;
  className?: string;
}

export function FormLayout({
  children,
  onSubmit,
  error,
  className,
}: FormLayoutProps) {
  return (
    <form onSubmit={onSubmit} className={cn("space-y-6", className)}>
      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-200">
          {error}
        </div>
      )}
      {children}
    </form>
  );
}

