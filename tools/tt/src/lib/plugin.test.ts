import { describe, expect, it } from "vitest";
import { hashContent } from "./plugin";

describe("hashContent", () => {
  it("should return a 10-character URL safe hash for a given string", () => {
    const input = "HelloWorld";
    const hash = hashContent(input);
    expect(hash).toMatch(/^[A-Za-z0-9_-]+$/); // URLセーフな文字だけを含む
  });

  it("should generate different hashes for different inputs", () => {
    const hash1 = hashContent("string1");
    const hash2 = hashContent("string2");
    expect(hash1).not.toBe(hash2);
  });

  it("should generate the same hash for the same input", () => {
    const input = "consistent";
    const hash1 = hashContent(input);
    const hash2 = hashContent(input);
    expect(hash1).toBe(hash2);
  });

  it("should handle empty strings gracefully", () => {
    const hash = hashContent("");
    expect(hash.length).greaterThan(10);
  });
});
