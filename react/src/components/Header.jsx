import styles from './Header.module.css'

export default function Header() {
  return (
    <header className={styles.header}>
      <input
        type="search"
        className={styles.search}
        placeholder="Search shipments, tracking numbers..."
        aria-label="Search"
      />
      <div className={styles.right}>
        <button type="button" className={styles.notify} aria-label="Notifications">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 01-3.46 0" />
          </svg>
        </button>
        <div className={styles.account}>
          <span className={styles.company}>Acme Corp</span>
          <span className={styles.plan}>Premium Account</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
        <div className={styles.avatar}>JD</div>
      </div>
    </header>
  )
}
