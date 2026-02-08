import { NextResponse } from 'next/server';
import { addComment } from '@/lib/data';

// POST /api/comments - コメントを追加
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { postId, content } = body;

        if (!postId || !content) {
            return NextResponse.json(
                { error: 'postId and content are required' },
                { status: 400 }
            );
        }

        // 簡易的なネガティブワードフィルター（MVP版）
        const negativeWords = ['バカ', 'アホ', '死ね', 'うざい', 'きもい', 'クソ', '消えろ'];
        const hasNegativeWord = negativeWords.some(word =>
            content.toLowerCase().includes(word.toLowerCase())
        );

        if (hasNegativeWord) {
            return NextResponse.json(
                { error: 'もっと優しい言葉で伝えてみませんか？💫' },
                { status: 400 }
            );
        }

        const updatedPost = await addComment(postId, content);

        if (!updatedPost) {
            return NextResponse.json(
                { error: 'Post not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(updatedPost);
    } catch (error) {
        console.error('Failed to add comment:', error);
        return NextResponse.json({ error: 'Failed to add comment' }, { status: 500 });
    }
}
