'use client';

import { useState } from 'react';
import type { Post } from '@/app/page';
import styles from './ReactionBar.module.css';

interface ReactionBarProps {
    postId: string;
    reactions: Post['reactions'];
    onReaction: (postId: string, reactionType: keyof Post['reactions']) => void;
}

const REACTIONS: { type: keyof Post['reactions']; emoji: string; label: string }[] = [
    { type: 'understand', emoji: '🤝', label: 'わかる！' },
    { type: 'lovely', emoji: '✨', label: '素敵！' },
    { type: 'emotional', emoji: '💫', label: 'エモい！' },
    { type: 'healing', emoji: '🌿', label: '癒される' },
    { type: 'energized', emoji: '💪', label: '元気もらった' },
];

export default function ReactionBar({ postId, reactions, onReaction }: ReactionBarProps) {
    const [animatingType, setAnimatingType] = useState<string | null>(null);

    const handleClick = (type: keyof Post['reactions']) => {
        setAnimatingType(type);
        onReaction(postId, type);
        setTimeout(() => setAnimatingType(null), 300);
    };

    return (
        <div className={styles.reactionBar}>
            {REACTIONS.map(({ type, emoji, label }) => (
                <button
                    key={type}
                    className={`${styles.reactionBtn} ${animatingType === type ? styles.reactionBtnActive : ''}`}
                    onClick={() => handleClick(type)}
                    title={label}
                >
                    <span className={styles.emoji}>{emoji}</span>
                    <span className={styles.count}>{reactions[type] || 0}</span>
                    <span className={styles.label}>{label}</span>
                </button>
            ))}
        </div>
    );
}
