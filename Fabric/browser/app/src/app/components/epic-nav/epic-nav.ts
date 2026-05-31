import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { BacklogService } from '../../services/backlog.service';
import { FilterService } from '../../services/filter.service';
import { StateBadge } from '../state-badge/state-badge';
import { Epic } from '../../models/backlog.models';

@Component({
  selector: 'app-epic-nav',
  imports: [CommonModule, RouterLink, RouterLinkActive, MatListModule, MatIconModule,
            MatDividerModule, MatProgressSpinnerModule, StateBadge],
  template: `
    @if (tree(); as t) {
      <mat-nav-list dense>
        <!-- All -->
        <mat-list-item class="nav-item" [class.active]="!filter.showRequests() && !filter.selectedEpicId()"
                       (click)="filter.selectAll()">
          <mat-icon matListItemIcon>view_list</mat-icon>
          <span matListItemTitle>All</span>
        </mat-list-item>

        <!-- Requests -->
        @if (t.requests.length > 0) {
          <mat-list-item class="nav-item" [class.active]="filter.showRequests()"
                         (click)="filter.selectRequests()">
            <mat-icon matListItemIcon>inbox</mat-icon>
            <span matListItemTitle>Requests</span>
            <span matListItemMeta class="count">{{ t.requests.length }}</span>
          </mat-list-item>
        }

        <mat-divider />

        <div class="section-label">Epics</div>

        <!-- Epics -->
        @for (epic of t.epics; track epic.id) {
          <mat-list-item class="nav-item epic-item"
                         [class.active]="filter.selectedEpicId() === epic.id"
                         [class.closed]="filter.isClosed(epic.state)"
                         (click)="filter.selectEpic(epic.id)">
            <span class="epic-dot" [style.background]="epicColor(epic)" matListItemIcon></span>
            <span matListItemTitle class="epic-title">{{ epic.title }}</span>
            <app-state-badge [state]="epic.state" matListItemMeta />
          </mat-list-item>
        }

        @if (archiveTotal() > 0) {
          <mat-divider />
          <mat-list-item class="nav-item archive-item" routerLink="/archive" routerLinkActive="active"
                         (click)="filter.selectAll()">
            <mat-icon matListItemIcon>inventory_2</mat-icon>
            <span matListItemTitle>Archived</span>
            <span matListItemMeta class="count">{{ archiveTotal() }}</span>
          </mat-list-item>
        }
      </mat-nav-list>
    } @else {
      <div class="loading"><mat-spinner diameter="24" /></div>
    }
  `,
  styles: [`
    :host { display: block; padding: 8px 0; }
    .nav-item {
      border-radius: 6px;
      margin: 1px 6px;
      cursor: pointer;
      transition: background 0.1s;
      --mdc-list-list-item-container-color: transparent;
    }
    .nav-item:hover { background: var(--hover-bg); }
    .nav-item.active {
      background: var(--active-bg);
      border-left: 3px solid var(--accent);
    }
    .nav-item.closed { opacity: 0.5; }
    .epic-dot {
      display: inline-block;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      flex-shrink: 0;
    }
    .epic-title { font-size: 13px; font-weight: 400; }
    .section-label {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--muted);
      padding: 12px 16px 4px;
      font-weight: 500;
    }
    .count {
      font-size: 11px;
      color: var(--muted);
      background: var(--hover-bg);
      border-radius: 8px;
      padding: 1px 6px;
    }
    .archive-item { opacity: 0.7; }
    .archive-item:hover { opacity: 1; }
    .loading { display: flex; justify-content: center; padding: 24px; }
    mat-nav-list { padding: 0; }
  `],
})
export class EpicNav {
  private svc = inject(BacklogService);
  filter = inject(FilterService);

  tree = toSignal(this.svc.getTree());
  archiveTotal = toSignal(this.svc.getArchive().pipe(map(a => a.total)), { initialValue: 0 });

  private readonly EPIC_COLORS = [
    '#5e6ad2', '#26b5ce', '#4cb782', '#f2994a',
    '#eb5757', '#9b51e0', '#f2c94c', '#2d9cdb',
  ];

  epicColor(epic: Epic): string {
    const idx = Math.abs(
      epic.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
    ) % this.EPIC_COLORS.length;
    return this.EPIC_COLORS[idx];
  }
}
