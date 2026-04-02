import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import type {
  DocumentItem,
  KpiCard,
  RecentShipment,
  ShipmentByStatus,
  ShipmentRow,
} from './shiptrack.models';

@Injectable({ providedIn: 'root' })
export class ShipTrackApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  getKpis() {
    return this.http.get<KpiCard[]>(`${this.baseUrl}/api/kpis`);
  }

  getRecentShipments() {
    return this.http.get<RecentShipment[]>(`${this.baseUrl}/api/shipments/recent`);
  }

  getShipmentByStatus() {
    return this.http.get<ShipmentByStatus[]>(`${this.baseUrl}/api/shipments/by-status`);
  }

  getShipments(q?: string, status?: string) {
    let params = new HttpParams();
    if (q?.trim()) params = params.set('q', q.trim());
    if (status?.trim()) params = params.set('status', status.trim());
    return this.http.get<ShipmentRow[]>(`${this.baseUrl}/api/shipments`, { params });
  }

  getDocuments(type?: string) {
    let params = new HttpParams();
    if (type?.trim()) params = params.set('type', type.trim());
    return this.http.get<DocumentItem[]>(`${this.baseUrl}/api/documents`, { params });
  }
}
