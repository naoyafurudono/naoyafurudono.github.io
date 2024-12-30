import { describe, expect, it } from "vitest";
import { lexOrder } from "./util";

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
