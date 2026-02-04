"use client";

import { useEffect } from "react";
import { AlertCircleIcon } from "lucide-react";
import { ErrorDisplay } from "@/widgets/error-display";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Log error to console in development
    console.error("Public app error:", error);
  }, [error]);

  return (
    <ErrorDisplay
      title="Something Went Wrong"
      message="We apologize, but something unexpected happened. Please try again or navigate back home."
      icon={<AlertCircleIcon className="h-10 w-10 text-zinc-400" />}
      actions={{
        retry: {
          label: "Try Again",
          onClick: reset,
        },
        primary: {
          label: "Go Home",
          href: "/",
        },
        secondary: {
          label: "Browse Events",
          href: "/events",
        },
      }}
    />
  );
}
