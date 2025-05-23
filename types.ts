
export enum Priority {
  Baixa = 'Baixa',
  Media = 'Média',
  Alta = 'Alta',
}

export interface Subtask {
  id: string;
  title: string;
  isCompleted: boolean;
}

export interface ExerciseDetails {
  title: string;
  statement: string;
  isCompleted: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  isCompleted: boolean;
  createdAt: string;
  subtasks: Subtask[];
  exercise?: ExerciseDetails; // Optional linked exercise
}

export type Theme = 'light' | 'dark';

export type ViewMode = 'tasks' | 'exercises' | 'youtubePlayer'; // Added for app view state

// Defines the possible values for task filtering
export type TaskFilterOptionId = 'all' | 'pending' | 'completed';
