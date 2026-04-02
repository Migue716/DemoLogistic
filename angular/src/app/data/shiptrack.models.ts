export interface KpiCard {
  label: string;
  value: string;
  change: string;
  changeLabel: string;
  icon: string;
}

export interface RecentShipment {
  id: string;
  company: string;
  status: string;
  eta: string;
}

export interface ShipmentByStatus {
  status: string;
  count: number;
  color: string;
}

export interface ShipmentRow {
  id: string;
  client: string;
  origin: string;
  destination: string;
  status: string;
  eta: string;
}

export interface DocumentItem {
  title: string;
  date: string;
  size: string;
  type: string;
}
