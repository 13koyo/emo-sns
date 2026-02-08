---
name: Content Moderation
description: ブロック・報告機能の実装パターン
---

# コンテンツモデレーション スキル

## ブロック機能 (クライアント側)

### ローカルストレージ管理
```typescript
// src/lib/blockList.ts
const STORAGE_KEY = 'emo-sns-blocked-users';

export function getBlockedUsers(): string[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function blockUser(userId: string): void {
  const blocked = getBlockedUsers();
  if (!blocked.includes(userId)) {
    blocked.push(userId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(blocked));
  }
}

export function isBlocked(userId: string): boolean {
  return getBlockedUsers().includes(userId);
}
```

### コンポーネントでの使用
```tsx
{!isBlocked(comment.userId) && (
  <CommentItem comment={comment} />
)}
```

## 報告機能 (サーバー側)

### API エンドポイント
```typescript
// src/app/api/reports/route.ts
export async function POST(request: Request) {
  const { postId, reason } = await request.json();
  // ファイルまたはDBに保存
  return Response.json({ success: true });
}
```

### 報告理由の選択肢
- 不快なコンテンツ
- スパム
- 誹謗中傷
- その他
