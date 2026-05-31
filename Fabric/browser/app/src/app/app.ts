import { Component, inject, ViewChild, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
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
    MatSidenavModule, MatToolbarModule, MatButtonModule,
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

  @ViewChild('detailDrawer') detailDrawer!: MatSidenav;

  searchQuery = '';

  constructor() {
    // Open/close the detail drawer based on filter state
    effect(() => {
      const item = this.filter.openItem();
      if (this.detailDrawer) {
        item ? this.detailDrawer.open() : this.detailDrawer.close();
      }
    });
  }

  onDrawerClosed(): void {
    this.filter.closeDetail();
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
