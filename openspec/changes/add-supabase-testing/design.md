# Design: Supabase Testing

## Context
We need to establish a testing infrastructure for validating Supabase integration. The project uses Next.js 16 with Bun runtime, and we need to test environment variable configuration, database connectivity, and basic CRUD operations.

## Goals / Non-Goals

### Goals
- Validate Supabase environment variables are correctly configured
- Test database connectivity and client initialization
- Verify basic CRUD operations work correctly
- Provide clear error messages for configuration issues
- Document testing setup for developers

### Non-Goals
- End-to-end testing (browser automation)
- Component testing (React Testing Library)
- Full integration test suite (focus on Supabase-specific tests)

## Decisions

### Decision: Use Bun's Built-in Test Runner
**What**: Use Bun's native test runner for testing Supabase integration.

**Why**:
- Project already uses Bun as runtime
- Bun test runner is Jest-compatible (familiar API)
- Fast execution (native performance)
- No additional dependencies needed
- Built-in TypeScript support
- Works seamlessly with Next.js server-side code

**Alternatives considered**:
- **Jest**: Would require additional setup and dependencies, slower than Bun
- **Vitest**: Designed for Vite, requires more configuration for Next.js
- **Node.js test runner**: Less mature, fewer features

### Decision: Test Structure
**What**: Place test files alongside source files using `.test.ts` extension.

**Why**:
- Keeps tests close to code being tested
- Easy to find and maintain
- Follows common Next.js conventions

**Example structure**:
```
shared/lib/
  ├── supabase.ts
  └── supabase.test.ts
```

### Decision: Environment Variable Testing Approach
**What**: Test environment variable validation at module initialization and provide utility functions for manual validation.

**Why**:
- Current implementation throws errors on missing variables (good for production)
- Need utilities for testing and development validation
- Separate concerns: runtime validation vs. test utilities

## Testing Approach

### 1. Environment Variable Validation
- Create utility function to validate Supabase env vars without throwing
- Test missing variables scenarios
- Test invalid format scenarios
- Document how to find credentials

### 2. Connection Testing
- Test successful connection to Supabase
- Test connection failure scenarios
- Validate client initialization

### 3. CRUD Operations
- Test basic database operations using test table or existing songs table
- Verify error handling for invalid operations
- Use test data that can be cleaned up

## Risks / Trade-offs

### Risk: Tests Require Real Database Connection
**Mitigation**: 
- Document that tests require `.env.local` with valid credentials
- Consider using Supabase test database or local Supabase instance for CI/CD
- Make tests optional/skippable if credentials not available

### Risk: Tests May Modify Production Data
**Mitigation**:
- Use test-specific data that can be identified and cleaned up
- Consider using a separate test database
- Document test data cleanup procedures

### Trade-off: Simplicity vs. Coverage
- Start with basic tests for critical paths
- Expand coverage as needed
- Focus on Supabase-specific concerns (not general Next.js testing)

## Migration Plan

1. Install Bun (already installed)
2. Create test utilities directory structure
3. Write environment variable validation utilities
4. Write connection tests
5. Write basic CRUD tests
6. Document testing setup in README
7. Add test script to package.json

## Open Questions

- Should we use a separate test database or test against development database?
- Should tests be run in CI/CD pipeline? (Requires Supabase credentials setup)
- Do we need test data fixtures/helpers?
