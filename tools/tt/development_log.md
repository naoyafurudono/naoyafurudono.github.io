# Development Log - Next.js to Qwik Migration

## 2025-07-19 要件調査完了

### 現在のプロジェクト構造

このプロジェクトは Next.js 15.3.2 を使用したブログ/日記システムです。

#### 主な機能
1. **ブログ記事管理システム**
   - Markdownファイルから記事を読み込み
   - 記事の一覧表示、個別表示
   - 前後の記事へのナビゲーション
   
2. **TODOリスト機能**
   - 記事内の未完了TODOアイテムを抽出して表示
   
3. **RSS フィード生成**
   - 記事をRSSフィードとして配信
   
4. **OG画像の動的生成**
   - 各記事用のOpen Graph画像を動的生成

### 使用されているNext.js機能

1. **App Router** (src/app ディレクトリ構造)
2. **静的サイト生成 (SSG)** - `output: "export"`設定
3. **動的ルーティング** - `[id]`パラメータ
4. **generateStaticParams** - 動的ルートの静的生成
5. **generateMetadata** - 動的メタデータ生成  
6. **Route Handlers** - `feed.xml/route.ts`
7. **ImageResponse** - OG画像の動的生成
8. **Server Components** - 全てのコンポーネントがデフォルトでサーバーコンポーネント
9. **TypeScript** - 完全なTypeScript対応

### 依存関係

#### 主要な依存関係
- next: ^15.3.2
- react: 19.0.0
- react-dom: 19.0.0
- unified エコシステム (remark, rehype) - Markdown処理
- feed: ^4.2.2 - RSSフィード生成

### ファイルシステムベースのデータ管理
- 記事は `/article` ディレクトリ内のMarkdownファイル
- ファイル名が記事IDとして使用される
- フロントマターでメタデータを管理

### Qwikへの移行における考慮事項

1. **ルーティングシステムの変更**
   - App RouterからQwikのファイルベースルーティングへ
   - 動的ルートの処理方法の変更

2. **静的サイト生成**
   - QwikのStatic Site Generation (SSG)アダプターへの移行
   - generateStaticParamsの代替実装

3. **サーバーコンポーネント**
   - QwikのResumeability概念への適応
   - データフェッチング方法の変更

4. **画像生成**
   - next/ogのImageResponseの代替方法の検討

5. **ビルドシステム**
   - Next.jsからViteベースのビルドシステムへ

6. **既存のMarkdown処理ロジック**
   - unified/remark/rehypeエコシステムはそのまま使用可能

### 次のステップ
- Qwikプロジェクトの初期設定
- ルーティング構造の移行計画作成
- コンポーネントの移行戦略策定