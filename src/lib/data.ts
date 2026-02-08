import { promises as fs } from 'fs';
import path from 'path';

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

const DATA_FILE = path.join(process.cwd(), 'data', 'posts.json');

// データファイルを初期化
async function ensureDataFile() {
    try {
        await fs.access(DATA_FILE);
    } catch {
        // ファイルが存在しない場合は作成
        await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
        await fs.writeFile(DATA_FILE, JSON.stringify([], null, 2));
    }
}

// 全投稿を取得
export async function getPosts(): Promise<Post[]> {
    await ensureDataFile();
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
}

// 投稿を保存
export async function savePosts(posts: Post[]): Promise<void> {
    await ensureDataFile();
    await fs.writeFile(DATA_FILE, JSON.stringify(posts, null, 2));
}

// 新規投稿を作成
export async function createPost(content: string, imageUrl?: string, mood: string = 'default'): Promise<Post> {
    const posts = await getPosts();

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
    await savePosts(posts);

    return newPost;
}

// リアクションを追加
export async function addReaction(
    postId: string,
    reactionType: keyof Post['reactions']
): Promise<Post | null> {
    const posts = await getPosts();
    const post = posts.find(p => p.id === postId);

    if (!post) return null;

    post.reactions[reactionType]++;
    await savePosts(posts);

    return post;
}

// コメントを追加
export async function addComment(postId: string, content: string): Promise<Post | null> {
    const posts = await getPosts();
    const post = posts.find(p => p.id === postId);

    if (!post) return null;

    const newComment: Comment = {
        id: generateId(),
        content,
        createdAt: new Date().toISOString(),
    };

    post.comments.push(newComment);
    await savePosts(posts);

    return post;
}

// ユニークIDを生成
function generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}
