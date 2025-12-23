"use client";

import { cn } from "@/lib/utils";

interface FormSectionProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  card?: boolean;
  className?: string;
}

export function FormSection({
  children,
  title,
  description,
  card = true,
  className,
}: FormSectionProps) {
  const content = (
    <>
      {(title || description) && (
        <div className="mb-4">
          {title && (
            <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-50">
              {title}
            </h2>
          )}
          {description && (
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              {description}
            </p>
          )}
        </div>
      )}
      <div className="space-y-4">{children}</div>
    </>
  );

  if (!card) {
    return <div className={className}>{content}</div>;
  }

  return (
    <div
      className={cn(
        "rounded-lg bg-white p-6 shadow-sm dark:bg-zinc-900",
        className
      )}
    >
      {content}
    </div>
  );
}

