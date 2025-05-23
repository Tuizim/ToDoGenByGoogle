
export enum Priority {
  Baixa = 'Baixa',
  Media = 'Média',
  Alta = 'Alta',
}

export interface ExerciseDetails {
  title: string;
  statement: string;
  isCompleted: boolean;
}

export interface Subtask {
  id: string;
  title: string;
  isCompleted: boolean;
  exercise?: ExerciseDetails;
  createdAt?: string; // Optional: for more precise sorting if needed later
}

export interface Task {
  id:string;
  title: string;
  description?: string;
  priority: Priority;
  isCompleted: boolean;
  createdAt: string;
  subtasks: Subtask[];
  exercise?: ExerciseDetails;
}

export type Theme = 'light' | 'dark';

export type ViewMode = 'tasks' | 'exercises' | 'youtubePlayer';

export type TaskFilterOptionId = 'all' | 'pending' | 'completed';

// Interface para unificar a exibição de exercícios no ExerciseViewer
export interface DisplayedExercise {
  id: string; // ID único do exercício (pode ser task.id ou subtask.id)
  exercise: ExerciseDetails;
  originType: 'task' | 'subtask';
  taskId: string;
  taskTitle: string;
  subtaskId?: string;
  subtaskTitle?: string;
  createdAt: string; // Data de criação da tarefa ou subtarefa (para ordenação)
  isCompleted: boolean; // Estado de conclusão do exercício em si
  // Propriedades adicionais da tarefa ou subtarefa podem ser adicionadas se necessário para ações
  rawTask?: Task; // Opcional: para facilitar o acesso à tarefa original se for de uma tarefa
  rawSubtask?: Subtask; // Opcional: para facilitar o acesso à subtarefa original
}
