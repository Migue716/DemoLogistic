import { useState } from 'react'
import styles from './Settings.module.css'

export default function Settings() {
  const [profile, setProfile] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@acmecorp.com',
    company: 'Acme Corp',
  })
  const [prefs, setPrefs] = useState({
    language: 'en',
    timezone: 'UTC-8',
    dateFormat: 'YYYY-MM-DD',
  })
  const [notifications, setNotifications] = useState({
    emailUpdates: true,
    smsCustoms: true,
    weeklySummary: false,
    promotional: false,
  })

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Settings</h1>
        <p className={styles.subtitle}>Manage your account and preferences</p>
      </header>

      <div className={styles.grid}>
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </span>
            <h2 className={styles.cardTitle}>Profile Information</h2>
          </div>
          <div className={styles.fields}>
            <label className={styles.label}>
              First Name
              <input
                type="text"
                value={profile.firstName}
                onChange={(e) => setProfile((p) => ({ ...p, firstName: e.target.value }))}
                className={styles.input}
              />
            </label>
            <label className={styles.label}>
              Last Name
              <input
                type="text"
                value={profile.lastName}
                onChange={(e) => setProfile((p) => ({ ...p, lastName: e.target.value }))}
                className={styles.input}
              />
            </label>
            <label className={styles.label}>
              Email
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
                className={styles.input}
              />
            </label>
            <label className={styles.label}>
              Company
              <input type="text" value={profile.company} readOnly className={styles.input} />
            </label>
          </div>
        </section>

        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
              </svg>
            </span>
            <h2 className={styles.cardTitle}>Preferences</h2>
          </div>
          <div className={styles.fields}>
            <label className={styles.label}>
              Language
              <select
                value={prefs.language}
                onChange={(e) => setPrefs((p) => ({ ...p, language: e.target.value }))}
                className={styles.select}
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="de">German</option>
                <option value="fr">French</option>
              </select>
            </label>
            <label className={styles.label}>
              Timezone
              <select
                value={prefs.timezone}
                onChange={(e) => setPrefs((p) => ({ ...p, timezone: e.target.value }))}
                className={styles.select}
              >
                <option value="UTC-8">UTC-8 (Pacific)</option>
                <option value="UTC-5">UTC-5 (Eastern)</option>
                <option value="UTC">UTC</option>
                <option value="UTC+1">UTC+1 (Central Europe)</option>
              </select>
            </label>
            <label className={styles.label}>
              Date Format
              <select
                value={prefs.dateFormat}
                onChange={(e) => setPrefs((p) => ({ ...p, dateFormat: e.target.value }))}
                className={styles.select}
              >
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              </select>
            </label>
          </div>
        </section>

        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 01-3.46 0" />
              </svg>
            </span>
            <h2 className={styles.cardTitle}>Notifications</h2>
          </div>
          <div className={styles.checkboxes}>
            <label className={styles.checkbox}>
              <input
                type="checkbox"
                checked={notifications.emailUpdates}
                onChange={(e) => setNotifications((n) => ({ ...n, emailUpdates: e.target.checked }))}
              />
              <span>Email notifications for shipment updates</span>
            </label>
            <label className={styles.checkbox}>
              <input
                type="checkbox"
                checked={notifications.smsCustoms}
                onChange={(e) => setNotifications((n) => ({ ...n, smsCustoms: e.target.checked }))}
              />
              <span>SMS alerts for customs clearance</span>
            </label>
            <label className={styles.checkbox}>
              <input
                type="checkbox"
                checked={notifications.weeklySummary}
                onChange={(e) => setNotifications((n) => ({ ...n, weeklySummary: e.target.checked }))}
              />
              <span>Weekly summary reports</span>
            </label>
            <label className={styles.checkbox}>
              <input
                type="checkbox"
                checked={notifications.promotional}
                onChange={(e) => setNotifications((n) => ({ ...n, promotional: e.target.checked }))}
              />
              <span>Promotional emails</span>
            </label>
          </div>
        </section>

        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                <line x1="1" y1="10" x2="23" y2="10" />
              </svg>
            </span>
            <h2 className={styles.cardTitle}>Subscription</h2>
          </div>
          <div className={styles.subscription}>
            <p className={styles.subLabel}>Current Plan</p>
            <p className={styles.subPlan}>Premium</p>
            <button type="button" className={styles.manageBtn}>Manage Subscription</button>
          </div>
        </section>
      </div>
    </div>
  )
}
