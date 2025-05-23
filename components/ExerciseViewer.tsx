
import React, { useState, useMemo, useEffect } from 'react';
import { Task, ExerciseDetails, DisplayedExercise, Subtask } from '../types';
import FocusedExerciseCard from './FocusedExerciseCard';
import AcademicCapIcon from './icons/AcademicCapIcon';

interface ExerciseViewerProps {
  tasks: Task[];
  onUpdateTaskExercise: (taskId: string, exerciseUpdates: Partial<ExerciseDetails>) => void;
  onEditTaskRequest: (task: Task) => void; 
  onRemoveTaskExercise: (taskId: string) => void;
  
  onUpdateSubtaskExercise: (taskId: string, subtaskId: string, exerciseUpdates: Partial<ExerciseDetails>) => void;
  onEditSubtaskExerciseRequest: (taskId: string, subtaskId: string) => void;
  onRemoveSubtaskExercise: (taskId: string, subtaskId: string) => void;
}

const ExerciseViewer: React.FC<ExerciseViewerProps> = ({ 
  tasks, 
  onUpdateTaskExercise, 
  onEditTaskRequest,
  onRemoveTaskExercise,
  onUpdateSubtaskExercise,
  onEditSubtaskExerciseRequest,
  onRemoveSubtaskExercise,
}) => {
  const processedExercises = useMemo(() => {
    const allExercises: DisplayedExercise[] = [];
    tasks.forEach(task => {
      if (task.exercise) {
        allExercises.push({
          id: task.id, // For task exercise, use task.id as the unique ID for the DisplayedExercise
          exercise: task.exercise,
          originType: 'task',
          taskId: task.id,
          taskTitle: task.title,
          createdAt: task.createdAt,
          isCompleted: task.exercise.isCompleted,
          rawTask: task,
        });
      }
      task.subtasks.forEach(subtask => {
        if (subtask.exercise) {
          allExercises.push({
            id: subtask.id, // For subtask exercise, use subtask.id
            exercise: subtask.exercise,
            originType: 'subtask',
            taskId: task.id,
            taskTitle: task.title,
            subtaskId: subtask.id,
            subtaskTitle: subtask.title,
            createdAt: subtask.createdAt || task.createdAt, // Use subtask createdAt if available, else task's
            isCompleted: subtask.exercise.isCompleted,
            rawSubtask: subtask,
          });
        }
      });
    });

    return allExercises.sort((a, b) => {
      if (a.isCompleted !== b.isCompleted) {
        return a.isCompleted ? 1 : -1;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [tasks]);

  const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(null);
  const [scrollTarget, setScrollTarget] = useState<string | null>(null);

  useEffect(() => {
    if (scrollTarget) {
      const element = document.getElementById(`exercise-card-${scrollTarget}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.classList.add('ring-2', 'ring-primary-DEFAULT', 'shadow-xl');
        setTimeout(() => {
          element.classList.remove('ring-2', 'ring-primary-DEFAULT', 'shadow-xl');
        }, 1500);
      }
      setScrollTarget(null);
    }
  }, [scrollTarget]);
  
  useEffect(() => {
    if (selectedExerciseId && !processedExercises.find(ex => ex.id === selectedExerciseId)) {
        setSelectedExerciseId(null);
    }
  }, [processedExercises, selectedExerciseId]);


  if (processedExercises.length === 0) {
    return (
      <div className="text-center py-12">
        <AcademicCapIcon className="mx-auto h-24 w-24 text-slate-300 dark:text-slate-600" />
        <p className="mt-5 text-xl font-semibold text-text_primary-light dark:text-text_primary-dark">Nenhum exercício encontrado.</p>
        <p className="mt-1 text-text_secondary-light dark:text-text_secondary-dark">Crie tarefas ou subtarefas com exercícios para vê-los aqui.</p>
      </div>
    );
  }

  const handleDropdownChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const exerciseId = event.target.value;
    setSelectedExerciseId(exerciseId);
    if (exerciseId) {
      setScrollTarget(exerciseId);
    }
  };

  return (
    <div className="py-8 sm:py-10">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-text_primary-light dark:text-text_primary-dark">
        Visualizador de Exercícios
      </h2>
      
      <div className="mb-8">
        <label htmlFor="exercise-navigator" className="block text-sm font-medium text-text_secondary-light dark:text-text_secondary-dark mb-1.5">
          Navegar para Exercício
        </label>
        <select
          id="exercise-navigator"
          value={selectedExerciseId || ""}
          onChange={handleDropdownChange}
          className="w-full max-w-md px-4 py-2.5 border border-border_color-light dark:border-border_color-dark rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-DEFAULT focus:border-primary-DEFAULT bg-surface-light dark:bg-surface-dark text-text_primary-light dark:text-text_primary-dark"
        >
          <option value="">-- Selecione um Exercício --</option>
          {processedExercises.map(displayedEx => (
            <option key={displayedEx.id} value={displayedEx.id}>
              {displayedEx.exercise.title} 
              {displayedEx.originType === 'task' ? ` (Tarefa: ${displayedEx.taskTitle})` : ` (Subtarefa: ${displayedEx.subtaskTitle} de ${displayedEx.taskTitle})`}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-5 sm:space-y-6">
        {processedExercises.map(displayedEx => (
          <FocusedExerciseCard
            key={displayedEx.id}
            displayedExercise={displayedEx}
            onUpdateTaskExercise={onUpdateTaskExercise}
            onEditTaskRequest={onEditTaskRequest}
            onRemoveTaskExercise={onRemoveTaskExercise}
            onUpdateSubtaskExercise={onUpdateSubtaskExercise}
            onEditSubtaskRequest={onEditSubtaskExerciseRequest}
            onRemoveSubtaskExercise={onRemoveSubtaskExercise}
            isSelected={displayedEx.id === selectedExerciseId}
          />
        ))}
      </div>
    </div>
  );
};

export default ExerciseViewer;
