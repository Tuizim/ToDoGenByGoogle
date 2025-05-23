

import React from 'react';
import { DisplayedExercise, ExerciseDetails, Task } from '../types'; // Task might still be needed for onEditTaskRequest if it expects a full Task object
import AcademicCapIcon from './icons/AcademicCapIcon';
import EditIcon from './icons/EditIcon';
import TrashIcon from './icons/TrashIcon';
import CheckIcon from './icons/CheckIcon';
import Button from './Button';

interface FocusedExerciseCardProps {
  displayedExercise: DisplayedExercise;
  onUpdateTaskExercise: (taskId: string, exerciseUpdates: Partial<ExerciseDetails>) => void;
  onEditTaskRequest: (task: Task) => void; // Expects a Task object for editing task-related exercises
  onRemoveTaskExercise: (taskId: string) => void;
  
  onUpdateSubtaskExercise: (taskId: string, subtaskId: string, exerciseUpdates: Partial<ExerciseDetails>) => void;
  onEditSubtaskRequest: (taskId: string, subtaskId: string) => void;
  onRemoveSubtaskExercise: (taskId: string, subtaskId: string) => void;
  isSelected?: boolean;
}

const FocusedExerciseCard: React.FC<FocusedExerciseCardProps> = ({
  displayedExercise,
  onUpdateTaskExercise,
  onEditTaskRequest,
  onRemoveTaskExercise,
  onUpdateSubtaskExercise,
  onEditSubtaskRequest,
  onRemoveSubtaskExercise,
  isSelected,
}) => {
  const { exercise, originType, taskId, taskTitle, subtaskId, subtaskTitle, rawTask } = displayedExercise;

  const handleCheckboxChange = () => {
    const updates = { isCompleted: !exercise.isCompleted };
    if (originType === 'task') {
      onUpdateTaskExercise(taskId, updates);
    } else if (originType === 'subtask' && subtaskId) {
      onUpdateSubtaskExercise(taskId, subtaskId, updates);
    }
  };

  const handleEdit = () => {
    if (originType === 'task' && rawTask) {
      onEditTaskRequest(rawTask); 
    } else if (originType === 'subtask' && subtaskId) {
      onEditSubtaskRequest(taskId, subtaskId);
    }
  };

  const handleRemove = () => {
    if (originType === 'task') {
      onRemoveTaskExercise(taskId);
    } else if (originType === 'subtask' && subtaskId) {
      onRemoveSubtaskExercise(taskId, subtaskId);
    }
  };
  
  const originText = originType === 'task' 
    ? `Referente à Tarefa: ${taskTitle}`
    : `Referente à Subtarefa: ${subtaskTitle} (da Tarefa: ${taskTitle})`;

  return (
    <div 
      id={`exercise-card-${displayedExercise.id}`} 
      className={`bg-surface-light dark:bg-surface-dark p-5 sm:p-6 rounded-xl shadow-lg mb-6 transition-all duration-300 ease-in-out ${isSelected ? 'ring-2 ring-teal-500 shadow-xl' : 'hover:shadow-xl'}`}
      aria-labelledby={`exercise-title-${displayedExercise.id}`}
    >
      <p className="text-xs sm:text-sm text-text_secondary-light dark:text-text_secondary-dark mb-2">
        <span className="font-medium text-text_primary-light dark:text-text_primary-dark">{originText}</span>
      </p>
      
      <div className="flex items-start sm:items-center mb-3">
        <AcademicCapIcon className="w-6 h-6 sm:w-7 sm:h-7 text-secondary-light dark:text-secondary-dark mr-3 flex-shrink-0" />
        <h3 
            id={`exercise-title-${displayedExercise.id}`}
            className={`text-lg sm:text-xl font-bold text-text_primary-light dark:text-text_primary-dark break-words ${exercise.isCompleted ? 'line-through opacity-70' : ''}`}
        >
          {exercise.title}
        </h3>
      </div>
      
      <p className={`text-sm sm:text-base text-text_secondary-light dark:text-text_secondary-dark whitespace-pre-wrap mb-4 break-words ${exercise.isCompleted ? 'line-through opacity-70' : ''}`}>
        {exercise.statement}
      </p>
      
      <div className="border-t border-border_color-light dark:border-border_color-dark pt-4 mt-4 space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between">
        <div className="flex items-center">
          <button
            onClick={handleCheckboxChange}
            className={`w-5 h-5 sm:w-6 sm:h-6 border-2 rounded-md flex-shrink-0 flex items-center justify-center mr-2.5 transition-all duration-200 ease-in-out
                        ${exercise.isCompleted 
                          ? 'bg-secondary-DEFAULT border-secondary-DEFAULT text-white' 
                          : 'border-slate-400 dark:border-slate-500 hover:border-secondary-light dark:hover:border-secondary-dark'}`}
            aria-checked={exercise.isCompleted}
            aria-label={exercise.isCompleted ? 'Marcar exercício como pendente' : 'Marcar exercício como concluído'}
          >
            {exercise.isCompleted && <CheckIcon className="w-3 h-3 sm:w-4 sm:h-4" />}
          </button>
          <label 
            htmlFor={`exercise-complete-${displayedExercise.id}`} 
            className={`text-sm font-medium cursor-pointer ${exercise.isCompleted ? 'text-text_secondary-light dark:text-text_secondary-dark opacity-70' : 'text-text_primary-light dark:text-text_primary-dark'}`}
            onClick={handleCheckboxChange}
          >
            {exercise.isCompleted ? 'Exercício Concluído' : 'Marcar como Concluído'}
          </label>
        </div>
        
        <div className="flex space-x-2 pt-2 sm:pt-0">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleEdit} 
            className="flex items-center"
            aria-label={`Editar ${originType === 'task' ? 'tarefa' : 'subtarefa'} e exercício ${exercise.title}`}
          >
            <EditIcon className="w-4 h-4 mr-1.5" />
            Editar
          </Button>
          {!exercise.isCompleted && ( // Usually, completed items are not removed directly, but uncompleted first
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleRemove} 
              className="flex items-center text-danger-light dark:text-danger-dark hover:bg-red-50 dark:hover:bg-red-900/30"
              aria-label={`Remover exercício ${exercise.title} de ${originType === 'task' ? 'tarefa' : 'subtarefa'}`}
            >
              <TrashIcon className="w-4 h-4 mr-1.5" />
              Remover
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FocusedExerciseCard;