export function lexOrder(a: string, b: string): number {
	return a < b ? -1 : a > b ? 1 : 0;
}
export const postPath = (id: string) => `/posts/${id}/`;
export const normalPath = (id: string) => `/named/${id}/`;
export type Brand<T, B> = T & { __brand: B };
export const withSiteTitle = (name: string) => `${name} | ${siteTitle}`;
export const siteTitle = "diary.nfurudono.com";
export function hash(strings: string[]): string {
	// 初期ハッシュ値
	let hash = 0;

	// 配列内のすべての文字列を結合してハッシュ値を生成
	for (const str of strings) {
		for (let i = 0; i < str.length; i++) {
			const char = str.charCodeAt(i);
			hash = (hash * 31 + char) >>> 0; // ハッシュ値を計算 (31 は一般的なプライム数)
		}
	}

	return hash.toString(); // 数値を文字列に変換して返す
}
