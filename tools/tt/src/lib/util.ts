export function lexOrder(a: string, b: string): number {
	return a < b ? -1 : a > b ? 1 : 0;
}
export const postPath = (id: string) => `/posts/${id}`;
