import { Component, inject } from '@angular/core';
import { NgClass } from '@angular/common';
import { MockService } from '../../data/mock.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgClass],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  private mock = inject(MockService);

  get kpiCards() {
    return this.mock.kpiCards;
  }
  get recentShipments() {
    return this.mock.recentShipments;
  }
  get shipmentByStatus() {
    return this.mock.shipmentByStatus;
  }
  get maxCount() {
    const counts = this.mock.shipmentByStatus.map((s) => s.count);
    return Math.max(...counts);
  }

  statusClass(status: string): string {
    const map: Record<string, string> = {
      'In Transit': 'transit',
      'Customs': 'customs',
      'Delivered': 'delivered',
      'Pending': 'pending',
    };
    return map[status] ?? 'pending';
  }
}
