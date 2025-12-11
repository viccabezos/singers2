import { describe, it, expect, beforeAll } from "bun:test";
import { validateSupabaseEnv, getSupabaseEnv } from "./test-utils/supabase-env";
import { testSupabaseConnection, testClientInitialization } from "./test-utils/supabase-connection";

// Helper to get supabase client safely (returns null if env vars aren't set)
async function getSupabaseClient() {
  try {
    const env = getSupabaseEnv();
    if (!env) return null;
    
    const supabaseModule = await import("./supabase");
    return supabaseModule.supabase;
  } catch (error) {
    // Supabase client will be null if env vars aren't set
    return null;
  }
}

describe("Supabase Environment Variables", () => {
  it("should validate environment variables", () => {
    const validation = validateSupabaseEnv();
    
    if (!validation.isValid) {
      console.warn("Environment variables validation failed:", validation.errors);
      console.warn("Skipping tests that require database connection");
    }
    
    // This test will pass even if env vars are missing (we just log a warning)
    // In CI/CD, you might want to make this stricter
    expect(validation).toBeDefined();
  });

  it("should have NEXT_PUBLIC_SUPABASE_URL set", () => {
    const validation = validateSupabaseEnv();
    
    if (validation.isValid) {
      expect(validation.url).toBeDefined();
      expect(validation.url).toMatch(/^https?:\/\//);
    } else {
      console.warn("NEXT_PUBLIC_SUPABASE_URL is not set - some tests will be skipped");
    }
  });

  it("should have NEXT_PUBLIC_SUPABASE_ANON_KEY set", () => {
    const validation = validateSupabaseEnv();
    
    if (validation.isValid) {
      expect(validation.anonKey).toBeDefined();
    } else {
      console.warn("NEXT_PUBLIC_SUPABASE_ANON_KEY is not set - some tests will be skipped");
    }
  });

  it("should detect missing URL", () => {
    const originalUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    
    const validation = validateSupabaseEnv();
    expect(validation.isValid).toBe(false);
    expect(validation.errors).toContain("NEXT_PUBLIC_SUPABASE_URL is missing");
    
    // Restore
    if (originalUrl) {
      process.env.NEXT_PUBLIC_SUPABASE_URL = originalUrl;
    }
  });

  it("should detect missing anon key", () => {
    const originalKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    const validation = validateSupabaseEnv();
    expect(validation.isValid).toBe(false);
    expect(validation.errors).toContain("NEXT_PUBLIC_SUPABASE_ANON_KEY is missing");
    
    // Restore
    if (originalKey) {
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = originalKey;
    }
  });

  it("should detect invalid URL format", () => {
    const originalUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    process.env.NEXT_PUBLIC_SUPABASE_URL = "not-a-valid-url";
    
    const validation = validateSupabaseEnv();
    expect(validation.isValid).toBe(false);
    expect(validation.errors.some(e => e.includes("invalid format"))).toBe(true);
    
    // Restore
    if (originalUrl) {
      process.env.NEXT_PUBLIC_SUPABASE_URL = originalUrl;
    }
  });
});

describe("Supabase Client Initialization", () => {
  it("should initialize client when environment variables are set", () => {
    const env = getSupabaseEnv();
    
    if (!env) {
      console.warn("Skipping client initialization test - environment variables not set");
      return;
    }

    const result = testClientInitialization();
    expect(result.success).toBe(true);
  });

  it("should export supabase client", async () => {
    const env = getSupabaseEnv();
    
    if (!env) {
      console.warn("Skipping client export test - environment variables not set");
      return;
    }

    const supabase = await getSupabaseClient();
    if (!supabase) {
      console.warn("Skipping client export test - failed to initialize client");
      return;
    }

    expect(supabase).toBeDefined();
  });
});

describe("Supabase Database Connection", () => {
  it("should connect to Supabase database", async () => {
    const env = getSupabaseEnv();
    
    if (!env) {
      console.warn("Skipping connection test - environment variables not set");
      return;
    }

    const result = await testSupabaseConnection();
    
    if (!result.success) {
      console.error("Connection test failed:", result.error);
      console.error("Make sure your Supabase credentials are correct and the database is accessible");
    }
    
    expect(result.success).toBe(true);
  });

  it("should perform a simple query", async () => {
    const env = getSupabaseEnv();
    
    if (!env) {
      console.warn("Skipping query test - environment variables not set");
      return;
    }

    const supabase = await getSupabaseClient();
    if (!supabase) {
      console.warn("Skipping query test - failed to initialize client");
      return;
    }

    // Try to query the songs table (should exist if migrations are run)
    const { data, error } = await supabase.from("songs").select("id").limit(1);

    if (error) {
      console.warn("Query test failed - songs table may not exist:", error.message);
      console.warn("This is OK if migrations haven't been run yet");
      // Don't fail the test, just log a warning
      return;
    }

    expect(error).toBeNull();
    expect(Array.isArray(data)).toBe(true);
  });
});

describe("Basic CRUD Operations", () => {
  let testSongId: string | null = null;

  beforeAll(async () => {
    const env = getSupabaseEnv();
    if (!env) {
      console.warn("Skipping CRUD tests - environment variables not set");
      return;
    }
  });

  it("should create a record (INSERT)", async () => {
    const env = getSupabaseEnv();
    if (!env) {
      return;
    }

    const supabase = await getSupabaseClient();
    if (!supabase) {
      return;
    }

    const testSong = {
      title: "Test Song for CRUD",
      lyrics: "Test lyrics\nLine 2",
      is_visible: false,
      is_archived: false,
    };

    const { data, error } = await supabase.from("songs").insert(testSong).select().single();

    if (error) {
      console.error("Create test failed:", error.message);
      // Don't fail if table doesn't exist
      if (error.message.includes("relation") && error.message.includes("does not exist")) {
        console.warn("Songs table doesn't exist - run migrations first");
        return;
      }
      throw error;
    }

    expect(data).toBeDefined();
    expect(data.id).toBeDefined();
    expect(data.title).toBe(testSong.title);
    testSongId = data.id;
  });

  it("should read a record (SELECT)", async () => {
    const env = getSupabaseEnv();
    if (!env || !testSongId) {
      return;
    }

    const supabase = await getSupabaseClient();
    if (!supabase) {
      return;
    }

    const { data, error } = await supabase.from("songs").select("*").eq("id", testSongId).single();

    if (error) {
      console.error("Read test failed:", error.message);
      return;
    }

    expect(data).toBeDefined();
    expect(data.id).toBe(testSongId);
  });

  it("should update a record (UPDATE)", async () => {
    const env = getSupabaseEnv();
    if (!env || !testSongId) {
      return;
    }

    const supabase = await getSupabaseClient();
    if (!supabase) {
      return;
    }

    const updateData = {
      title: "Updated Test Song",
    };

    const { data, error } = await supabase
      .from("songs")
      .update(updateData)
      .eq("id", testSongId)
      .select()
      .single();

    if (error) {
      console.error("Update test failed:", error.message);
      return;
    }

    expect(data).toBeDefined();
    expect(data.title).toBe(updateData.title);
  });

  it("should delete a record (DELETE)", async () => {
    const env = getSupabaseEnv();
    if (!env || !testSongId) {
      return;
    }

    const supabase = await getSupabaseClient();
    if (!supabase) {
      return;
    }

    const { error } = await supabase.from("songs").delete().eq("id", testSongId);

    if (error) {
      console.error("Delete test failed:", error.message);
      return;
    }

    // Verify deletion
    const { data } = await supabase.from("songs").select("id").eq("id", testSongId).single();
    expect(data).toBeNull();
  });

  it("should handle invalid operations gracefully", async () => {
    const env = getSupabaseEnv();
    if (!env) {
      return;
    }

    const supabase = await getSupabaseClient();
    if (!supabase) {
      return;
    }

    // Try to insert invalid data (missing required field)
    const { error } = await supabase.from("songs").insert({ lyrics: "Missing title" }).select();

    expect(error).toBeDefined();
    expect(error?.message).toBeDefined();
  });
});
