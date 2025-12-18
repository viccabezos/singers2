declare module "bun:test" {
  export function describe(name: string, fn: () => void | Promise<void>): void;
  export function it(name: string, fn: () => void | Promise<void>): void;
  export function expect(value: any): {
    toBe(expected: any): void;
    toBeNull(): void;
    toBeDefined(): void;
    toBeUndefined(): void;
    toBeTruthy(): void;
    toBeFalsy(): void;
    toEqual(expected: any): void;
    toStrictEqual(expected: any): void;
    toContain(item: any): void;
    toHaveLength(length: number): void;
    toThrow(error?: any): void;
    toMatch(regexp: RegExp | string): void;
    toBeGreaterThan(value: number): void;
    toBeLessThan(value: number): void;
    toBeGreaterThanOrEqual(value: number): void;
    toBeLessThanOrEqual(value: number): void;
    not: {
      toBe(expected: any): void;
      toBeNull(): void;
      toBeDefined(): void;
      toBeUndefined(): void;
      toBeTruthy(): void;
      toBeFalsy(): void;
      toEqual(expected: any): void;
      toStrictEqual(expected: any): void;
      toContain(item: any): void;
      toHaveLength(length: number): void;
      toThrow(error?: any): void;
      toMatch(regexp: RegExp | string): void;
      toBeGreaterThan(value: number): void;
      toBeLessThan(value: number): void;
      toBeGreaterThanOrEqual(value: number): void;
      toBeLessThanOrEqual(value: number): void;
    };
  };
  export function beforeAll(fn: () => void | Promise<void>): void;
  export function afterAll(fn: () => void | Promise<void>): void;
  export function beforeEach(fn: () => void | Promise<void>): void;
  export function afterEach(fn: () => void | Promise<void>): void;
}

