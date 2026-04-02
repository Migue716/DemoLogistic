import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgClass } from '@angular/common';
import { forkJoin } from 'rxjs';
import { ShipTrackApiService } from '../../data/shiptrack-api.service';
import type { KpiCard, RecentShipment, ShipmentByStatus } from '../../data/shiptrack.models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgClass],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  private readonly api = inject(ShipTrackApiService);
  private readonly destroyRef = inject(DestroyRef);

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly kpiCards = signal<KpiCard[]>([]);
  readonly recentShipments = signal<RecentShipment[]>([]);
  readonly shipmentByStatus = signal<ShipmentByStatus[]>([]);

  readonly maxCount = computed(() => {
    const rows = this.shipmentByStatus();
    if (!rows.length) return 1;
    return Math.max(...rows.map((s) => s.count));
  });

  ngOnInit(): void {
    forkJoin({
      kpis: this.api.getKpis(),
      recent: this.api.getRecentShipments(),
      byStatus: this.api.getShipmentByStatus(),
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ kpis, recent, byStatus }) => {
          this.kpiCards.set(kpis);
          this.recentShipments.set(recent);
          this.shipmentByStatus.set(byStatus);
          this.loading.set(false);
        },
        error: () => {
          this.error.set('Could not load dashboard. Is the API running on port 3000?');
          this.loading.set(false);
        },
      });
  }

  statusClass(status: string): string {
    const map: Record<string, string> = {
      'In Transit': 'transit',
      Customs: 'customs',
      'In Customs': 'customs',
      Delivered: 'delivered',
      Pending: 'pending',
    };
    return map[status] ?? 'pending';
  }
}
