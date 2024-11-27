import { describe, expect, it } from "vitest";
import { lexOrder } from "./util";

type Ord = "eq" | "less" | "greate";
function toOrdr(n: number): Ord {
	if (n === 0) {
		return "eq";
	}
	if (n < 0) {
		return "less";
	}
	return "greate";
}
describe("lexOrder", () => {
	it("a < b", () => {
		expect(toOrdr(lexOrder("a", "b")) === "less").toBeTruthy();
	});
	it("a = a", () => {
		expect(toOrdr(lexOrder("a", "a")) === "eq").toBeTruthy();
	});
	it("あ < い", () => {
		expect(toOrdr(lexOrder("あ", "い")) === "less").toBeTruthy();
	});
	it("たいし　> たいこ", () => {
		expect(toOrdr(lexOrder("たいし", "たいこ")) === "greate").toBeTruthy();
	});
});
