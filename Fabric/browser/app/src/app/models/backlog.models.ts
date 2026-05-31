export interface Dates {
  start: string;
  target: string;
}

export interface BacklogEntity {
  id: string;
  kind: 'epic' | 'feature' | 'workitem' | 'task' | 'request';
  title: string;
  state: string;
  path: string;
  properties: Record<string, string>;
  desc: string;
  dates: Dates;
  snippet?: string;
}

export interface Task extends BacklogEntity {
  kind: 'task';
}

export interface WorkItem extends BacklogEntity {
  kind: 'workitem';
  tasks: Task[];
}

export interface Feature extends BacklogEntity {
  kind: 'feature';
  workitems: WorkItem[];
}

export interface Epic extends BacklogEntity {
  kind: 'epic';
  features: Feature[];
}

export interface Request extends BacklogEntity {
  kind: 'request';
}

export interface BacklogTree {
  generated_at: string;
  epics: Epic[];
  requests: Request[];
}

export interface Stats {
  epics: number;
  features: number;
  workitems: number;
  tasks: number;
  requests: number;
  by_state: Record<string, number>;
}

export interface ItemDetail extends BacklogEntity {
  html: string;
  raw: string;
  tasks?: Task[];
  workitems?: WorkItem[];
  features?: Feature[];
}

export interface GitResult {
  ok: boolean;
  output: string;
  error?: string;
}

export type SearchResult = BacklogEntity & { snippet: string };

/** Flat row types used by ItemListComponent */
export type ListRow =
  | { type: 'epic-header'; epic: Epic }
  | { type: 'feature-header'; feature: Feature; epicId: string }
  | { type: 'work-item'; item: WorkItem; epicId: string; featureId: string; epicTitle: string; featureTitle: string }
  | { type: 'request'; item: Request };
