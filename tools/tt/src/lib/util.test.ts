import { describe, expect, it } from "vitest";
import { hash, lexOrder } from "./util";

type Ord = "eq" | "less" | "greater";
function toOrd(n: number): Ord {
  if (n === 0) {
    return "eq";
  }
  if (n < 0) {
    return "less";
  }
  return "greater";
}
describe("lexOrder", () => {
  it("a < b", () => {
    expect(toOrd(lexOrder("a", "b")) === "less").toBeTruthy();
  });
  it("a = a", () => {
    expect(toOrd(lexOrder("a", "a")) === "eq").toBeTruthy();
  });
  it("あ < い", () => {
    expect(toOrd(lexOrder("あ", "い")) === "less").toBeTruthy();
  });
  it("たいし　> たいこ", () => {
    expect(toOrd(lexOrder("たいし", "たいこ")) === "greater").toBeTruthy();
  });
});

describe("hash", () => {
  const cases = [
    { name: "普通", x: ["hello"], y: ["hello"], same: true },
    { name: "空", x: [], y: [], same: true },
    { name: "普通2", x: ["hello", "world"], y: ["hello"], same: false },
    {
      name: "順番は大事",
      x: ["hello", "world"],
      y: ["world", "hello"],
      same: false,
    },
  ];

  for (const tt of cases) {
    it(tt.name, () => {
      expect(hash(tt.x) === hash(tt.y)).toBe(tt.same);
    });
  }
});
