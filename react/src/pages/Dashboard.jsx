import { useState, useEffect, useMemo } from 'react'
import { getKpis, getRecentShipments, getShipmentByStatus } from '../api/shiptrackApi'
import styles from './Dashboard.module.css'

function KpiIcon({ icon }) {
  const icons = {
    box: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
        <path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" />
      </svg>
    ),
    truck: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="1" y="3" width="15" height="13" />
        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
    customs: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    check: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  }
  return icons[icon] || null
}

function StatusBadge({ status }) {
  const map = {
    'In Transit': 'transit',
    Customs: 'customs',
    'In Customs': 'customs',
    Delivered: 'delivered',
    Pending: 'pending',
  }
  return <span className={`${styles.badge} ${styles[map[status] || 'pending']}`}>{status}</span>
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [kpiCards, setKpiCards] = useState([])
  const [recentShipments, setRecentShipments] = useState([])
  const [shipmentByStatus, setShipmentByStatus] = useState([])

  useEffect(() => {
    let cancelled = false
    Promise.all([getKpis(), getRecentShipments(), getShipmentByStatus()])
      .then(([kpis, recent, byStatus]) => {
        if (!cancelled) {
          setKpiCards(kpis)
          setRecentShipments(recent)
          setShipmentByStatus(byStatus)
          setLoading(false)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError('Could not load dashboard. Is the API running on port 3000?')
          setLoading(false)
        }
      })
    return () => {
      cancelled = true
    }
  }, [])

  const maxCount = useMemo(() => {
    if (!shipmentByStatus.length) return 1
    return Math.max(...shipmentByStatus.map((s) => s.count))
  }, [shipmentByStatus])

  if (error) {
    return (
      <div className={styles.page}>
        <p className={styles.stateError} role="alert">
          {error}
        </p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className={styles.page}>
        <p className={styles.stateLoading}>Loading dashboard…</p>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Dashboard Overview</h1>
        <p className={styles.subtitle}>Track your shipments in real-time.</p>
      </header>

      <div className={styles.kpiGrid}>
        {kpiCards.map((card) => (
          <div key={card.label} className={styles.kpiCard}>
            <div className={styles.kpiIcon}>
              <KpiIcon icon={card.icon} />
            </div>
            <div className={styles.kpiContent}>
              <span className={styles.kpiLabel}>{card.label}</span>
              <span className={styles.kpiValue}>{card.value}</span>
              <span className={styles.kpiChange}>
                {card.change} {card.changeLabel}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.bottomGrid}>
        <section className={styles.card}>
          <h2 className={styles.cardTitle}>Recent Shipments</h2>
          <ul className={styles.shipmentList}>
            {recentShipments.map((s) => (
              <li key={s.id} className={styles.shipmentRow}>
                <div>
                  <span className={styles.shipmentId}>{s.id}</span>
                  <span className={styles.shipmentCompany}>{s.company}</span>
                </div>
                <div className={styles.shipmentMeta}>
                  <StatusBadge status={s.status} />
                  <span className={styles.eta}>ETA: {s.eta}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.card}>
          <h2 className={styles.cardTitle}>Shipment by Status</h2>
          <div className={styles.barChart}>
            {shipmentByStatus.map((item) => (
              <div key={item.status} className={styles.barRow}>
                <span className={styles.barLabel}>{item.status}</span>
                <div className={styles.barTrack}>
                  <div
                    className={styles.barFill}
                    style={{
                      width: `${(item.count / maxCount) * 100}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
                <span className={styles.barCount}>{item.count}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
