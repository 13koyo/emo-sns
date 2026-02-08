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
            </div>
        </header>
    );
}
