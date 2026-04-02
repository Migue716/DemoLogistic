import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ShipTrackApiService } from '../../data/shiptrack-api.service';
import type { DocumentItem } from '../../data/shiptrack.models';

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
export class DocumentsComponent implements OnInit {
  private readonly api = inject(ShipTrackApiService);
  private readonly destroyRef = inject(DestroyRef);

  readonly tabs = TABS;
  readonly activeTab = signal('all');
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly documents = signal<DocumentItem[]>([]);

  readonly filtered = computed(() => {
    const tab = this.activeTab();
    const list = this.documents();
    if (tab === 'all') return list;
    return list.filter((doc) => doc.type === tab);
  });

  ngOnInit(): void {
    this.api
      .getDocuments()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.documents.set(data);
          this.loading.set(false);
        },
        error: () => {
          this.error.set('Could not load documents. Is the API running on port 3000?');
          this.loading.set(false);
        },
      });
  }

  setTab(id: string): void {
    this.activeTab.set(id);
  }
}
