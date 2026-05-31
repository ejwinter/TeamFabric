import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { toSignal } from '@angular/core/rxjs-interop';
import { BacklogService } from '../../services/backlog.service';
import { FilterService } from '../../services/filter.service';
import { StateBadge } from '../state-badge/state-badge';
import {
  BacklogTree, Epic, Feature, WorkItem, Request, ListRow
} from '../../models/backlog.models';

const TYPE_ICONS: Record<string, string> = {
  Story: 'bookmark', Bug: 'bug_report', Request: 'inbox', Support: 'support',
};
const PRIORITY_COLORS = ['', '#6b7280', '#3b82f6', '#f59e0b', '#ef4444', '#7c3aed'];

@Component({
  selector: 'app-item-list',
  imports: [
    CommonModule, MatButtonModule, MatChipsModule, MatIconModule,
    MatProgressSpinnerModule, MatTooltipModule, MatDividerModule, StateBadge,
  ],
  templateUrl: './item-list.html',
  styleUrl: './item-list.scss',
})
export class ItemList {
  private svc = inject(BacklogService);
  filter = inject(FilterService);

  protected tree = toSignal(this.svc.getTree());

  /* Active filter chips */
  activeStates = signal<Set<string>>(new Set());
  activeTypes = signal<Set<string>>(new Set());

  /* Derive the flat row list from tree + filter state */
  rows = computed<ListRow[]>(() => {
    const t = this.tree();
    if (!t) return [];

    const showClosed = this.filter.showClosed();
    const epicId = this.filter.selectedEpicId();
    const showReqs = this.filter.showRequests();
    const stateFilter = this.activeStates();
    const typeFilter = this.activeTypes();

    if (showReqs) {
      return t.requests
        .filter(r => (showClosed || !this.filter.isClosed(r.state))
                  && (stateFilter.size === 0 || stateFilter.has(r.state)))
        .map(r => ({ type: 'request' as const, item: r }));
    }

    const epicsToShow = epicId
      ? t.epics.filter(e => e.id === epicId)
      : t.epics;

    const result: ListRow[] = [];
    for (const epic of epicsToShow) {
      result.push({ type: 'epic-header', epic });
      for (const feat of epic.features) {
        const visibleItems = feat.workitems.filter(wi => {
          if (!showClosed && this.filter.isClosed(wi.state)) return false;
          if (stateFilter.size > 0 && !stateFilter.has(wi.state)) return false;
          if (typeFilter.size > 0 && !typeFilter.has(wi.properties['Type'] ?? '')) return false;
          return true;
        });
        if (visibleItems.length === 0 && !epicId) continue;
        result.push({ type: 'feature-header', feature: feat, epicId: epic.id });
        for (const wi of visibleItems) {
          result.push({
            type: 'work-item', item: wi, epicId: epic.id,
            featureId: feat.id, epicTitle: epic.title, featureTitle: feat.title,
          });
        }
      }
    }
    return result;
  });

  stats = computed(() => {
    const t = this.tree();
    if (!t) return null;
    const rows = this.rows();
    const items = rows.filter(r => r.type === 'work-item' || r.type === 'request');
    return {
      epics: t.epics.length,
      features: t.epics.reduce((a, e) => a + e.features.length, 0),
      items: items.length,
    };
  });

  allStates = computed<string[]>(() => {
    const t = this.tree();
    if (!t) return [];
    const states = new Set<string>();
    const walk = (items: { state: string }[]) => items.forEach(i => states.add(i.state));
    t.epics.forEach(e => {
      e.features.forEach(f => {
        walk(f.workitems);
      });
    });
    walk(t.requests);
    return [...states].sort();
  });

  allTypes = computed<string[]>(() => {
    const t = this.tree();
    if (!t) return [];
    const types = new Set<string>();
    t.epics.forEach(e => e.features.forEach(f =>
      f.workitems.forEach(wi => { if (wi.properties['Type']) types.add(wi.properties['Type']); })
    ));
    return [...types].sort();
  });

  toggleState(state: string): void {
    this.activeStates.update(s => {
      const copy = new Set(s);
      copy.has(state) ? copy.delete(state) : copy.add(state);
      return copy;
    });
  }

  toggleType(type: string): void {
    this.activeTypes.update(s => {
      const copy = new Set(s);
      copy.has(type) ? copy.delete(type) : copy.add(type);
      return copy;
    });
  }

  typeIcon(wi: WorkItem): string {
    return TYPE_ICONS[wi.properties['Type'] ?? ''] ?? 'radio_button_unchecked';
  }

  priorityColor(wi: WorkItem): string {
    const p = parseInt(wi.properties['Priority'] ?? '0', 10);
    return PRIORITY_COLORS[p] ?? '';
  }

  assigneeInitials(wi: WorkItem): string {
    const a = wi.properties['Assigned to'] ?? '';
    if (!a) return '';
    const parts = a.split(/[@.\s]/);
    return (parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '');
  }

  openItem(row: ListRow): void {
    if (row.type === 'work-item') this.filter.openDetail(row.item);
    if (row.type === 'request') this.filter.openDetail(row.item);
    if (row.type === 'epic-header') this.filter.openDetail(row.epic);
    if (row.type === 'feature-header') this.filter.openDetail(row.feature);
  }

  isSelected(row: ListRow): boolean {
    const open = this.filter.openItem();
    if (!open) return false;
    if (row.type === 'work-item') return open.path === row.item.path;
    if (row.type === 'request') return open.path === row.item.path;
    if (row.type === 'epic-header') return open.path === row.epic.path;
    if (row.type === 'feature-header') return open.path === row.feature.path;
    return false;
  }

  isEpicHeader(row: ListRow): row is { type: 'epic-header'; epic: Epic } {
    return row.type === 'epic-header';
  }
  isFeatureHeader(row: ListRow): row is { type: 'feature-header'; feature: Feature; epicId: string } {
    return row.type === 'feature-header';
  }
  isWorkItem(row: ListRow): row is { type: 'work-item'; item: WorkItem; epicId: string; featureId: string; epicTitle: string; featureTitle: string } {
    return row.type === 'work-item';
  }
  isRequest(row: ListRow): row is { type: 'request'; item: Request } {
    return row.type === 'request';
  }
}
