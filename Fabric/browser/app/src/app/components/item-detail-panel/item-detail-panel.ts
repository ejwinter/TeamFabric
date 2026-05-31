import { Component, inject, signal, effect, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MarkdownComponent } from 'ngx-markdown';
import { BacklogService } from '../../services/backlog.service';
import { FilterService } from '../../services/filter.service';
import { StateBadge } from '../state-badge/state-badge';
import { ItemDetail } from '../../models/backlog.models';

@Component({
  selector: 'app-item-detail-panel',
  imports: [
    CommonModule, FormsModule, MatButtonModule, MatIconModule,
    MatProgressSpinnerModule, MatExpansionModule, MatDividerModule,
    MatTooltipModule, StateBadge, MarkdownComponent,
  ],
  templateUrl: './item-detail-panel.html',
  styleUrl: './item-detail-panel.scss',
})
export class ItemDetailPanel {
  private svc = inject(BacklogService);
  private snack = inject(MatSnackBar);
  filter = inject(FilterService);

  detail = signal<ItemDetail | null>(null);
  loading = signal(false);
  editing = signal(false);
  saving = signal(false);
  editContent = signal('');

  readonly KIND_LABELS: Record<string, string> = {
    epic: 'Epic', feature: 'Feature', workitem: 'Work Item',
    task: 'Task', request: 'Request',
  };

  readonly PROP_DISPLAY_ORDER = [
    'State', 'Type', 'Assigned to', 'Priority', 'Iteration',
    'Start Date', 'Target Date', 'Duration', 'Area', 'Product',
    'Effort', 'Estimated Hours', 'Remaining Hours', 'Labels',
  ];

  constructor() {
    effect(() => {
      const item = this.filter.openItem();
      if (!item) {
        this.detail.set(null);
        this.editing.set(false);
        return;
      }
      this.loading.set(true);
      this.editing.set(false);
      this.svc.getItem(item.path).subscribe({
        next: d => { this.detail.set(d); this.loading.set(false); },
        error: () => this.loading.set(false),
      });
    });
  }

  get breadcrumb(): string[] {
    const d = this.detail();
    if (!d) return [];
    const parts = d.path.split('/');
    // Extract meaningful names from path segments
    const crumbs: string[] = [];
    if (d.kind === 'feature' || d.kind === 'workitem' || d.kind === 'task') {
      const epicIdx = parts.indexOf('epics');
      if (epicIdx >= 0) crumbs.push(parts[epicIdx + 1]);
    }
    if (d.kind === 'workitem' || d.kind === 'task') {
      const featIdx = parts.indexOf('features');
      if (featIdx >= 0) crumbs.push(parts[featIdx + 1]);
    }
    if (d.kind === 'task') {
      const wiIdx = parts.indexOf('workitems');
      if (wiIdx >= 0) crumbs.push(parts[wiIdx + 1]);
    }
    crumbs.push(d.id);
    return crumbs;
  }

  orderedProps(props: Record<string, string>): Array<{ key: string; value: string }> {
    const shown = new Set<string>();
    const result: Array<{ key: string; value: string }> = [];
    for (const key of this.PROP_DISPLAY_ORDER) {
      if (props[key]) { result.push({ key, value: props[key] }); shown.add(key); }
    }
    for (const [key, value] of Object.entries(props)) {
      if (!shown.has(key)) result.push({ key, value });
    }
    return result;
  }

  startEdit(): void {
    const d = this.detail();
    if (!d) return;
    this.editContent.set(d.raw);
    this.editing.set(true);
  }

  cancelEdit(): void {
    this.editing.set(false);
  }

  saveEdit(): void {
    const d = this.detail();
    if (!d || this.saving()) return;
    this.saving.set(true);
    this.svc.saveItem(d.path, this.editContent()).subscribe({
      next: updated => {
        this.detail.set(updated);
        this.editing.set(false);
        this.saving.set(false);
        this.svc.refreshTree();
        this.snack.open('Saved', 'OK', { duration: 2000 });
      },
      error: () => {
        this.saving.set(false);
        this.snack.open('Save failed', 'Dismiss', { duration: 4000 });
      },
    });
  }

  close(): void {
    this.filter.closeDetail();
  }
}
