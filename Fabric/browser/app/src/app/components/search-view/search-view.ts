import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BacklogService } from '../../services/backlog.service';
import { FilterService } from '../../services/filter.service';
import { StateBadge } from '../state-badge/state-badge';
import { SearchResult } from '../../models/backlog.models';

@Component({
  selector: 'app-search-view',
  imports: [
    CommonModule, MatIconModule, MatProgressSpinnerModule,
    MatDividerModule, MatTooltipModule, StateBadge,
  ],
  templateUrl: './search-view.html',
  styleUrl: './search-view.scss',
})
export class SearchView {
  private svc = inject(BacklogService);
  filter = inject(FilterService);
  private route = inject(ActivatedRoute);

  query = signal('');
  results = signal<SearchResult[]>([]);
  loading = signal(false);

  readonly KIND_LABELS: Record<string, string> = {
    epic: 'Epic', feature: 'Feature', workitem: 'Work Item',
    task: 'Task', request: 'Request',
  };

  constructor() {
    effect(() => {
      const params = this.route.snapshot.queryParamMap;
      const q = params.get('q') ?? '';
      this.query.set(q);
      if (!q.trim()) { this.results.set([]); return; }
      this.loading.set(true);
      this.svc.search(q, this.filter.showClosed()).subscribe({
        next: r => { this.results.set(r); this.loading.set(false); },
        error: () => this.loading.set(false),
      });
    });
  }

  openItem(r: SearchResult): void {
    this.filter.openDetail(r);
  }

  /** Bold the matched query term in the snippet. */
  highlightSnippet(snippet: string): string {
    if (!snippet) return '';
    // The Python server already wraps matches in **bold**; convert to <strong>
    return snippet.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  }
}
