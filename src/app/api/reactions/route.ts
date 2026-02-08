import { NextResponse } from 'next/server';
import { addReaction, type Post } from '@/lib/data';

// POST /api/reactions - リアクションを追加
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { postId, reactionType } = body;

        if (!postId || !reactionType) {
            return NextResponse.json(
                { error: 'postId and reactionType are required' },
                { status: 400 }
            );
        }

        const validTypes: (keyof Post['reactions'])[] = [
            'understand', 'lovely', 'emotional', 'healing', 'energized'
        ];

        if (!validTypes.includes(reactionType)) {
            return NextResponse.json(
                { error: 'Invalid reaction type' },
                { status: 400 }
            );
        }

        const updatedPost = await addReaction(postId, reactionType);

        if (!updatedPost) {
            return NextResponse.json(
                { error: 'Post not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(updatedPost);
    } catch (error) {
        console.error('Failed to add reaction:', error);
        return NextResponse.json({ error: 'Failed to add reaction' }, { status: 500 });
    }
}
