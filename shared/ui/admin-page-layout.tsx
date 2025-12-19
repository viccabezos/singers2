import { cn } from "@/lib/utils";
import { Breadcrumbs, type BreadcrumbItem } from "./breadcrumbs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

interface AdminPageLayoutProps {
  breadcrumbs: BreadcrumbItem[];
  title: string;
  description?: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
    icon?: LucideIcon;
  };
  children: ReactNode;
  className?: string;
}

export function AdminPageLayout({
  breadcrumbs,
  title,
  description,
  action,
  children,
  className,
}: AdminPageLayoutProps) {
  const ActionIcon = action?.icon;

  return (
    <div className={cn("min-h-screen bg-zinc-50 p-4 dark:bg-black sm:p-6 lg:p-8", className)}>
      <div className="mx-auto max-w-7xl">
        <Breadcrumbs items={breadcrumbs} />
        
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50 sm:text-3xl">
              {title}
            </h1>
            {description && (
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                {description}
              </p>
            )}
          </div>
          
          {action && (
            action.href ? (
              <Button asChild>
                <Link href={action.href} className="inline-flex items-center gap-2">
                  {ActionIcon && <ActionIcon className="h-4 w-4" />}
                  {action.label}
                </Link>
              </Button>
            ) : (
              <Button onClick={action.onClick} className="inline-flex items-center gap-2">
                {ActionIcon && <ActionIcon className="h-4 w-4" />}
                {action.label}
              </Button>
            )
          )}
        </div>
        
        {children}
      </div>
    </div>
  );
}

// Simpler variant without the wrapper div for pages that manage their own layout
interface PageHeaderProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
    icon?: LucideIcon;
  };
  className?: string;
}

export function PageHeader({ title, description, action, className }: PageHeaderProps) {
  const ActionIcon = action?.icon;

  return (
    <div className={cn("mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between", className)}>
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50 sm:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            {description}
          </p>
        )}
      </div>
      
      {action && (
        action.href ? (
          <Button asChild>
            <Link href={action.href} className="inline-flex items-center gap-2">
              {ActionIcon && <ActionIcon className="h-4 w-4" />}
              {action.label}
            </Link>
          </Button>
        ) : (
          <Button onClick={action.onClick} className="inline-flex items-center gap-2">
            {ActionIcon && <ActionIcon className="h-4 w-4" />}
            {action.label}
          </Button>
        )
      )}
    </div>
  );
}

