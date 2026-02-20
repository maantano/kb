export type TaskStatus = 'TODO' | 'DONE';

export interface TaskItem {
  id: string;
  title: string;
  memo: string;
  status: TaskStatus;
}

export interface TaskDetail {
  id: string;
  title: string;
  memo: string;
  registerDatetime: string;
}
