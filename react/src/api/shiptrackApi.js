import { apiUrl } from '../config'

async function getJson(path) {
  const res = await fetch(`${apiUrl}${path}`)
  if (!res.ok) {
    const err = new Error(`Request failed: ${res.status}`)
    err.status = res.status
    throw err
  }
  return res.json()
}

export function getKpis() {
  return getJson('/api/kpis')
}

export function getRecentShipments() {
  return getJson('/api/shipments/recent')
}

export function getShipmentByStatus() {
  return getJson('/api/shipments/by-status')
}

export function getShipments(params = {}) {
  const q = new URLSearchParams()
  if (params.q?.trim()) q.set('q', params.q.trim())
  if (params.status?.trim()) q.set('status', params.status.trim())
  const qs = q.toString()
  return getJson(`/api/shipments${qs ? `?${qs}` : ''}`)
}

export function getDocuments(type) {
  const qs = type?.trim() ? `?type=${encodeURIComponent(type.trim())}` : ''
  return getJson(`/api/documents${qs}`)
}
