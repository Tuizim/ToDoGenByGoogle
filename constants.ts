
import { Priority, TaskFilterOptionId } from './types';

export const LOCAL_STORAGE_KEYS = {
  TASKS: 'tarefasSimples_tasks',
  THEME: 'tarefasSimples_theme',
};

export const PRIORITY_OPTIONS: Priority[] = [
  Priority.Baixa,
  Priority.Media,
  Priority.Alta,
];

export const PRIORITY_COLORS: Record<Priority, string> = {
  [Priority.Alta]: 'bg-red-500 dark:bg-red-400',
  [Priority.Media]: 'bg-yellow-500 dark:bg-yellow-400',
  [Priority.Baixa]: 'bg-green-500 dark:bg-green-400',
};

export const PRIORITY_TEXT_COLORS: Record<Priority, string> = {
  [Priority.Alta]: 'text-red-700 dark:text-red-300',
  [Priority.Media]: 'text-yellow-700 dark:text-yellow-300',
  [Priority.Baixa]: 'text-green-700 dark:text-green-300',
};

export const APP_TITLE = "ToDo";

export const TASK_FILTER_OPTIONS: { id: TaskFilterOptionId; label: string }[] = [
  { id: 'pending', label: 'Pendentes' },
  { id: 'completed', label: 'Concluídas' },
  { id: 'all', label: 'Todas' },
];