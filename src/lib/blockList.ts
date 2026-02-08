'use client';

const STORAGE_KEY = 'emo-sns-blocked-users';

export function getBlockedUsers(): string[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}

export function blockUser(userId: string): void {
    const blocked = getBlockedUsers();
    if (!blocked.includes(userId)) {
        blocked.push(userId);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(blocked));
    }
}

export function unblockUser(userId: string): void {
    const blocked = getBlockedUsers();
    const filtered = blocked.filter(id => id !== userId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

export function isBlocked(userId: string): boolean {
    return getBlockedUsers().includes(userId);
}
