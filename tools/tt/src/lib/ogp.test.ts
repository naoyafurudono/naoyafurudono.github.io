import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { clearOGPCache, extractOGP, fetchOGP } from "./ogp";

describe("extractOGP", () => {
  test("OGPメタタグを正しく抽出できる", () => {
    const html = `
			<!DOCTYPE html>
			<html>
			<head>
				<meta property="og:title" content="Test Title" />
				<meta property="og:description" content="Test Description" />
				<meta property="og:image" content="https://example.com/image.png" />
			</head>
			<body></body>
			</html>
		`;
    const result = extractOGP(html, "https://example.com");
    expect(result.title).toBe("Test Title");
    expect(result.description).toBe("Test Description");
    expect(result.image).toBe("https://example.com/image.png");
    expect(result.url).toBe("https://example.com");
  });

  test("content属性が先にあるパターンでも抽出できる", () => {
    const html = `
			<!DOCTYPE html>
			<html>
			<head>
				<meta content="Test Title" property="og:title" />
				<meta content="Test Description" property="og:description" />
			</head>
			<body></body>
			</html>
		`;
    const result = extractOGP(html, "https://example.com");
    expect(result.title).toBe("Test Title");
    expect(result.description).toBe("Test Description");
  });

  test("OGPがない場合はtitleタグをフォールバック", () => {
    const html = `
			<!DOCTYPE html>
			<html>
			<head>
				<title>Page Title</title>
				<meta name="description" content="Meta description" />
			</head>
			<body></body>
			</html>
		`;
    const result = extractOGP(html, "https://example.com");
    expect(result.title).toBe("Page Title");
    expect(result.description).toBe("Meta description");
    expect(result.image).toBeNull();
  });

  test("何もない場合はドメインをフォールバック", () => {
    const html = `
			<!DOCTYPE html>
			<html>
			<head></head>
			<body></body>
			</html>
		`;
    const result = extractOGP(html, "https://example.com/path/to/page");
    expect(result.title).toBe("example.com");
    expect(result.description).toBe("");
    expect(result.image).toBeNull();
  });
});

describe("fetchOGP", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    clearOGPCache();
  });

  afterEach(() => {
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  test("正常にOGPを取得できる", async () => {
    const mockHtml = `
			<!DOCTYPE html>
			<html>
			<head>
				<meta property="og:title" content="Fetched Title" />
				<meta property="og:description" content="Fetched Description" />
			</head>
			<body></body>
			</html>
		`;

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(mockHtml),
    });

    const result = await fetchOGP("https://example.com");
    expect(result).not.toBeNull();
    expect(result?.title).toBe("Fetched Title");
    expect(result?.description).toBe("Fetched Description");
  });

  test("fetch失敗時はnullを返す", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("Network error"));

    const result = await fetchOGP("https://example.com");
    expect(result).toBeNull();
  });

  test("HTTPエラー時はnullを返す", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
    });

    const result = await fetchOGP("https://example.com");
    expect(result).toBeNull();
  });

  test("キャッシュが効く", async () => {
    const mockHtml = `
			<!DOCTYPE html>
			<html>
			<head>
				<meta property="og:title" content="Cached Title" />
			</head>
			<body></body>
			</html>
		`;

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(mockHtml),
    });

    // 1回目の呼び出し
    await fetchOGP("https://example.com");
    // 2回目の呼び出し
    await fetchOGP("https://example.com");

    // fetchは1回だけ呼ばれる
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });
});
