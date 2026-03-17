import styles from './Placeholder.module.css'

export default function Tracking() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Tracking</h1>
        <p className={styles.subtitle}>Track shipments on the map and view real-time status.</p>
      </header>
      <div className={styles.placeholder}>
        <span className={styles.icon}>📍</span>
        <p>Tracking map view — integrate with your mapping or tracking API.</p>
      </div>
    </div>
  )
}
