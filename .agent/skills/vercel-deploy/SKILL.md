---
name: Vercel Deployment
description: Vercel への Next.js プロジェクトデプロイ手順
---

# Vercel デプロイ スキル

## 前提条件
- GitHubアカウント
- Vercelアカウント (GitHub連携推奨)

## デプロイ手順

### 1. GitHubリポジトリ作成
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/USERNAME/emo-sns.git
git push -u origin main
```

### 2. Vercel連携
1. https://vercel.com にログイン
2. "Add New Project"
3. GitHubリポジトリをインポート
4. フレームワーク: Next.js (自動検出)
5. "Deploy" クリック

### 3. 環境変数設定 (必要な場合)
Vercel Dashboard → Settings → Environment Variables

### 自動デプロイ
- `main` ブランチへのpushで自動デプロイ
- PRごとにプレビューURL生成

## トラブルシューティング
| 問題 | 解決策 |
|------|--------|
| ビルドエラー | ローカルで `npm run build` 確認 |
| 環境変数未設定 | Vercel Dashboardで追加 |
| fs エラー | API Route内でのみ使用 |
