export type OGPData = {
  title: string;
  description: string;
  image: string | null;
  url: string;
};

// ビルド中の重複リクエスト防止用キャッシュ
const ogpCache = new Map<string, OGPData | null>();

// HTMLからOGPメタタグを正規表現で抽出
function extractOGP(html: string, url: string): OGPData {
  const getMetaContent = (property: string): string | null => {
    // og:propertyの値を抽出する正規表現
    const patterns = [
      new RegExp(`<meta[^>]+property=["']og:${property}["'][^>]+content=["']([^"']+)["']`, "i"),
      new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:${property}["']`, "i"),
    ];
    for (const pattern of patterns) {
      const match = html.match(pattern);
      if (match) {
        return match[1];
      }
    }
    return null;
  };

  // <title>タグからフォールバック用のタイトルを取得
  const getTitleFromHtml = (): string | null => {
    const match = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    return match ? match[1].trim() : null;
  };

  // meta descriptionからフォールバック用の説明を取得
  const getDescriptionFromMeta = (): string | null => {
    const patterns = [
      /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i,
      /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i,
    ];
    for (const pattern of patterns) {
      const match = html.match(pattern);
      if (match) {
        return match[1];
      }
    }
    return null;
  };

  const ogTitle = getMetaContent("title");
  const ogDescription = getMetaContent("description");
  const ogImage = getMetaContent("image");

  // URLからドメインを抽出
  let domain = url;
  try {
    const urlObj = new URL(url);
    domain = urlObj.hostname;
  } catch {
    // URLパースに失敗した場合はそのまま
  }

  return {
    title: ogTitle || getTitleFromHtml() || domain,
    description: ogDescription || getDescriptionFromMeta() || "",
    image: ogImage,
    url,
  };
}

export async function fetchOGP(url: string): Promise<OGPData | null> {
  // キャッシュをチェック
  if (ogpCache.has(url)) {
    return ogpCache.get(url) ?? null;
  }

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; OGPFetcher/1.0; +https://nfurudono.com)",
      },
      // タイムアウト設定
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      ogpCache.set(url, null);
      return null;
    }

    const html = await response.text();
    const ogpData = extractOGP(html, url);
    ogpCache.set(url, ogpData);
    return ogpData;
  } catch {
    ogpCache.set(url, null);
    return null;
  }
}

// テスト用にキャッシュをクリアする関数
export function clearOGPCache(): void {
  ogpCache.clear();
}

// テスト用にextractOGPを公開
export { extractOGP };
