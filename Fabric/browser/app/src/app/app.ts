import { Component, inject, signal, computed, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { EpicNav } from './components/epic-nav/epic-nav';
import { ItemDetailPanel } from './components/item-detail-panel/item-detail-panel';
import { GitActions } from './components/git-actions/git-actions';
import { FilterService } from './services/filter.service';
import { BacklogService } from './services/backlog.service';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule, RouterOutlet, FormsModule,
    MatToolbarModule, MatButtonModule,
    MatIconModule, MatInputModule, MatFormFieldModule,
    MatTooltipModule, MatSnackBarModule,
    EpicNav, ItemDetailPanel, GitActions,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private router = inject(Router);
  filter = inject(FilterService);
  private svc = inject(BacklogService);

  leftOpen = signal(true);
  leftWidth = signal(Math.round(window.innerWidth * 0.25));
  rightWidth = signal(Math.round(window.innerWidth * 0.25));
  detailOpen = computed(() => !!this.filter.openItem());
  isResizing = signal(false);

  private _resizeSide: 'left' | 'right' | null = null;
  private _resizeStartX = 0;
  private _resizeStartWidth = 0;

  searchQuery = '';

  startResize(event: MouseEvent, side: 'left' | 'right'): void {
    this._resizeSide = side;
    this._resizeStartX = event.clientX;
    this._resizeStartWidth = side === 'left' ? this.leftWidth() : this.rightWidth();
    this.isResizing.set(true);
    event.preventDefault();
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (!this._resizeSide) return;
    const delta = event.clientX - this._resizeStartX;
    if (this._resizeSide === 'left') {
      this.leftWidth.set(Math.max(140, Math.min(600, this._resizeStartWidth + delta)));
    } else {
      this.rightWidth.set(Math.max(240, Math.min(800, this._resizeStartWidth - delta)));
    }
  }

  @HostListener('document:mouseup')
  onMouseUp(): void {
    if (this._resizeSide) {
      this._resizeSide = null;
      this.isResizing.set(false);
    }
  }

  toggleClosed(): void {
    this.filter.showClosed.update(v => !v);
  }

  doSearch(event: Event): void {
    event.preventDefault();
    const q = this.searchQuery.trim();
    if (!q) { this.router.navigate(['/']); return; }
    this.router.navigate(['/search'], { queryParams: { q } });
  }

  refresh(): void {
    this.svc.refreshTree();
  }
}
