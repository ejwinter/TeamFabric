import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { toSignal } from '@angular/core/rxjs-interop';
import { BacklogService } from '../../services/backlog.service';
import { ArchivedItem } from '../../models/backlog.models';

@Component({
  selector: 'app-archive-view',
  imports: [CommonModule, MatListModule, MatIconModule, MatDividerModule,
            MatProgressSpinnerModule, MatChipsModule],
  template: `
    @if (archive(); as a) {
      <div class="archive-header">
        <mat-icon class="archive-icon">inventory_2</mat-icon>
        <div>
          <h2 class="archive-title">Archive</h2>
          <p class="archive-subtitle">{{ a.total }} item{{ a.total !== 1 ? 's' : '' }} — read only</p>
        </div>
      </div>

      @if (a.total === 0) {
        <div class="empty">No archived items yet.</div>
      }

      @if (a.epics.length > 0) {
        <div class="section-label">Epics ({{ a.epics.length }})</div>
        <mat-list>
          @for (item of a.epics; track item.id) {
            <mat-list-item class="archive-item">
              <mat-icon matListItemIcon class="archive-item-icon">archive</mat-icon>
              <span matListItemTitle class="item-title">{{ item.title }}</span>
              <span matListItemLine class="item-meta">
                <span class="state-chip">{{ item.state }}</span>
                @if (item.terminated) {
                  <span class="terminated">Archived {{ item.terminated }}</span>
                }
              </span>
              @if (item.desc) {
                <span matListItemLine class="item-desc">{{ item.desc }}</span>
              }
            </mat-list-item>
          }
        </mat-list>
      }

      @if (a.epics.length > 0 && a.requests.length > 0) {
        <mat-divider />
      }

      @if (a.requests.length > 0) {
        <div class="section-label">Requests ({{ a.requests.length }})</div>
        <mat-list>
          @for (item of a.requests; track item.id) {
            <mat-list-item class="archive-item">
              <mat-icon matListItemIcon class="archive-item-icon">archive</mat-icon>
              <span matListItemTitle class="item-title">{{ item.id }}: {{ item.title }}</span>
              <span matListItemLine class="item-meta">
                <span class="state-chip">{{ item.state }}</span>
                @if (item.terminated) {
                  <span class="terminated">Archived {{ item.terminated }}</span>
                }
              </span>
              @if (item.desc) {
                <span matListItemLine class="item-desc">{{ item.desc }}</span>
              }
            </mat-list-item>
          }
        </mat-list>
      }
    } @else {
      <div class="loading"><mat-spinner diameter="32" /></div>
    }
  `,
  styles: [`
    :host { display: block; padding: 16px; max-width: 800px; }
    .archive-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 1px solid var(--mat-divider-color, #e0e0e0);
    }
    .archive-icon { font-size: 32px; width: 32px; height: 32px; color: var(--muted); }
    .archive-title { margin: 0; font-size: 20px; font-weight: 500; }
    .archive-subtitle { margin: 2px 0 0; font-size: 13px; color: var(--muted); }
    .section-label {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--muted);
      padding: 12px 16px 4px;
      font-weight: 500;
    }
    .archive-item { opacity: 0.8; }
    .archive-item-icon { color: var(--muted); font-size: 18px; }
    .item-title { font-size: 14px; }
    .item-meta { display: flex; align-items: center; gap: 8px; margin-top: 2px; }
    .state-chip {
      font-size: 11px;
      background: var(--hover-bg);
      color: var(--muted);
      border-radius: 4px;
      padding: 1px 6px;
      text-transform: capitalize;
    }
    .terminated { font-size: 11px; color: var(--muted); }
    .item-desc { font-size: 12px; color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .empty { padding: 32px 16px; color: var(--muted); text-align: center; }
    .loading { display: flex; justify-content: center; padding: 48px; }
  `],
})
export class ArchiveView {
  private svc = inject(BacklogService);
  archive = toSignal(this.svc.getArchive());
}
