"use client";

import { useState, useEffect } from "react";

// 投稿データの型定義（本来は共通の型定義ファイルからインポートすべきですが、一旦ここで定義）
export type AmuletPost = {
    id: number;
    content: string;
    mood: string;
    createdAt: string;
    // 将来的にユーザー情報なども含めるかも
};

const STORAGE_KEY = "emo-sns-amulets";

export const useAmulet = () => {
    const [amulets, setAmulets] = useState<AmuletPost[]>([]);

    // 初期ロード時にローカルストレージから読み込む
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                setAmulets(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse amulets", e);
            }
        }
    }, []);

    // お守り追加
    const addAmulet = (post: AmuletPost) => {
        setAmulets((prev) => {
            // 重複チェック
            if (prev.some((p) => p.id === post.id)) return prev;
            const newAmulets = [post, ...prev];
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newAmulets));
            return newAmulets;
        });
    };

    // お守り削除
    const removeAmulet = (postId: number) => {
        setAmulets((prev) => {
            const newAmulets = prev.filter((p) => p.id !== postId);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newAmulets));
            return newAmulets;
        });
    };

    // お守りかどうか判定
    const isAmulet = (postId: number) => {
        return amulets.some((p) => p.id === postId);
    };

    // リスト一括取得（hooksのstateで管理しているのでそのまま返す）
    return {
        amulets,
        addAmulet,
        removeAmulet,
        isAmulet,
    };
};
