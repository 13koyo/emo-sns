---
name: Next.js App Router
description: Next.js 14+ App Router でのコンポーネント・API開発ガイド
---

# Next.js App Router スキル

## ディレクトリ構造
```
src/
├── app/           # ルーティング
│   ├── page.tsx   # / ページ
│   ├── layout.tsx # 共通レイアウト
│   └── api/       # APIルート
├── components/    # 再利用コンポーネント
└── lib/           # ユーティリティ
```

## コンポーネント種別

### Server Component (デフォルト)
- データフェッチ可能
- `async/await` 使用可

### Client Component
- `'use client'` を先頭に記述
- useState, useEffect 使用可

## APIルート
```typescript
// src/app/api/posts/route.ts
export async function GET(request: Request) {
  return Response.json({ data: [] })
}

export async function POST(request: Request) {
  const body = await request.json()
  return Response.json({ success: true })
}
```

## よくあるミス
- Client Component で async を使う → Server Component に分離
- API で fs を使う場合は絶対パスを使用
