import type { CreateEventInput, UpdateEventInput } from "../types/event";

export interface ValidationError {
  field: string;
  message: string;
}

export function validateEventInput(
  input: CreateEventInput | UpdateEventInput,
  isCreate: boolean = true
): ValidationError[] {
  const errors: ValidationError[] = [];

  // Name validation (required for create)
  if (isCreate || "name" in input) {
    const name = (input as CreateEventInput).name;
    if (isCreate && (!name || name.trim() === "")) {
      errors.push({ field: "name", message: "Name is required" });
    } else if (name && name.trim().length > 200) {
      errors.push({ field: "name", message: "Name must be 200 characters or less" });
    }
  }

  // Description validation (optional, max length)
  if ("description" in input && input.description) {
    if (input.description.length > 5000) {
      errors.push({ field: "description", message: "Description must be 5000 characters or less" });
    }
  }

  // Date validation (required for create)
  if (isCreate || "event_date" in input) {
    const date = (input as CreateEventInput).event_date;
    if (isCreate && !date) {
      errors.push({ field: "event_date", message: "Date is required" });
    } else if (date) {
      // Validate date format (YYYY-MM-DD)
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(date)) {
        errors.push({ field: "event_date", message: "Invalid date format (expected YYYY-MM-DD)" });
      } else {
        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) {
          errors.push({ field: "event_date", message: "Invalid date" });
        }
      }
    }
  }

  // Time validation (optional)
  if ("event_time" in input && input.event_time) {
    // Validate time format (HH:MM or HH:MM:SS)
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/;
    if (!timeRegex.test(input.event_time)) {
      errors.push({ field: "event_time", message: "Invalid time format (expected HH:MM or HH:MM:SS)" });
    }
  }

  // Place validation (optional, max length)
  if ("place" in input && input.place) {
    if (input.place.length > 500) {
      errors.push({ field: "place", message: "Place must be 500 characters or less" });
    }
  }

  return errors;
}

export function isValidEventInput(
  input: CreateEventInput | UpdateEventInput,
  isCreate: boolean = true
): boolean {
  return validateEventInput(input, isCreate).length === 0;
}

