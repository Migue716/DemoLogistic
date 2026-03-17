import styles from './Placeholder.module.css'

export default function Analytics() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Analytics</h1>
        <p className={styles.subtitle}>View reports and shipment analytics.</p>
      </header>
      <div className={styles.placeholder}>
        <span className={styles.icon}>📊</span>
        <p>Analytics and reports — add charts and KPIs here.</p>
      </div>
    </div>
  )
}
