'use client';

import { useState } from 'react';
import type { Post } from '@/app/page';
import ReactionBar from './ReactionBar';
import CommentSection from './CommentSection';
import AmuletButton from './AmuletButton';
import styles from './PostCard.module.css';

interface PostCardProps {
    post: Post;
    onReaction: (postId: string, reactionType: keyof Post['reactions']) => void;
    onComment: (postId: string, content: string) => void;
}

const MOOD_EMOJI: Record<string, string> = {
    happy: '😊',
    touched: '🥹',
    nostalgic: '🌅',
    peaceful: '🌿',
    grateful: '🙏',
    hopeful: '✨',
    default: '💫',
};

const REPORT_REASONS = [
    { value: 'inappropriate', label: '不快なコンテンツ' },
    { value: 'spam', label: 'スパム' },
    { value: 'harassment', label: '誹謗中傷' },
    { value: 'other', label: 'その他' },
];

function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'たった今';
    if (diffMins < 60) return `${diffMins}分前`;
    if (diffHours < 24) return `${diffHours}時間前`;
    if (diffDays < 7) return `${diffDays}日前`;

    return date.toLocaleDateString('ja-JP', {
        month: 'short',
        day: 'numeric',
    });
}

export default function PostCard({ post, onReaction, onComment }: PostCardProps) {
    const [showComments, setShowComments] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [reportSubmitted, setReportSubmitted] = useState(false);

    const handleReport = async (reason: string) => {
        try {
            await fetch('/api/reports', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ postId: post.id, reason }),
            });
            setReportSubmitted(true);
            setTimeout(() => {
                setShowReportModal(false);
                setReportSubmitted(false);
            }, 1500);
        } catch (error) {
            console.error('Failed to report:', error);
        }
    };

    return (
        <article className={`card ${styles.postCard} animate-fade-in`}>
            {/* ヘッダー */}
            <div className={styles.header}>
                <div className={styles.avatar}>
                    {MOOD_EMOJI[post.mood] || '💫'}
                </div>
                <div className={styles.meta}>
                    <span className={styles.anonymous}>名無しさん</span>
                    <span className={styles.time}>{formatDate(post.createdAt)}</span>
                </div>
                <button
                    className={styles.reportBtn}
                    onClick={() => setShowReportModal(true)}
                    title="この投稿を報告"
                >
                    ⚠️
                </button>
            </div>

            {/* コンテンツ */}
            <div className={styles.content}>
                {post.content && <p className={styles.text}>{post.content}</p>}
                {post.imageUrl && (
                    <div className={styles.imageWrapper}>
                        <img src={post.imageUrl} alt="投稿画像" className={styles.image} />
                    </div>
                )}
            </div>

            {/* リアクションバー */}
            <ReactionBar
                postId={post.id}
                reactions={post.reactions}
                onReaction={onReaction}
            />

            <div className="flex justify-end px-4 mb-2">
                <AmuletButton post={{
                    id: Number(post.id),
                    content: post.content,
                    mood: post.mood,
                    createdAt: post.createdAt
                }} />
            </div>

            {/* コメントセクション */}
            <div className={styles.commentToggle}>
                <button
                    className={styles.commentToggleBtn}
                    onClick={() => setShowComments(!showComments)}
                >
                    💬 コメント ({post.comments?.length || 0})
                </button>
            </div>

            {showComments && (
                <CommentSection
                    postId={post.id}
                    comments={post.comments || []}
                    onComment={onComment}
                />
            )}

            {/* 報告モーダル */}
            {showReportModal && (
                <div className={styles.modalOverlay} onClick={() => setShowReportModal(false)}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        {reportSubmitted ? (
                            <div className={styles.reportSuccess}>
                                ✅ 報告を受け付けました
                            </div>
                        ) : (
                            <>
                                <h3 className={styles.modalTitle}>この投稿を報告</h3>
                                <div className={styles.reportReasons}>
                                    {REPORT_REASONS.map((reason) => (
                                        <button
                                            key={reason.value}
                                            className={styles.reasonBtn}
                                            onClick={() => handleReport(reason.value)}
                                        >
                                            {reason.label}
                                        </button>
                                    ))}
                                </div>
                                <button
                                    className={styles.cancelBtn}
                                    onClick={() => setShowReportModal(false)}
                                >
                                    キャンセル
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </article>
    );
}

