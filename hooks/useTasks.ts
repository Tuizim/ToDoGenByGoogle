
import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { Task, Subtask, Priority, ExerciseDetails }  from '../types';
import { LOCAL_STORAGE_KEYS } from '../constants';

export interface UseTasksReturn {
  tasks: Task[];
  addTask: (
    title: string, 
    description?: string, 
    priority?: Priority, 
    exerciseData?: { title: string; statement: string }
  ) => void;
  editTask: (id: string, updates: Partial<Omit<Task, 'id' | 'subtasks' | 'createdAt' | 'exercise'>> & { exercise?: ExerciseDetails | null }) => void;
  deleteTask: (id: string) => void;
  toggleTaskComplete: (id: string) => void;
  addSubtask: (taskId: string, subtaskTitle: string) => void;
  editSubtask: (taskId: string, subtaskId: string, newTitle: string) => void;
  deleteSubtask: (taskId: string, subtaskId: string) => void;
  toggleSubtaskComplete: (taskId: string, subtaskId: string) => void;
  updateExercise: (taskId: string, exerciseUpdates: Partial<ExerciseDetails>) => void;
  removeExerciseFromTask: (taskId: string) => void;
}

const initialTasks: Task[] = [
  {
    id: crypto.randomUUID(),
    title: 'Comprar pão na padaria',
    description: 'Pão francês e integral.',
    priority: Priority.Media,
    isCompleted: false,
    createdAt: new Date().toISOString(),
    subtasks: [],
  },
  {
    id: crypto.randomUUID(),
    title: 'Resolver problema de física',
    description: 'Capítulo 3, problema 5.',
    priority: Priority.Alta,
    isCompleted: false,
    createdAt: new Date().toISOString(),
    subtasks: [],
    exercise: {
      title: 'Problema da Rampa',
      statement: 'Um bloco de massa M desliza por uma rampa inclinada de um ângulo θ. Calcule a aceleração do bloco, desconsiderando o atrito.',
      isCompleted: false,
    }
  },
  {
    id: crypto.randomUUID(),
    title: 'Estudar React e Tailwind CSS',
    description: 'Revisar hooks e utilitários do Tailwind.',
    priority: Priority.Alta,
    isCompleted: false,
    createdAt: new Date().toISOString(),
    subtasks: [
      { id: crypto.randomUUID(), title: 'Ler documentação oficial do React', isCompleted: false },
      { id: crypto.randomUUID(), title: 'Praticar com um projeto pequeno', isCompleted: false },
    ],
  },
   {
    id: crypto.randomUUID(),
    title: 'Pagar conta de luz',
    priority: Priority.Alta,
    isCompleted: true,
    createdAt: new Date().toISOString(),
    subtasks: [],
  }
];


export const useTasks = (): UseTasksReturn => {
  const [tasks, setTasks] = useLocalStorage<Task[]>(LOCAL_STORAGE_KEYS.TASKS, initialTasks);

  const addTask = useCallback((
    title: string, 
    description?: string, 
    priority: Priority = Priority.Media,
    exerciseData?: { title: string; statement: string }
  ) => {
    if (!title.trim()) return;
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      description,
      priority,
      isCompleted: false,
      createdAt: new Date().toISOString(),
      subtasks: [],
    };
    if (exerciseData && exerciseData.title.trim() && exerciseData.statement.trim()) {
      newTask.exercise = {
        ...exerciseData,
        isCompleted: false,
      };
    }
    setTasks(prevTasks => [newTask, ...prevTasks]);
  }, [setTasks]);

  const editTask = useCallback((id: string, updates: Partial<Omit<Task, 'id' | 'subtasks' | 'createdAt' | 'exercise'>> & { exercise?: ExerciseDetails | null }) => {
    setTasks(prevTasks =>
      prevTasks.map(task => {
        if (task.id === id) {
          const { exercise, ...otherUpdates } = updates;
          let updatedExercise = task.exercise;

          if (exercise === null) { // Explicitly removing exercise
            updatedExercise = undefined;
          } else if (exercise) { // Updating or adding exercise
            updatedExercise = { ...(task.exercise || { title: '', statement: '', isCompleted: false }), ...exercise };
          }
          
          const updatedTask = { ...task, ...otherUpdates, exercise: updatedExercise };

          // Sync task completion with exercise completion if exercise exists
          if (updatedTask.exercise) {
            if (typeof updates.isCompleted === 'boolean') {
                updatedTask.exercise.isCompleted = updates.isCompleted;
            } else if (typeof exercise?.isCompleted === 'boolean') {
                 updatedTask.isCompleted = exercise.isCompleted;
            }
          }
           // If exercise is removed, task completion status remains as is unless explicitly set
          if (exercise === null && typeof updates.isCompleted !== 'boolean') {
            // Keep current task.isCompleted if not explicitly changed
          }


          return updatedTask;
        }
        return task;
      })
    );
  }, [setTasks]);

  const deleteTask = useCallback((id: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
  }, [setTasks]);

  const toggleTaskComplete = useCallback((id: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task => {
        if (task.id === id) {
          const newIsCompleted = !task.isCompleted;
          const updatedTask = { ...task, isCompleted: newIsCompleted };
          if (updatedTask.exercise) {
            updatedTask.exercise.isCompleted = newIsCompleted;
          }
          return updatedTask;
        }
        return task;
      })
    );
  }, [setTasks]);

  const updateExercise = useCallback((taskId: string, exerciseUpdates: Partial<ExerciseDetails>) => {
    setTasks(prevTasks => 
      prevTasks.map(task => {
        if (task.id === taskId && task.exercise) {
          const updatedExercise = { ...task.exercise, ...exerciseUpdates };
          const newIsCompleted = updatedExercise.isCompleted;
          return { 
            ...task, 
            exercise: updatedExercise,
            isCompleted: newIsCompleted // Sync task completion with exercise
          };
        }
        return task;
      })
    );
  }, [setTasks]);

  const removeExerciseFromTask = useCallback((taskId: string) => {
    setTasks(prevTasks => 
      prevTasks.map(task => {
        if (task.id === taskId) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { exercise, ...restOfTask } = task;
          return { ...restOfTask } as Task; // Cast to assure type, exercise is removed
        }
        return task;
      })
    );
  }, [setTasks]);


  const addSubtask = useCallback((taskId: string, subtaskTitle: string) => {
    if (!subtaskTitle.trim()) return;
    const newSubtask: Subtask = {
      id: crypto.randomUUID(),
      title: subtaskTitle,
      isCompleted: false,
    };
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId
          ? { ...task, subtasks: [...task.subtasks, newSubtask] }
          : task
      )
    );
  }, [setTasks]);

  const editSubtask = useCallback((taskId: string, subtaskId: string, newTitle: string) => {
    if (!newTitle.trim()) return;
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId
          ? {
              ...task,
              subtasks: task.subtasks.map(sub =>
                sub.id === subtaskId ? { ...sub, title: newTitle } : sub
              ),
            }
          : task
      )
    );
  }, [setTasks]);

  const deleteSubtask = useCallback((taskId: string, subtaskId: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId
          ? { ...task, subtasks: task.subtasks.filter(sub => sub.id !== subtaskId) }
          : task
      )
    );
  }, [setTasks]);

  const toggleSubtaskComplete = useCallback((taskId: string, subtaskId: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId
          ? {
              ...task,
              subtasks: task.subtasks.map(sub =>
                sub.id === subtaskId ? { ...sub, isCompleted: !sub.isCompleted } : sub
              ),
            }
          : task
      )
    );
  }, [setTasks]);

  return {
    tasks,
    addTask,
    editTask,
    deleteTask,
    toggleTaskComplete,
    addSubtask,
    editSubtask,
    deleteSubtask,
    toggleSubtaskComplete,
    updateExercise,
    removeExerciseFromTask,
  };
};
