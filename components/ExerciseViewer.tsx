import React, { useState, useMemo, useEffect } from 'react';
import { Task, ExerciseDetails } from '../types';
import FocusedExerciseCard from './FocusedExerciseCard';
import AcademicCapIcon from './icons/AcademicCapIcon'; // For empty state icon

interface ExerciseViewerProps {
  tasks: Task[];
  onUpdateExercise: (taskId: string, exerciseUpdates: Partial<ExerciseDetails>) => void;
  onEditTask: (task: Task) => void; // To open the main edit modal
  onRemoveExercise: (taskId: string) => void;
}

const ExerciseViewer: React.FC<ExerciseViewerProps> = ({ 
  tasks, 
  onUpdateExercise, 
  onEditTask,
  onRemoveExercise 
}) => {
  const exerciseTasks = useMemo(() => {
    return tasks
      .filter(task => !!task.exercise)
      .sort((a, b) => {
        // Sort by completion status (incomplete first), then by creation date (newest first)
        if (a.exercise!.isCompleted !== b.exercise!.isCompleted) {
          return a.exercise!.isCompleted ? 1 : -1;
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [tasks]);

  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [scrollTarget, setScrollTarget] = useState<string | null>(null);

  useEffect(() => {
    if (scrollTarget) {
      const element = document.getElementById(`exercise-card-${scrollTarget}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Highlight briefly (optional)
        element.classList.add('ring-2', 'ring-primary-DEFAULT', 'shadow-xl');
        setTimeout(() => {
          element.classList.remove('ring-2', 'ring-primary-DEFAULT', 'shadow-xl');
        }, 1500); // Keep highlight for 1.5 seconds
      }
      setScrollTarget(null); // Reset scroll target
    }
  }, [scrollTarget]);
  
  // If the selected exercise is removed or no longer an exercise, reset the dropdown
  useEffect(() => {
    if (selectedTaskId && !exerciseTasks.find(task => task.id === selectedTaskId)) {
        setSelectedTaskId(null);
    }
  }, [exerciseTasks, selectedTaskId]);


  if (exerciseTasks.length === 0) {
    return (
      <div className="text-center py-12">
        <AcademicCapIcon className="mx-auto h-24 w-24 text-slate-300 dark:text-slate-600" />
        <p className="mt-5 text-xl font-semibold text-text_primary-light dark:text-text_primary-dark">Nenhum exercício encontrado.</p>
        <p className="mt-1 text-text_secondary-light dark:text-text_secondary-dark">Crie tarefas com exercícios para vê-los aqui.</p>
      </div>
    );
  }

  const handleDropdownChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const taskId = event.target.value;
    setSelectedTaskId(taskId);
    if (taskId) {
      setScrollTarget(taskId);
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
          value={selectedTaskId || ""}
          onChange={handleDropdownChange}
          className="w-full max-w-md px-4 py-2.5 border border-border_color-light dark:border-border_color-dark rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-DEFAULT focus:border-primary-DEFAULT bg-surface-light dark:bg-surface-dark text-text_primary-light dark:text-text_primary-dark"
        >
          <option value="">-- Selecione um Exercício --</option>
          {exerciseTasks.map(task => (
            <option key={task.id} value={task.id}>
              {task.exercise!.title} (Tarefa: {task.title})
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-5 sm:space-y-6">
        {exerciseTasks.map(task => (
          <FocusedExerciseCard
            key={task.id}
            task={task}
            onUpdateExercise={onUpdateExercise}
            onEditTask={onEditTask}
            onRemoveExercise={onRemoveExercise}
            isSelected={task.id === selectedTaskId}
          />
        ))}
      </div>
    </div>
  );
};

export default ExerciseViewer;
