import { useState, useMemo } from 'react'
import { shipmentsTable } from '../data/mock'
import styles from './Shipments.module.css'

function StatusBadge({ status }) {
  const map = {
    'In Transit': 'transit',
    'Customs': 'customs',
    'Delivered': 'delivered',
    'Pending': 'pending',
  }
  return <span className={`${styles.badge} ${styles[map[status] || 'pending']}`}>{status}</span>
}

export default function Shipments() {
  const [search, setSearch] = useState('')
  const [filterOpen, setFilterOpen] = useState(false)

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    if (!q) return shipmentsTable
    return shipmentsTable.filter(
      (row) =>
        row.id.toLowerCase().includes(q) ||
        row.client.toLowerCase().includes(q) ||
        row.destination.toLowerCase().includes(q) ||
        row.origin.toLowerCase().includes(q)
    )
  }, [search])

  function handleExport() {
    const csv = [
      ['Shipment ID', 'Client', 'Origin', 'Destination', 'Status', 'ETA'].join(','),
      ...filtered.map((r) => [r.id, r.client, r.origin, r.destination, r.status, r.eta].join(',')),
    ].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'shipments.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Shipments</h1>
          <p className={styles.subtitle}>Manage all your shipments.</p>
        </div>
        <button type="button" className={styles.exportBtn} onClick={handleExport}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
          </svg>
          Export
        </button>
      </header>

      <div className={styles.toolbar}>
        <input
          type="search"
          className={styles.search}
          placeholder="Search by ID, client, or destination..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search shipments"
        />
        <button
          type="button"
          className={styles.filterBtn}
          onClick={() => setFilterOpen(!filterOpen)}
          aria-pressed={filterOpen}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
          </svg>
          Filter
        </button>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Shipment ID</th>
              <th>Client</th>
              <th>Origin</th>
              <th>Destination</th>
              <th>Status</th>
              <th>ETA</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr key={row.id}>
                <td>
                  <span className={styles.linkId}>{row.id}</span>
                </td>
                <td>{row.client}</td>
                <td>{row.origin}</td>
                <td>{row.destination}</td>
                <td>
                  <StatusBadge status={row.status} />
                </td>
                <td>{row.eta}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className={styles.empty}>No shipments match your search.</p>
        )}
      </div>
    </div>
  )
}
