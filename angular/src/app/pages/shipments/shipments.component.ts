import { Component, inject, computed, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { MockService } from '../../data/mock.service';

@Component({
  selector: 'app-shipments',
  standalone: true,
  imports: [NgClass],
  templateUrl: './shipments.component.html',
  styleUrl: './shipments.component.css',
})
export class ShipmentsComponent {
  private mock = inject(MockService);

  search = signal('');
  filterOpen = signal(false);

  filtered = computed(() => {
    const q = this.search().toLowerCase().trim();
    if (!q) return this.mock.shipmentsTable;
    return this.mock.shipmentsTable.filter(
      (row) =>
        row.id.toLowerCase().includes(q) ||
        row.client.toLowerCase().includes(q) ||
        row.destination.toLowerCase().includes(q) ||
        row.origin.toLowerCase().includes(q)
    );
  });

  statusClass(status: string): string {
    const map: Record<string, string> = {
      'In Transit': 'transit',
      'Customs': 'customs',
      'Delivered': 'delivered',
      'Pending': 'pending',
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
