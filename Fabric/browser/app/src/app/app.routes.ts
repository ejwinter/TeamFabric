import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/item-list/item-list').then(m => m.ItemList),
  },
  {
    path: 'search',
    loadComponent: () =>
      import('./components/search-view/search-view').then(m => m.SearchView),
  },
  {
    path: 'sprint',
    loadComponent: () =>
      import('./components/sprint-board/sprint-board').then(m => m.SprintBoard),
  },
  {
    path: 'archive',
    loadComponent: () =>
      import('./components/archive-view/archive-view').then(m => m.ArchiveView),
  },
  { path: '**', redirectTo: '' },
];
