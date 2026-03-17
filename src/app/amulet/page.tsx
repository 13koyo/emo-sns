"use client";

import { useAmulet } from "@/hooks/useAmulet";
import PostCard from "@/components/PostCard";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AmuletPage() {
    const { amulets, removeAmulet } = useAmulet();
    const [mounted, setMounted] = useState(false);

    // ハイドレーションエラー防止
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <main className="container mx-auto px-4 py-8 max-w-2xl">
            <div className="mb-8 text-center animate-fade-in">
                <h1 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
                    <span>🧿</span>
                    <span>お守りギャラリー</span>
                </h1>
                <p className="text-gray-600 text-sm">
                    あなたの心が動いた瞬間、大切にしたい言葉たち。
                </p>
            </div>

            {amulets.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-[var(--color-border)] animate-fade-in">
                    <p className="text-4xl mb-4">🎐</p>
                    <p className="text-gray-500 mb-6">まだお守りはありません</p>
                    <Link
                        href="/"
                        className="inline-block px-6 py-2 bg-[var(--color-primary)] text-white rounded-full hover:opacity-90 transition-opacity"
                    >
                        投稿を見に行く
                    </Link>
                </div>
            ) : (
                <div className="space-y-6">
                    {amulets.map((post) => (
                        <div key={post.id} className="relative animate-scale-in">
                            <PostCard
                                post={{
                                    ...post,
                                    id: String(post.id),
                                    reactions: {
                                        empathy: 0,
                                        wonderful: 0,
                                        emotional: 0,
                                        healing: 0,
                                        energy: 0,
                                        ...((post as any).reactions || {})
                                    },
                                    comments: []
                                }}
                                onReaction={() => { }} // ギャラリーではリアクション無効（または閲覧のみ）
                                onComment={() => { }}  // ギャラリーではコメント無効（または閲覧のみ）
                            />
                            <button
                                onClick={() => removeAmulet(post.id)}
                                className="absolute top-4 right-4 text-xs bg-gray-100 text-gray-400 px-2 py-1 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors"
                                title="お守りから外す"
                            >
                                解除
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <div className="mt-8 text-center">
                <Link href="/" className="text-sm text-gray-400 hover:text-[var(--color-primary)] transition-colors">
                    ← ホームに戻る
                </Link>
            </div>
        </main>
    );
}
