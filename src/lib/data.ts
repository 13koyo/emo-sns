import { supabase } from './supabase';

export interface Post {
    id: string;
    content: string;
    imageUrl?: string;
    mood: string;
    createdAt: string;
    reactions: {
        understand: number;
        lovely: number;
        emotional: number;
        healing: number;
        energized: number;
    };
    comments: Comment[];
}

export interface Comment {
    id: string;
    content: string;
    createdAt: string;
}

// DBの行データをPost型に変換
function rowToPost(row: Record<string, unknown>, comments: Comment[] = []): Post {
    return {
        id: row.id as string,
        content: row.content as string,
        imageUrl: (row.image_url as string) || undefined,
        mood: (row.mood as string) || 'default',
        createdAt: row.created_at as string,
        reactions: {
            understand: (row.react_understand as number) || 0,
            lovely: (row.react_lovely as number) || 0,
            emotional: (row.react_emotional as number) || 0,
            healing: (row.react_healing as number) || 0,
            energized: (row.react_energized as number) || 0,
        },
        comments,
    };
}

// 全投稿を取得
export async function getPosts(): Promise<Post[]> {
    const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

    if (postsError) {
        console.error('Failed to fetch posts:', postsError);
        return [];
    }

    if (!postsData || postsData.length === 0) return [];

    // 全コメントを取得
    const postIds = postsData.map(p => p.id);
    const { data: commentsData, error: commentsError } = await supabase
        .from('comments')
        .select('*')
        .in('post_id', postIds)
        .order('created_at', { ascending: true });

    if (commentsError) {
        console.error('Failed to fetch comments:', commentsError);
    }

    // コメントを投稿IDごとにグループ化
    const commentsByPostId: Record<string, Comment[]> = {};
    (commentsData || []).forEach((c: Record<string, unknown>) => {
        const postId = c.post_id as string;
        if (!commentsByPostId[postId]) {
            commentsByPostId[postId] = [];
        }
        commentsByPostId[postId].push({
            id: c.id as string,
            content: c.content as string,
            createdAt: c.created_at as string,
        });
    });

    return postsData.map(row => rowToPost(row, commentsByPostId[row.id] || []));
}

// 新規投稿を作成
export async function createPost(content: string, imageUrl?: string, mood: string = 'default'): Promise<Post> {
    const id = generateId();

    const { data, error } = await supabase
        .from('posts')
        .insert({
            id,
            content,
            image_url: imageUrl || null,
            mood,
        })
        .select()
        .single();

    if (error) {
        console.error('Failed to create post:', error);
        throw new Error('Failed to create post');
    }

    return rowToPost(data, []);
}

// リアクションを追加
export async function addReaction(
    postId: string,
    reactionType: keyof Post['reactions']
): Promise<Post | null> {
    // リアクションのカラム名にマッピング
    const columnMap: Record<string, string> = {
        understand: 'react_understand',
        lovely: 'react_lovely',
        emotional: 'react_emotional',
        healing: 'react_healing',
        energized: 'react_energized',
    };

    const column = columnMap[reactionType];
    if (!column) return null;

    // 現在の値を取得してインクリメント
    const { data: current, error: fetchError } = await supabase
        .from('posts')
        .select(column)
        .eq('id', postId)
        .single();

    if (fetchError || !current) return null;

    const newValue = ((current as unknown as Record<string, number>)[column] || 0) + 1;

    const { data, error } = await supabase
        .from('posts')
        .update({ [column]: newValue })
        .eq('id', postId)
        .select()
        .single();

    if (error || !data) return null;

    // コメントも取得して返す
    const { data: commentsData } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

    const comments: Comment[] = (commentsData || []).map((c: Record<string, unknown>) => ({
        id: c.id as string,
        content: c.content as string,
        createdAt: c.created_at as string,
    }));

    return rowToPost(data, comments);
}

// コメントを追加
export async function addComment(postId: string, content: string): Promise<Post | null> {
    const id = generateId();

    // コメントを挿入
    const { error: commentError } = await supabase
        .from('comments')
        .insert({
            id,
            post_id: postId,
            content,
        });

    if (commentError) {
        console.error('Failed to add comment:', commentError);
        return null;
    }

    // 更新後の投稿を返す
    const { data: postData, error: postError } = await supabase
        .from('posts')
        .select('*')
        .eq('id', postId)
        .single();

    if (postError || !postData) return null;

    const { data: commentsData } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

    const comments: Comment[] = (commentsData || []).map((c: Record<string, unknown>) => ({
        id: c.id as string,
        content: c.content as string,
        createdAt: c.created_at as string,
    }));

    return rowToPost(postData, comments);
}

// ユニークIDを生成
function generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}
