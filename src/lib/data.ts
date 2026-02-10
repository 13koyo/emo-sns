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

// インメモリストレージ（Vercel対応）
// サーバーレス環境ではファイルシステムへの書き込みができないため、
// メモリ上にデータを保持する。コールドスタート時にリセットされる。
let posts: Post[] = [];

// 全投稿を取得
export async function getPosts(): Promise<Post[]> {
    return posts;
}

// 投稿を保存
export async function savePosts(newPosts: Post[]): Promise<void> {
    posts = newPosts;
}

// 新規投稿を作成
export async function createPost(content: string, imageUrl?: string, mood: string = 'default'): Promise<Post> {
    const newPost: Post = {
        id: generateId(),
        content,
        imageUrl,
        mood,
        createdAt: new Date().toISOString(),
        reactions: {
            understand: 0,
            lovely: 0,
            emotional: 0,
            healing: 0,
            energized: 0,
        },
        comments: [],
    };

    posts.unshift(newPost);
    return newPost;
}

// リアクションを追加
export async function addReaction(
    postId: string,
    reactionType: keyof Post['reactions']
): Promise<Post | null> {
    const post = posts.find(p => p.id === postId);
    if (!post) return null;

    post.reactions[reactionType]++;
    return post;
}

// コメントを追加
export async function addComment(postId: string, content: string): Promise<Post | null> {
    const post = posts.find(p => p.id === postId);
    if (!post) return null;

    const newComment: Comment = {
        id: generateId(),
        content,
        createdAt: new Date().toISOString(),
    };

    post.comments.push(newComment);
    return post;
}

// ユニークIDを生成
function generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}
