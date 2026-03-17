import Link from 'next/link';
import styles from './Header.module.css';

export default function Header() {
    return (
        <header className={styles.header}>
            <div className={`container ${styles.headerInner}`}>
                <div className={styles.logo}>
                    <span className={styles.logoEmoji}>💫</span>
                    <h1 className={styles.logoText}>エモい瞬間</h1>
                </div>
                <p className={styles.tagline}>みんなで肯定し合える場所</p>
                <Link href="/amulet" className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl hover:scale-110 transition-transform" title="お守りを見る">
                    🧿
                </Link>
            </div>
        </header>
    );
}
