import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatEventDate(dateStr: string, format: "short" | "long" | "full" = "short") {
  const date = new Date(dateStr);
  
  const options: Intl.DateTimeFormatOptions = {
    weekday: format === "short" ? "short" : "long",
    day: "numeric",
    month: format === "short" ? "short" : "long",
  };
  
  if (format === "full") {
    options.year = "numeric";
  }
  
  return date.toLocaleDateString("fr-FR", options);
}

export function formatEventTime(timeStr: string | null) {
  if (!timeStr) return null;
  return timeStr.substring(0, 5);
}

export function formatEventDateTime(dateStr: string, timeStr: string | null) {
  const date = formatEventDate(dateStr, "short");
  const time = formatEventTime(timeStr);
  return time ? `${date} à ${time}` : date;
}

export function isPastEvent(dateStr: string) {
  const eventDate = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return eventDate < today;
}

export function isUpcomingEvent(dateStr: string) {
  const eventDate = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return eventDate >= today;
}
