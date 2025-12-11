import { createClient } from "@supabase/supabase-js";
import { getSupabaseEnv } from "./supabase-env";

export interface ConnectionTestResult {
  success: boolean;
  error?: string;
  message?: string;
}

/**
 * Tests Supabase database connection
 * Returns a result object indicating success or failure
 */
export async function testSupabaseConnection(): Promise<ConnectionTestResult> {
  const env = getSupabaseEnv();

  if (!env) {
    return {
      success: false,
      error: "Missing environment variables",
      message: "NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set",
    };
  }

  try {
    const client = createClient(env.url, env.anonKey);

    // Test connection by performing a simple query
    // Using a table that should exist (songs) or a simple health check
    const { error } = await client.from("songs").select("count").limit(0);

    if (error) {
      // If songs table doesn't exist, try a simpler connection test
      // Supabase allows querying information_schema even with anon key
      const { error: schemaError } = await client
        .from("information_schema.tables")
        .select("table_name")
        .limit(0);

      if (schemaError) {
        return {
          success: false,
          error: error.message || schemaError.message,
          message: "Failed to connect to Supabase database",
        };
      }
    }

    return {
      success: true,
      message: "Successfully connected to Supabase",
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
      message: "Failed to initialize Supabase client",
    };
  }
}

/**
 * Validates that Supabase client can be initialized
 */
export function testClientInitialization(): ConnectionTestResult {
  const env = getSupabaseEnv();

  if (!env) {
    return {
      success: false,
      error: "Missing environment variables",
      message: "Cannot initialize client without environment variables",
    };
  }

  try {
    const client = createClient(env.url, env.anonKey);
    
    if (!client) {
      return {
        success: false,
        error: "Client initialization returned null",
        message: "Failed to create Supabase client",
      };
    }

    return {
      success: true,
      message: "Supabase client initialized successfully",
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
      message: "Error during client initialization",
    };
  }
}
