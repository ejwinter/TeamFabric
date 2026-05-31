import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { toSignal } from '@angular/core/rxjs-interop';
import { BacklogService } from '../../services/backlog.service';
import { FilterService } from '../../services/filter.service';
import { WorkItem } from '../../models/backlog.models';

interface SprintWorkItem extends WorkItem {
  epicTitle: string;
  featureTitle: string;
}

const STATE_ORDER = ['New', 'Active', 'Resolved', 'Closed', 'Removed'];

@Component({
  selector: 'app-sprint-board',
  imports: [
    CommonModule, MatIconModule, MatProgressSpinnerModule, MatTooltipModule,
  ],
  templateUrl: './sprint-board.html',
  styleUrl: './sprint-board.scss',
})
export class SprintBoard {
  private svc = inject(BacklogService);
  filter = inject(FilterService);

  tree = toSignal(this.svc.getTree());
  selectedSprint = signal<string | null>(null);

  sprints = computed<string[]>(() => {
    const t = this.tree();
    if (!t) return [];
    const found = new Set<string>();
    for (const epic of t.epics) {
      for (const feat of epic.features) {
        for (const wi of feat.workitems) {
          const iter = (wi.properties['Iteration'] ?? wi.properties['iteration'] ?? '').trim();
          if (iter) found.add(iter);
        }
      }
    }
    return [...found].sort().reverse();
  });

  effectiveSprint = computed<string | null>(() => {
    const sel = this.selectedSprint();
    const list = this.sprints();
    if (sel && list.includes(sel)) return sel;
    return list[0] ?? null;
  });

  sprintItems = computed<SprintWorkItem[]>(() => {
    const t = this.tree();
    const sprint = this.effectiveSprint();
    if (!t || !sprint) return [];
    const result: SprintWorkItem[] = [];
    for (const epic of t.epics) {
      for (const feat of epic.features) {
        for (const wi of feat.workitems) {
          const iter = (wi.properties['Iteration'] ?? wi.properties['iteration'] ?? '').trim();
          if (iter === sprint) {
            result.push({ ...wi, epicTitle: epic.title, featureTitle: feat.title });
          }
        }
      }
    }
    return result;
  });

  columns = computed<{ state: string; items: SprintWorkItem[] }[]>(() => {
    const items = this.sprintItems();
    const map = new Map<string, SprintWorkItem[]>();
    for (const item of items) {
      if (!map.has(item.state)) map.set(item.state, []);
      map.get(item.state)!.push(item);
    }
    const known = STATE_ORDER.filter(s => map.has(s)).map(s => ({ state: s, items: map.get(s)! }));
    const other = [...map.keys()].filter(s => !STATE_ORDER.includes(s)).sort()
      .map(s => ({ state: s, items: map.get(s)! }));
    return [...known, ...other];
  });

  selectSprint(sprint: string): void {
    this.selectedSprint.set(sprint);
    this.filter.closeDetail();
  }

  openItem(item: SprintWorkItem): void {
    this.filter.openDetail(item);
  }

  isSelected(item: SprintWorkItem): boolean {
    return this.filter.openItem()?.path === item.path;
  }

  assigneeInitials(wi: WorkItem): string {
    const a = wi.properties['Assigned to'] ?? '';
    if (!a) return '';
    const parts = a.split(/[@.\s]+/);
    return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase();
  }

  taskDotClass(state: string): string {
    const s = state.toLowerCase();
    if (s === 'new') return 'dot-new';
    if (s === 'active') return 'dot-active';
    if (s === 'resolved') return 'dot-resolved';
    return 'dot-closed';
  }
}
