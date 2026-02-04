import { SearchIcon } from "lucide-react";
import { ErrorDisplay } from "@/widgets/error-display";

export default function NotFoundPage() {
  return (
    <ErrorDisplay
      title="Page Not Found"
      message="Sorry, we couldn't find the page you're looking for. It might have been moved or deleted."
      icon={<SearchIcon className="h-10 w-10 text-zinc-400" />}
      actions={{
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
