import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BacklogService } from '../../services/backlog.service';

@Component({
  selector: 'app-git-actions',
  imports: [
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
  ],
  template: `
    <div class="git-bar">
      <mat-form-field appearance="outline" class="msg-field">
        <mat-label>Commit message</mat-label>
        <input matInput [(ngModel)]="commitMsg" placeholder="Describe your changes…"
               (keydown.enter)="doCommit()" [disabled]="busy()">
      </mat-form-field>
      <button mat-flat-button color="primary" (click)="doCommit()"
              [disabled]="!commitMsg.trim() || busy()"
              matTooltip="Commit staged backlog changes">
        <mat-icon>commit</mat-icon> Commit
      </button>
      <button mat-stroked-button (click)="doPush()"
              [disabled]="busy()"
              matTooltip="Push commits to remote">
        <mat-icon>upload</mat-icon> Push
      </button>
    </div>
  `,
  styles: [`
    .git-bar {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 0 16px;
      height: 100%;
    }
    .msg-field {
      flex: 1;
      font-size: 13px;
    }
    mat-form-field { --mdc-outlined-text-field-container-height: 40px; }
    button { white-space: nowrap; height: 40px; }
  `],
})
export class GitActions {
  private svc = inject(BacklogService);
  private snack = inject(MatSnackBar);

  commitMsg = '';
  busy = signal(false);

  doCommit(): void {
    const msg = this.commitMsg.trim();
    if (!msg || this.busy()) return;
    this.busy.set(true);
    this.svc.commit(msg).subscribe({
      next: r => {
        this.busy.set(false);
        if (r.ok) {
          this.commitMsg = '';
          this.snack.open(`✓ Committed: ${r.output}`, 'OK', { duration: 4000 });
        } else {
          this.snack.open(`Commit failed: ${r.output}`, 'Dismiss', { duration: 6000 });
        }
      },
      error: () => {
        this.busy.set(false);
        this.snack.open('Commit error — is git installed?', 'Dismiss', { duration: 6000 });
      },
    });
  }

  doPush(): void {
    if (this.busy()) return;
    this.busy.set(true);
    this.svc.push().subscribe({
      next: r => {
        this.busy.set(false);
        if (r.ok) {
          this.snack.open(`✓ Pushed successfully`, 'OK', { duration: 4000 });
        } else {
          this.snack.open(`Push failed: ${r.output}`, 'Dismiss', { duration: 6000 });
        }
      },
      error: () => {
        this.busy.set(false);
        this.snack.open('Push error — check your git remote and credentials', 'Dismiss', { duration: 6000 });
      },
    });
  }
}
