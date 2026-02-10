"use server";

import { createEvent } from "@/shared/lib/events";
import { validateEventInput } from "@/shared/lib/event-validation";
import type { CreateEventInput } from "@/shared/types/event";
import { revalidatePath } from "next/cache";

export async function createEventAction(input: CreateEventInput) {
  const errors = validateEventInput(input, true);

  if (errors.length > 0) {
    return { error: errors[0].message, errors };
  }

  try {
    const event = await createEvent(input);
    revalidatePath("/admin/events");
    return { success: true, event };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to create event",
    };
  }
}

