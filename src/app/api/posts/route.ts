import { NextResponse } from 'next/server';
import { getPosts, createPost } from '@/lib/data';

// GET /api/posts - 全投稿を取得
export async function GET() {
    try {
        const posts = await getPosts();
        return NextResponse.json(posts);
    } catch (error) {
        console.error('Failed to get posts:', error);
        return NextResponse.json({ error: 'Failed to get posts' }, { status: 500 });
    }
}

// POST /api/posts - 新規投稿を作成
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { content, imageUrl, mood } = body;

        if (!content && !imageUrl) {
            return NextResponse.json(
                { error: 'Content or image is required' },
                { status: 400 }
            );
        }

        const newPost = await createPost(content || '', imageUrl, mood);
        return NextResponse.json(newPost, { status: 201 });
    } catch (error) {
        console.error('Failed to create post:', error);
        return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
    }
}
