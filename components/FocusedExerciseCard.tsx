import React from 'react';
import { Task, ExerciseDetails } from '../types';
import AcademicCapIcon from './icons/AcademicCapIcon';
import EditIcon from './icons/EditIcon';
import TrashIcon from './icons/TrashIcon';
import CheckIcon from './icons/CheckIcon';
import Button from './Button';

interface FocusedExerciseCardProps {
  task: Task; // Task guaranteed to have an exercise
  onUpdateExercise: (taskId: string, exerciseUpdates: Partial<ExerciseDetails>) => void;
  onEditTask: (task: Task) => void;
  onRemoveExercise: (taskId: string) => void;
  isSelected?: boolean; // Optional: for highlighting if selected via dropdown
}

const FocusedExerciseCard: React.FC<FocusedExerciseCardProps> = ({
  task,
  onUpdateExercise,
  onEditTask,
  onRemoveExercise,
  isSelected,
}) => {
  const exercise = task.exercise!; // Assert exercise exists

  const handleCheckboxChange = () => {
    onUpdateExercise(task.id, { isCompleted: !exercise.isCompleted });
  };

  return (
    <div 
      id={`exercise-card-${task.id}`} 
      className={`bg-surface-light dark:bg-surface-dark p-5 sm:p-6 rounded-xl shadow-lg mb-6 transition-all duration-300 ease-in-out ${isSelected ? 'ring-2 ring-primary-DEFAULT shadow-xl' : 'hover:shadow-xl'}`}
      aria-labelledby={`exercise-title-${task.id}`}
    >
      <p className="text-xs sm:text-sm text-text_secondary-light dark:text-text_secondary-dark mb-2">
        Referente à Tarefa: <span className="font-medium text-text_primary-light dark:text-text_primary-dark">{task.title}</span>
      </p>
      
      <div className="flex items-start sm:items-center mb-3">
        <AcademicCapIcon className="w-6 h-6 sm:w-7 sm:h-7 text-secondary-light dark:text-secondary-dark mr-3 flex-shrink-0" />
        <h3 
            id={`exercise-title-${task.id}`}
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
            htmlFor={`exercise-complete-${task.id}`} // Visually associated, actual input is the button
            className={`text-sm font-medium cursor-pointer ${exercise.isCompleted ? 'text-text_secondary-light dark:text-text_secondary-dark opacity-70' : 'text-text_primary-light dark:text-text_primary-dark'}`}
            onClick={handleCheckboxChange} // Allow clicking label to toggle
          >
            {exercise.isCompleted ? 'Exercício Concluído' : 'Marcar como Concluído'}
          </label>
        </div>
        
        <div className="flex space-x-2 pt-2 sm:pt-0">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onEditTask(task)} 
            className="flex items-center"
            aria-label={`Editar tarefa e exercício ${exercise.title}`}
          >
            <EditIcon className="w-4 h-4 mr-1.5" />
            Editar
          </Button>
          {!exercise.isCompleted && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onRemoveExercise(task.id)} 
              className="flex items-center text-danger-light dark:text-danger-dark hover:bg-red-50 dark:hover:bg-red-900/30"
              aria-label={`Remover exercício ${exercise.title}`}
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
