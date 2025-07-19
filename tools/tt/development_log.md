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

## 2025-07-19 移行計画作成

### Qwik移行計画

#### フェーズ1: プロジェクトセットアップ (推定: 1日)
1. **Qwikプロジェクトの初期化**
   ```bash
   npm create qwik@latest
   ```
   - TypeScript設定
   - Viteベースのビルドシステム
   - SSGアダプター (Static adapter) の設定

2. **必要な依存関係のインストール**
   - 既存のMarkdown処理ライブラリ (unified, remark, rehype)
   - feed (RSSフィード生成)
   - その他のユーティリティライブラリ

#### フェーズ2: コアロジックの移行 (推定: 2日)
1. **lib/ディレクトリの移行**
   - `gateway.ts` - ファイルシステムベースの記事管理
   - `render.ts` - Markdown処理ロジック  
   - `config.ts` - 設定管理
   - `util.ts` - ユーティリティ関数
   - `feed.ts` - RSSフィード生成

2. **テストの移行**
   - 既存のVitestテストをそのまま活用
   - Qwik特有のテストユーティリティの追加

#### フェーズ3: ルーティング構造の移行 (推定: 3日)
1. **Qwikのルーティング構造**
   ```
   src/routes/
   ├── index.tsx              # ホームページ
   ├── all/
   │   └── index.tsx         # 全記事一覧
   ├── todos/
   │   └── index.tsx         # TODOリスト
   ├── posts/
   │   └── [id]/
   │       └── index.tsx     # 記事詳細
   ├── feed.xml/
   │   └── index.ts          # RSSフィード
   └── layout.tsx            # 共通レイアウト
   ```

2. **静的パスの生成**
   - `useStaticGenerator`フックを使用した静的パス生成
   - Next.jsの`generateStaticParams`相当の実装

#### フェーズ4: コンポーネントの移行 (推定: 2日)
1. **レイアウトコンポーネント**
   - グローバルレイアウトの移行
   - ナビゲーションコンポーネント

2. **ページコンポーネント**
   - Server-side rendering (SSR) からQwikのResumeableコンポーネントへ
   - `useResource$`を使用したデータフェッチング

3. **スタイリング**
   - インラインスタイルからQwikのスタイリングアプローチへ
   - CSS ModulesまたはStyled-componentsの検討

#### フェーズ5: 高度な機能の移行 (推定: 2日)
1. **OG画像生成**
   - `@vercel/og`や`satori`を使用した実装
   - またはサーバーサイドでの画像生成API

2. **メタデータ管理**
   - `useDocumentHead`を使用した動的メタデータ
   - SEO最適化の維持

#### フェーズ6: ビルドとデプロイ (推定: 1日)
1. **ビルド設定**
   - Viteの設定調整
   - 静的ファイル出力の最適化

2. **GitHub Pages対応**
   - 現在の`output: "export"`相当の設定
   - `trailingSlash: true`の対応

#### 合計推定期間: 約11日

### 技術的な対応表

| Next.js機能 | Qwik対応 |
|------------|----------|
| App Router | Qwik City file-based routing |
| Server Components | Qwik Resumeable Components |
| generateStaticParams | useStaticGenerator |
| generateMetadata | useDocumentHead |
| Route Handlers | Qwik City endpoints |
| next/link | Qwik City Link component |
| next/og ImageResponse | @vercel/og or custom solution |
| getStaticProps | useResource$ |

### リスクと対策

1. **OG画像生成の複雑性**
   - リスク: Next.jsの`ImageResponse`に相当する機能がない
   - 対策: `@vercel/og`ライブラリまたはカスタム実装

2. **ビルドシステムの違い**
   - リスク: WebpackからViteへの移行による設定の違い
   - 対策: 段階的な移行とテスト

3. **パフォーマンスの違い**
   - リスク: 静的サイト生成のパフォーマンス差
   - 対策: ビルド時間の計測と最適化