'use client';

import { useState, useRef } from 'react';
import type { Post } from '@/app/page';
import styles from './PostForm.module.css';

interface PostFormProps {
    onPost: (post: Post) => void;
}

const MOODS = [
    { value: 'happy', label: '嬉しい', emoji: '😊' },
    { value: 'touched', label: '感動', emoji: '🥹' },
    { value: 'nostalgic', label: '懐かしい', emoji: '🌅' },
    { value: 'peaceful', label: '穏やか', emoji: '🌿' },
    { value: 'grateful', label: '感謝', emoji: '🙏' },
    { value: 'hopeful', label: '希望', emoji: '✨' },
];

export default function PostForm({ onPost }: PostFormProps) {
    const [content, setContent] = useState('');
    const [mood, setMood] = useState('');
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim() && !imagePreview) return;

        setIsSubmitting(true);
        try {
            const res = await fetch('/api/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: content.trim(),
                    imageUrl: imagePreview,
                    mood: mood || 'default',
                }),
            });


            console.log('Response status:', res.status);
            const responseData = await res.json();
            console.log('Response data:', responseData);

            if (!res.ok) {
                console.error('API Error:', responseData);
                alert('投稿に失敗しました: ' + (responseData.error || 'Unknown error'));
                return;
            }

            const newPost = responseData;

            // Ensure newPost has required properties
            if (!newPost.id) {
                console.error('Invalid post returned:', newPost);
                alert('投稿データが不正です');
                return;
            }

            // Ensure comments array exists
            if (!newPost.comments) {
                newPost.comments = [];
            }

            onPost(newPost);
            setContent('');
            setMood('');
            setImagePreview(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } catch (error) {
            console.error('Failed to create post:', error);
            alert('投稿中にエラーが発生しました');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form className={`card ${styles.form}`} onSubmit={handleSubmit}>
            <h2 className={styles.title}>
                <span>✍️</span> エモい瞬間を共有
            </h2>

            <textarea
                className={styles.textarea}
                placeholder="今日のエモい瞬間は？&#10;&#10;些細なことでもOK！みんなで肯定し合おう 💫"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                maxLength={500}
            />

            {/* 画像プレビュー */}
            {imagePreview && (
                <div className={styles.imagePreview}>
                    <img src={imagePreview} alt="プレビュー" />
                    <button
                        type="button"
                        className={styles.removeImage}
                        onClick={removeImage}
                    >
                        ✕
                    </button>
                </div>
            )}

            {/* ムード選択 */}
            <div className={styles.moodSection}>
                <span className={styles.moodLabel}>今の気分:</span>
                <div className={styles.moodButtons}>
                    {MOODS.map((m) => (
                        <button
                            key={m.value}
                            type="button"
                            className={`${styles.moodBtn} ${mood === m.value ? styles.moodBtnActive : ''}`}
                            onClick={() => setMood(mood === m.value ? '' : m.value)}
                        >
                            <span>{m.emoji}</span>
                            <span className={styles.moodText}>{m.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* アクションボタン */}
            <div className={styles.actions}>
                <div className={styles.attachments}>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        ref={fileInputRef}
                        className={styles.fileInput}
                        id="image-upload"
                    />
                    <label htmlFor="image-upload" className={styles.attachBtn}>
                        📷 写真を追加
                    </label>
                </div>

                <button
                    type="submit"
                    className="btn-primary"
                    disabled={isSubmitting || (!content.trim() && !imagePreview)}
                >
                    {isSubmitting ? '投稿中...' : '投稿する 💫'}
                </button>
            </div>

            <p className={styles.hint}>
                💡 ここは肯定だけの空間。安心して自分を表現してね
            </p>
        </form>
    );
}
