import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgClass } from '@angular/common';
import { ShipTrackApiService } from '../../data/shiptrack-api.service';
import type { ShipmentRow } from '../../data/shiptrack.models';

@Component({
  selector: 'app-shipments',
  standalone: true,
  imports: [NgClass],
  templateUrl: './shipments.component.html',
  styleUrl: './shipments.component.css',
})
export class ShipmentsComponent implements OnInit {
  private readonly api = inject(ShipTrackApiService);
  private readonly destroyRef = inject(DestroyRef);

  readonly search = signal('');
  readonly filterOpen = signal(false);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly rows = signal<ShipmentRow[]>([]);

  readonly filtered = computed(() => {
    const q = this.search().toLowerCase().trim();
    const list = this.rows();
    if (!q) return list;
    return list.filter(
      (row) =>
        row.id.toLowerCase().includes(q) ||
        row.client.toLowerCase().includes(q) ||
        row.destination.toLowerCase().includes(q) ||
        row.origin.toLowerCase().includes(q)
    );
  });

  ngOnInit(): void {
    this.api
      .getShipments()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.rows.set(data);
          this.loading.set(false);
        },
        error: () => {
          this.error.set('Could not load shipments. Is the API running on port 3000?');
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

  onSearch(value: string): void {
    this.search.set(value);
  }

  toggleFilter(): void {
    this.filterOpen.update((v) => !v);
  }

  exportCsv(): void {
    const data = this.filtered();
    const csv = [
      ['Shipment ID', 'Client', 'Origin', 'Destination', 'Status', 'ETA'].join(','),
      ...data.map((r) => [r.id, r.client, r.origin, r.destination, r.status, r.eta].join(',')),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'shipments.csv';
    a.click();
    URL.revokeObjectURL(url);
  }
}
