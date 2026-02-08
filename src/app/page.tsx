'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import PostForm from '@/components/PostForm';
import PostCard from '@/components/PostCard';
import styles from './page.module.css';

export interface Post {
  id: string;
  content: string;
  imageUrl?: string;
  mood: string;
  createdAt: string;
  reactions: {
    understand: number;  // わかる！
    lovely: number;      // 素敵！
    emotional: number;   // エモい！
    healing: number;     // 癒される
    energized: number;   // 元気もらった
  };
  comments: Comment[];
}

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  // 投稿を取得
  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/posts');
      const data = await res.json();
      setPosts(data);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // 新規投稿を追加
  const handleNewPost = (newPost: Post) => {
    setPosts([newPost, ...posts]);
  };

  // リアクションを更新
  const handleReaction = async (postId: string, reactionType: keyof Post['reactions']) => {
    try {
      const res = await fetch('/api/reactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, reactionType }),
      });
      const updatedPost = await res.json();
      setPosts(posts.map(p => p.id === postId ? updatedPost : p));
    } catch (error) {
      console.error('Failed to add reaction:', error);
    }
  };

  // コメントを追加
  const handleComment = async (postId: string, content: string) => {
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, content }),
      });

      if (!res.ok) {
        const error = await res.json();
        alert(error.error || 'コメントの投稿に失敗しました');
        return;
      }

      const updatedPost = await res.json();
      setPosts(posts.map(p => p.id === postId ? updatedPost : p));
    } catch (error) {
      console.error('Failed to add comment:', error);
      alert('コメントの投稿に失敗しました');
    }
  };

  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className="container">
          {/* 投稿フォーム */}
          <PostForm onPost={handleNewPost} />

          {/* タイムライン */}
          <section className={styles.timeline}>
            {loading ? (
              <div className={styles.loading}>
                <span className={styles.loadingEmoji}>✨</span>
                <p>読み込み中...</p>
              </div>
            ) : posts.length === 0 ? (
              <div className={styles.empty}>
                <span className={styles.emptyEmoji}>💫</span>
                <p>まだ投稿がありません</p>
                <p className="text-muted text-sm">最初のエモい瞬間を共有しませんか？</p>
              </div>
            ) : (
              posts.map((post, index) => {
                // Check for duplicate keys
                const isDuplicate = posts.filter(p => p.id === post.id).length > 1;
                if (isDuplicate) {
                  console.warn('Duplicate post ID found:', post.id);
                }

                return (
                  <PostCard
                    key={`${post.id}-${index}`}
                    post={post}
                    onReaction={handleReaction}
                    onComment={handleComment}
                  />
                );
              })
            )}
          </section>
        </div>
      </main>
    </>
  );
}
