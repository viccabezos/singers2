"use server";

import { createEvent } from "@/shared/lib/events";
import { validateEventInput } from "@/shared/lib/event-validation";
import type { CreateEventInput } from "@/shared/types/event";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createEventAction(input: CreateEventInput) {
  const errors = validateEventInput(input, true);

  if (errors.length > 0) {
    return { error: errors[0].message, errors };
  }

  try {
    const event = await createEvent(input);
    revalidatePath("/admin/events");
    redirect(`/admin/events/${event.id}`);
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to create event",
    };
  }
}

