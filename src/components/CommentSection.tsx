'use client';

import { useState, useEffect } from 'react';
import type { Comment } from '@/app/page';
import { blockUser, unblockUser, isBlocked, getBlockedUsers } from '@/lib/blockList';
import styles from './CommentSection.module.css';

interface CommentSectionProps {
    postId: string;
    comments: Comment[];
    onComment: (postId: string, content: string) => void;
}

function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);

    if (diffMins < 1) return 'たった今';
    if (diffMins < 60) return `${diffMins}分前`;
    if (diffHours < 24) return `${diffHours}時間前`;

    return date.toLocaleDateString('ja-JP', {
        month: 'short',
        day: 'numeric',
    });
}

export default function CommentSection({ postId, comments, onComment }: CommentSectionProps) {
    const [newComment, setNewComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [blockedUsers, setBlockedUsers] = useState<string[]>([]);
    const [showBlocked, setShowBlocked] = useState(false);

    useEffect(() => {
        setBlockedUsers(getBlockedUsers());
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() || isSubmitting) return;

        setIsSubmitting(true);
        try {
            await onComment(postId, newComment.trim());
            setNewComment('');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleBlock = (commentId: string) => {
        blockUser(commentId);
        setBlockedUsers(getBlockedUsers());
    };

    const handleUnblock = (commentId: string) => {
        unblockUser(commentId);
        setBlockedUsers(getBlockedUsers());
    };

    const visibleComments = comments.filter(c => !blockedUsers.includes(c.id));
    const blockedComments = comments.filter(c => blockedUsers.includes(c.id));

    return (
        <div className={styles.commentSection}>
            {/* 既存コメント一覧 */}
            {visibleComments.length > 0 && (
                <div className={styles.commentList}>
                    {visibleComments.map((comment) => (
                        <div key={comment.id} className={styles.comment}>
                            <div className={styles.commentAvatar}>🌟</div>
                            <div className={styles.commentBody}>
                                <div className={styles.commentHeader}>
                                    <span className={styles.commentAuthor}>名無しさん</span>
                                    <span className={styles.commentTime}>{formatDate(comment.createdAt)}</span>
                                    <button
                                        className={styles.blockBtn}
                                        onClick={() => handleBlock(comment.id)}
                                        title="このコメントをブロック"
                                    >
                                        🚫
                                    </button>
                                </div>
                                <p className={styles.commentText}>{comment.content}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ブロック済みコメントの表示切り替え */}
            {blockedComments.length > 0 && (
                <div className={styles.blockedSection}>
                    <button
                        className={styles.toggleBlockedBtn}
                        onClick={() => setShowBlocked(!showBlocked)}
                    >
                        {showBlocked ? 'ブロック中のコメントを隠す' : `${blockedComments.length}件のブロック済みコメントを表示`}
                    </button>

                    {showBlocked && (
                        <div className={`${styles.commentList} ${styles.blockedList}`}>
                            {blockedComments.map((comment) => (
                                <div key={comment.id} className={`${styles.comment} ${styles.blockedComment}`}>
                                    <div className={styles.commentAvatar}>👻</div>
                                    <div className={styles.commentBody}>
                                        <div className={styles.commentHeader}>
                                            <span className={styles.commentAuthor}>ブロック中</span>
                                            <span className={styles.commentTime}>{formatDate(comment.createdAt)}</span>
                                            <button
                                                className={styles.unblockBtn}
                                                onClick={() => handleUnblock(comment.id)}
                                                title="ブロックを解除"
                                            >
                                                🔓 解除
                                            </button>
                                        </div>
                                        <p className={styles.commentText}>{comment.content}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* コメント入力フォーム */}
            <form className={styles.commentForm} onSubmit={handleSubmit}>
                <input
                    type="text"
                    className={styles.commentInput}
                    placeholder="温かいコメントを書く... 💬"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    maxLength={200}
                />
                <button
                    type="submit"
                    className={styles.submitBtn}
                    disabled={!newComment.trim() || isSubmitting}
                >
                    {isSubmitting ? '...' : '送信'}
                </button>
            </form>

            <p className={styles.hint}>
                💡 肯定的な言葉で励ましあおう
            </p>
        </div>
    );
}

