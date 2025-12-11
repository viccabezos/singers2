/**
 * Utilities for validating Supabase environment variables
 * These utilities are for testing and development validation purposes.
 */

export interface SupabaseEnvValidation {
  isValid: boolean;
  errors: string[];
  url?: string;
  anonKey?: string;
}

/**
 * Validates Supabase environment variables without throwing errors.
 * Useful for testing and development validation.
 */
export function validateSupabaseEnv(): SupabaseEnvValidation {
  const errors: string[] = [];
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url) {
    errors.push("NEXT_PUBLIC_SUPABASE_URL is missing");
  } else if (!isValidUrl(url)) {
    errors.push("NEXT_PUBLIC_SUPABASE_URL has invalid format");
  }

  if (!anonKey) {
    errors.push("NEXT_PUBLIC_SUPABASE_ANON_KEY is missing");
  } else if (anonKey.length < 20) {
    errors.push("NEXT_PUBLIC_SUPABASE_ANON_KEY appears to be invalid (too short)");
  }

  return {
    isValid: errors.length === 0,
    errors,
    url,
    anonKey: anonKey ? "***" + anonKey.slice(-4) : undefined, // Mask the key for safety
  };
}

/**
 * Checks if a string is a valid URL format
 */
function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

/**
 * Gets Supabase environment variables (for testing purposes)
 */
export function getSupabaseEnv(): { url: string; anonKey: string } | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null;
  }

  return { url, anonKey };
}
