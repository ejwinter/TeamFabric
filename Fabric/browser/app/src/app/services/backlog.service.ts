import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay, Subject, switchMap, startWith } from 'rxjs';
import {
  BacklogTree, Stats, ItemDetail, GitResult, SearchResult, ArchiveSummary
} from '../models/backlog.models';

@Injectable({ providedIn: 'root' })
export class BacklogService {
  private http = inject(HttpClient);
  private refresh$ = new Subject<void>();

  private tree$: Observable<BacklogTree> = this.refresh$.pipe(
    startWith(null),
    switchMap(() => this.http.get<BacklogTree>('/api/backlog')),
    shareReplay(1),
  );

  getTree(): Observable<BacklogTree> { return this.tree$; }

  getStats(): Observable<Stats> {
    return this.http.get<Stats>('/api/stats');
  }

  getItem(path: string): Observable<ItemDetail> {
    return this.http.get<ItemDetail>('/api/item', { params: { path } });
  }

  saveItem(path: string, content: string): Observable<ItemDetail> {
    return this.http.put<ItemDetail>('/api/item', { path, content });
  }

  getArchive(): Observable<ArchiveSummary> {
    return this.http.get<ArchiveSummary>('/api/archive');
  }

  search(q: string, includeClosed = false): Observable<SearchResult[]> {
    return this.http.get<SearchResult[]>('/api/search', {
      params: { q, include_closed: includeClosed ? '1' : '0' },
    });
  }

  commit(message: string): Observable<GitResult> {
    return this.http.post<GitResult>('/api/git/commit', { message });
  }

  push(): Observable<GitResult> {
    return this.http.post<GitResult>('/api/git/push', {});
  }

  refreshTree(): void {
    this.refresh$.next();
  }
}
