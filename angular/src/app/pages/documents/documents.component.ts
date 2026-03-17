import { Component, inject, computed, signal } from '@angular/core';
import { MockService } from '../../data/mock.service';

const TABS = [
  { id: 'all', label: 'All Documents' },
  { id: 'bill', label: 'Bills of Lading' },
  { id: 'invoice', label: 'Invoices' },
  { id: 'certificate', label: 'Certificates' },
];

@Component({
  selector: 'app-documents',
  standalone: true,
  templateUrl: './documents.component.html',
  styleUrl: './documents.component.css',
})
export class DocumentsComponent {
  private mock = inject(MockService);

  tabs = TABS;
  activeTab = signal('all');

  filtered = computed(() => {
    const tab = this.activeTab();
    if (tab === 'all') return this.mock.documentsList;
    return this.mock.documentsList.filter((doc) => doc.type === tab);
  });

  setTab(id: string): void {
    this.activeTab.set(id);
  }
}
