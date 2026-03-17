export const kpiCards = [
  { label: 'Active Shipments', value: '1,247', change: '+12%', changeLabel: 'vs last week', icon: 'box' },
  { label: 'In Transit', value: '892', change: '+8%', changeLabel: 'vs last week', icon: 'truck' },
  { label: 'In Customs', value: '156', change: '-3%', changeLabel: 'vs last week', icon: 'customs' },
  { label: 'Delivered Today', value: '43', change: '+22%', changeLabel: 'vs last week', icon: 'check' },
]

export const recentShipments = [
  { id: 'SHP-2024-001', company: 'Tech Solutions Inc', status: 'In Transit', eta: '2026-03-19' },
  { id: 'SHP-2024-002', company: 'Global Imports Ltd', status: 'Customs', eta: '2026-03-20' },
  { id: 'SHP-2024-003', company: 'Pacific Trading Co', status: 'Delivered', eta: '2026-03-17' },
  { id: 'SHP-2024-004', company: 'Euro Logistics', status: 'In Transit', eta: '2026-03-21' },
  { id: 'SHP-2024-005', company: 'Asia Pacific Ltd', status: 'Pending', eta: '2026-03-25' },
]

export const shipmentByStatus = [
  { status: 'Pending', count: 199, color: 'var(--pending)' },
  { status: 'In Transit', count: 892, color: 'var(--success)' },
  { status: 'In Customs', count: 156, color: 'var(--warning)' },
  { status: 'Delivered', count: 2341, color: 'var(--info)' },
]

export const shipmentsTable = [
  { id: 'SHP-2024-001', client: 'Tech Solutions Inc', origin: 'Shanghai, China', destination: 'Los Angeles, USA', status: 'In Transit', eta: '2026-03-19' },
  { id: 'SHP-2024-002', client: 'Global Imports Ltd', origin: 'Hamburg, Germany', destination: 'New York, USA', status: 'Customs', eta: '2026-03-20' },
  { id: 'SHP-2024-003', client: 'Pacific Trading Co', origin: 'Tokyo, Japan', destination: 'Seattle, USA', status: 'Delivered', eta: '2026-03-17' },
  { id: 'SHP-2024-004', client: 'Euro Logistics', origin: 'Rotterdam, Netherlands', destination: 'Chicago, USA', status: 'In Transit', eta: '2026-03-21' },
  { id: 'SHP-2024-005', client: 'Asia Pacific Ltd', origin: 'Singapore', destination: 'San Francisco, USA', status: 'Pending', eta: '2026-03-25' },
  { id: 'SHP-2024-006', client: 'Nordic Cargo', origin: 'Oslo, Norway', destination: 'Boston, USA', status: 'In Transit', eta: '2026-03-22' },
  { id: 'SHP-2024-007', client: 'Mediterranean Freight', origin: 'Barcelona, Spain', destination: 'Miami, USA', status: 'Customs', eta: '2026-03-23' },
]

export const documentsList = [
  { title: 'Bill of Lading - SHP-2024-001', date: '2026-03-10', size: '2.4 MB', type: 'bill' },
  { title: 'Commercial Invoice - SHP-2024-002', date: '2026-03-11', size: '1.8 MB', type: 'invoice' },
  { title: 'Packing List - SHP-2024-003', date: '2026-03-12', size: '956 KB', type: 'invoice' },
  { title: 'Certificate of Origin - SHP-2024-004', date: '2026-03-13', size: '1.2 MB', type: 'certificate' },
  { title: 'Customs Declaration - SHP-2024-005', date: '2026-03-14', size: '3.1 MB', type: 'bill' },
  { title: 'Insurance Certificate - SHP-2024-006', date: '2026-03-15', size: '1.5 MB', type: 'certificate' },
]
