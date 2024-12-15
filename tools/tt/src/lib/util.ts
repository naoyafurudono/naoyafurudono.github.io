export function lexOrder(a: string, b: string): number {
	return a < b ? -1 : a > b ? 1 : 0;
}
export const postPath = (id: string) => `/posts/${id}/`;
export type Brand<T, B> = T & { __brand: B };
export const withSiteTitle = (name: string) => `${name} | ${siteTitle}`;
export const siteTitle = "diary.nfurudono.com";
