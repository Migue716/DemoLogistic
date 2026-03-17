import { useState, useMemo } from 'react'
import { documentsList } from '../data/mock'
import styles from './Documents.module.css'

const TABS = [
  { id: 'all', label: 'All Documents' },
  { id: 'bill', label: 'Bills of Lading' },
  { id: 'invoice', label: 'Invoices' },
  { id: 'certificate', label: 'Certificates' },
]

export default function Documents() {
  const [activeTab, setActiveTab] = useState('all')

  const filtered = useMemo(() => {
    if (activeTab === 'all') return documentsList
    return documentsList.filter((doc) => doc.type === activeTab)
  }, [activeTab])

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Documents</h1>
        <p className={styles.subtitle}>Manage shipping documents and certificates</p>
      </header>

      <div className={styles.tabs}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={activeTab === tab.id ? `${styles.tab} ${styles.tabActive}` : styles.tab}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className={styles.card}>
        <ul className={styles.list}>
          {filtered.map((doc) => (
            <li key={doc.title} className={styles.row}>
              <span className={styles.docIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                  <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
                </svg>
              </span>
              <div className={styles.docInfo}>
                <span className={styles.docTitle}>{doc.title}</span>
                <span className={styles.docMeta}>
                  {doc.date} · {doc.size}
                </span>
              </div>
              <button type="button" className={styles.downloadBtn} aria-label={`Download ${doc.title}`}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
        {filtered.length === 0 && (
          <p className={styles.empty}>No documents in this category.</p>
        )}
      </div>
    </div>
  )
}
