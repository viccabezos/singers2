import { describe, it, expect, beforeAll, afterAll } from "bun:test";
import { getSupabaseEnv } from "./test-utils/supabase-env";
import { verifyPassword } from "./auth";

describe("Authentication Utilities", () => {
  const originalPassword = process.env.ADMIN_PASSWORD;

  beforeAll(() => {
    if (!originalPassword) {
      process.env.ADMIN_PASSWORD = "test-password-123";
    }
  });

  afterAll(() => {
    if (originalPassword === undefined) {
      delete process.env.ADMIN_PASSWORD;
    } else {
      process.env.ADMIN_PASSWORD = originalPassword;
    }
  });

  describe("verifyPassword", () => {
    it("should verify correct password", async () => {
      const isValid = await verifyPassword("test-password-123");
      expect(isValid).toBe(true);
    });

    it("should reject incorrect password", async () => {
      const isValid = await verifyPassword("wrong-password");
      expect(isValid).toBe(false);
    });

    it("should throw error when ADMIN_PASSWORD is not set", async () => {
      const tempPassword = process.env.ADMIN_PASSWORD;
      delete process.env.ADMIN_PASSWORD;

      try {
        await verifyPassword("any-password");
        expect(true).toBe(false);
      } catch (error) {
        expect(error).toBeDefined();
        expect((error as Error).message).toContain("ADMIN_PASSWORD environment variable is not set");
      } finally {
        if (tempPassword) {
          process.env.ADMIN_PASSWORD = tempPassword;
        } else {
          delete process.env.ADMIN_PASSWORD;
        }
      }
    });
  });

  describe("Environment Validation", () => {
    it("should have proper test environment", () => {
      expect(process.env.ADMIN_PASSWORD).toBeDefined();
      expect(typeof process.env.ADMIN_PASSWORD).toBe("string");
    });
  });
});