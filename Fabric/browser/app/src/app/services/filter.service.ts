import { Injectable, signal } from '@angular/core';
import { BacklogEntity } from '../models/backlog.models';

@Injectable({ providedIn: 'root' })
export class FilterService {
  showClosed = signal(false);
  selectedEpicId = signal<string | null>(null);
  showRequests = signal(false);
  openItem = signal<BacklogEntity | null>(null);

  private readonly CLOSED = new Set(['closed', 'removed']);

  isVisible(state: string): boolean {
    if (this.CLOSED.has(state.toLowerCase())) {
      return this.showClosed();
    }
    return true;
  }

  isClosed(state: string): boolean {
    return this.CLOSED.has(state.toLowerCase());
  }

  selectAll(): void {
    this.selectedEpicId.set(null);
    this.showRequests.set(false);
  }

  selectEpic(epicId: string): void {
    this.selectedEpicId.set(epicId);
    this.showRequests.set(false);
  }

  selectRequests(): void {
    this.showRequests.set(true);
    this.selectedEpicId.set(null);
  }

  openDetail(item: BacklogEntity): void {
    this.openItem.set(item);
  }

  closeDetail(): void {
    this.openItem.set(null);
  }
}
