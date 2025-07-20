# タスク管理アプリ 📋

ドラッグ&ドロップ対応のカンバンスタイルタスク管理アプリケーションです。React + TypeScriptで構築され、モダンなUI/UXを提供します。

## ✨ 機能

### 🎯 コア機能
- **カンバンボード**: 未着手・進行中・完了の3つのステータスでタスクを管理
- **ドラッグ&ドロップ**: 直感的なタスクの移動と並び替え
- **タスク管理**: 作成、編集、削除、完了状態の切り替え
- **フィルタリング**: ステータス、担当者、カテゴリ、優先度による絞り込み
- **ソート機能**: 作成日、更新日、優先度による並び替え
- **統計表示**: タスクの進捗状況を視覚的に確認

### 🎨 UI/UX機能
- **レスポンシブデザイン**: デスクトップ、タブレット、モバイル対応
- **アクセシビリティ**: キーボード操作、スクリーンリーダー対応
- **ダークモード対応**: システム設定に応じた自動切り替え
- **アニメーション**: スムーズなトランジションとインタラクション

### 💾 データ管理
- **ローカルストレージ**: ブラウザ内でのデータ永続化
- **オフライン対応**: インターネット接続なしでも使用可能
- **データエクスポート**: タスクデータのバックアップ機能

## 🚀 デモ

[デモサイト](https://todo-app-demo.vercel.app) - 実際のアプリケーションをお試しください

## 🛠️ 技術スタック

### フロントエンド
- **React 19** - 最新のReactフレームワーク
- **TypeScript** - 型安全性と開発効率の向上
- **CSS Modules** - スコープ付きスタイリング
- **@dnd-kit** - ドラッグ&ドロップ機能

### 開発ツール
- **ESLint** - コード品質管理
- **Prettier** - コードフォーマット
- **Jest** - ユニットテスト
- **React Testing Library** - コンポーネントテスト

### パフォーマンス
- **React.memo** - 不要な再レンダリングの防止
- **useMemo/useCallback** - 計算結果と関数のメモ化
- **React.lazy** - コード分割と遅延読み込み
- **Bundle Analyzer** - バンドルサイズの最適化

## 📦 インストール

### 前提条件
- Node.js 18.0.0以上
- npm 9.0.0以上

### セットアップ

```bash
# リポジトリのクローン
git clone https://github.com/your-username/todo-app.git
cd todo-app

# 依存関係のインストール
npm install

# 開発サーバーの起動
npm start
```

アプリケーションは [http://localhost:3000](http://localhost:3000) で起動します。

## 🧪 テスト

```bash
# テストの実行
npm test

# カバレッジ付きテスト
npm run test:coverage

# CI用テスト
npm run test:ci
```

## 🏗️ ビルド

```bash
# 本番用ビルド
npm run build

# バンドル分析
npm run analyze
```

## 🚀 デプロイ

### Vercel（推奨）

1. [Vercel](https://vercel.com)にアカウントを作成
2. GitHubリポジトリを接続
3. 自動デプロイが開始されます

### Netlify

1. [Netlify](https://netlify.com)にアカウントを作成
2. GitHubリポジトリを接続
3. ビルド設定を確認してデプロイ

### 手動デプロイ

```bash
# ビルド
npm run build

# buildフォルダの内容をWebサーバーにアップロード
```

## 📁 プロジェクト構造

```
todo-app/
├── public/                 # 静的ファイル
├── src/
│   ├── components/         # Reactコンポーネント
│   │   ├── common/        # 共通コンポーネント
│   │   ├── kanban/        # カンバンボード関連
│   │   ├── filter/        # フィルター関連
│   │   ├── stats/         # 統計表示関連
│   │   ├── todo/          # タスク関連
│   │   └── layout/        # レイアウト関連
│   ├── contexts/          # React Context
│   ├── hooks/             # カスタムフック
│   ├── reducers/          # Reducer関数
│   ├── types/             # TypeScript型定義
│   ├── utils/             # ユーティリティ関数
│   └── __tests__/         # テストファイル
├── docs/                  # ドキュメント
└── package.json
```

## 🎯 主要コンポーネント

### KanbanBoard
カンバンボードのメインコンポーネント。ドラッグ&ドロップ機能を管理し、3つのカラム（未着手、進行中、完了）を表示します。

### TodoContext
アプリケーション全体の状態管理を担当。useReducerとContext APIを使用して、タスクのCRUD操作、フィルタリング、ソート機能を提供します。

### MainLayout
アプリケーションのメインレイアウト。ヘッダー、サイドバー、メインコンテンツエリアを管理し、レスポンシブデザインを実現します。

## 🔧 カスタマイズ

### テーマの変更
`src/styles/variables.css`でカラーテーマを変更できます：

```css
:root {
  --primary-color: #3b82f6;
  --secondary-color: #6b7280;
  --success-color: #10b981;
  --warning-color: #f59e0b;
  --danger-color: #ef4444;
}
```

### 機能の追加
新しい機能を追加する場合は、以下の手順に従ってください：

1. 型定義を`src/types/index.ts`に追加
2. Reducerを`src/reducers/todoReducer.ts`に追加
3. Contextを`src/contexts/TodoContext.tsx`に追加
4. コンポーネントを作成
5. テストを追加

## 🐛 トラブルシューティング

### よくある問題

**Q: アプリケーションが起動しない**
A: Node.jsのバージョンを確認してください。18.0.0以上が必要です。

**Q: ドラッグ&ドロップが動作しない**
A: ブラウザのJavaScriptが有効になっているか確認してください。

**Q: データが保存されない**
A: ブラウザのローカルストレージが有効になっているか確認してください。

**Q: テストが失敗する**
A: 依存関係を再インストールしてください：`npm ci`

## 🤝 コントリビューション

プロジェクトへの貢献を歓迎します！

### 開発の流れ

1. このリポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

### 開発ガイドライン

- TypeScript strict modeを維持
- ESLintとPrettierの設定に従う
- テストカバレッジ80%以上を維持
- アクセシビリティを考慮した実装
- パフォーマンスを意識した実装

## 📄 ライセンス

このプロジェクトはMITライセンスの下で公開されています。詳細は[LICENSE](LICENSE)ファイルを参照してください。

## 👥 作者

- **Your Name** - *初期開発* - [YourGitHub](https://github.com/your-username)

## 🙏 謝辞

- [React](https://reactjs.org/) - 素晴らしいフレームワーク
- [@dnd-kit](https://dndkit.com/) - ドラッグ&ドロップライブラリ
- [TypeScript](https://www.typescriptlang.org/) - 型安全性の提供

## 📞 サポート

問題や質問がある場合は、[Issues](https://github.com/your-username/todo-app/issues)でお知らせください。

---

⭐ このプロジェクトが役に立ったら、スターを付けてください！
