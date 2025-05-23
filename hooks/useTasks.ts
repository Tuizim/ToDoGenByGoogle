
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
  editSubtask: (taskId: string, subtaskId: string, updates: { title: string; exercise?: ExerciseDetails | null }) => void;
  deleteSubtask: (taskId: string, subtaskId: string) => void;
  toggleSubtaskComplete: (taskId: string, subtaskId: string) => void;
  updateExercise: (taskId: string, exerciseUpdates: Partial<ExerciseDetails>) => void;
  removeExerciseFromTask: (taskId: string) => void;
  updateSubtaskExercise: (taskId: string, subtaskId: string, exerciseUpdates: Partial<ExerciseDetails>) => void;
  removeExerciseFromSubtask: (taskId: string, subtaskId: string) => void;
}

const initialTasks: Task[] = [];


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

          if (exercise === null) { 
            updatedExercise = undefined;
          } else if (exercise) { 
            updatedExercise = { ...(task.exercise || { title: '', statement: '', isCompleted: false }), ...exercise };
          }
          
          let finalIsCompleted = typeof updates.isCompleted === 'boolean' ? updates.isCompleted : task.isCompleted;

          if (updatedExercise) {
            if (typeof exercise?.isCompleted === 'boolean') { // If exercise completion is explicitly set
              finalIsCompleted = exercise.isCompleted;
              updatedExercise.isCompleted = exercise.isCompleted;
            } else { // Sync exercise with task completion if task's isCompleted changed
               updatedExercise.isCompleted = finalIsCompleted;
            }
          } else if (exercise === null) {
            // If exercise removed, task completion doesn't automatically change unless explicitly passed in updates
             finalIsCompleted = typeof updates.isCompleted === 'boolean' ? updates.isCompleted : task.isCompleted;
          }
          
          return { ...task, ...otherUpdates, exercise: updatedExercise, isCompleted: finalIsCompleted };
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
          const newIsCompleted = typeof exerciseUpdates.isCompleted === 'boolean' ? exerciseUpdates.isCompleted : task.isCompleted;
          return { 
            ...task, 
            exercise: updatedExercise,
            isCompleted: newIsCompleted 
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
          return { ...restOfTask } as Task; 
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
      createdAt: new Date().toISOString(),
    };
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId
          ? { ...task, subtasks: [...task.subtasks, newSubtask] }
          : task
      )
    );
  }, [setTasks]);

  const editSubtask = useCallback((taskId: string, subtaskId: string, updates: { title: string; exercise?: ExerciseDetails | null }) => {
    if (!updates.title.trim()) return; 
    
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId
          ? {
              ...task,
              subtasks: task.subtasks.map(sub => {
                if (sub.id === subtaskId) {
                  let updatedExercise = sub.exercise;
                  let subtaskIsCompleted = sub.isCompleted;

                  if (updates.exercise === null) { 
                    updatedExercise = undefined;
                    // Subtask completion not affected by exercise removal unless exercise was only reason for completion.
                    // This logic can be complex. For now, keep sub.isCompleted unless exercise was sole driver.
                  } else if (updates.exercise) { 
                    updatedExercise = { 
                      ...(sub.exercise || { title: '', statement: '', isCompleted: false }), 
                      ...updates.exercise 
                    };
                    // Sync subtask completion with exercise completion if exercise exists and its completion is defined
                    if (typeof updates.exercise.isCompleted === 'boolean') {
                       subtaskIsCompleted = updates.exercise.isCompleted;
                       updatedExercise.isCompleted = subtaskIsCompleted;
                    } else {
                       updatedExercise.isCompleted = subtaskIsCompleted; // Sync from subtask if not explicitly set on exercise
                    }
                  }
                  
                  return { 
                    ...sub, 
                    title: updates.title,
                    exercise: updatedExercise,
                    isCompleted: subtaskIsCompleted,
                  };
                }
                return sub;
              }),
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
              subtasks: task.subtasks.map(sub => {
                if (sub.id === subtaskId) {
                  const newIsCompleted = !sub.isCompleted;
                  const updatedSubtask = { ...sub, isCompleted: newIsCompleted };
                  if (updatedSubtask.exercise) {
                    updatedSubtask.exercise.isCompleted = newIsCompleted;
                  }
                  return updatedSubtask;
                }
                return sub;
              }),
            }
          : task
      )
    );
  }, [setTasks]);

  const updateSubtaskExercise = useCallback((taskId: string, subtaskId: string, exerciseUpdates: Partial<ExerciseDetails>) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId
          ? {
              ...task,
              subtasks: task.subtasks.map(sub => {
                if (sub.id === subtaskId && sub.exercise) {
                  const updatedExercise = { ...sub.exercise, ...exerciseUpdates };
                  const newSubtaskCompleted = typeof exerciseUpdates.isCompleted === 'boolean' ? exerciseUpdates.isCompleted : sub.isCompleted;
                  return {
                    ...sub,
                    exercise: updatedExercise,
                    isCompleted: newSubtaskCompleted, // Sync subtask completion
                  };
                }
                return sub;
              }),
            }
          : task
      )
    );
  }, [setTasks]);

  const removeExerciseFromSubtask = useCallback((taskId: string, subtaskId: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId
          ? {
              ...task,
              subtasks: task.subtasks.map(sub => {
                if (sub.id === subtaskId) {
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  const { exercise, ...restOfSubtask } = sub;
                  return restOfSubtask as Subtask; // Cast, exercise is removed
                }
                return sub;
              }),
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
    updateSubtaskExercise,
    removeExerciseFromSubtask,
  };
};
