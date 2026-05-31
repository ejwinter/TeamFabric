import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-state-badge',
  imports: [CommonModule],
  template: `<span class="badge" [class]="cssClass()">{{ state() }}</span>`,
  styles: [`
    .badge {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 10px;
      font-size: 11px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.03em;
      white-space: nowrap;
    }
    .state-new      { background: var(--state-new-bg);      color: var(--state-new-fg); }
    .state-active   { background: var(--state-active-bg);   color: var(--state-active-fg); }
    .state-resolved { background: var(--state-resolved-bg); color: var(--state-resolved-fg); }
    .state-closed   { background: var(--state-closed-bg);   color: var(--state-closed-fg); }
    .state-removed  { background: var(--state-removed-bg);  color: var(--state-removed-fg); }
    .state-default  { background: var(--state-default-bg);  color: var(--state-default-fg); }
  `],
})
export class StateBadge {
  state = input.required<string>();

  cssClass() {
    const s = this.state().toLowerCase();
    if (s === 'new') return 'badge state-new';
    if (s === 'active') return 'badge state-active';
    if (s === 'resolved') return 'badge state-resolved';
    if (s === 'closed') return 'badge state-closed';
    if (s === 'removed') return 'badge state-removed';
    return 'badge state-default';
  }
}
