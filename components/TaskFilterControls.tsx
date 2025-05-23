
import React from 'react';
import Button from './Button';
import { TASK_FILTER_OPTIONS } from '../constants';
import { TaskFilterOptionId } from '../types';

interface TaskFilterControlsProps {
  currentFilter: TaskFilterOptionId;
  onFilterChange: (filter: TaskFilterOptionId) => void;
}

const TaskFilterControls: React.FC<TaskFilterControlsProps> = ({ currentFilter, onFilterChange }) => {
  const buttonBaseClasses = "flex-1 sm:flex-none !py-2 !px-3 text-sm sm:text-base rounded-md transition-colors duration-150";
  const buttonInactiveClasses = "hover:bg-slate-100 dark:hover:bg-slate-700 text-text_secondary-light dark:text-text_secondary-dark border border-border_color-light dark:border-border_color-dark";
  const buttonActiveClasses = "bg-primary-light/10 dark:bg-primary-dark/20 text-primary-light dark:text-primary-dark font-semibold ring-1 ring-primary-light/30 dark:ring-primary-dark/40 border border-primary-light/30 dark:border-primary-dark/40";

  return (
    <nav aria-label="Filtros de tarefas" className="mb-5 sm:mb-6">
      <div className="flex justify-center sm:justify-start space-x-2 sm:space-x-3 bg-surface-light dark:bg-surface-dark p-2 rounded-lg shadow-sm border border-border_color-light dark:border-border_color-dark">
        {TASK_FILTER_OPTIONS.map(option => (
          <Button
            key={option.id}
            variant="ghost" // Using ghost and overriding styles for active/inactive
            onClick={() => onFilterChange(option.id)}
            className={`${buttonBaseClasses} ${currentFilter === option.id ? buttonActiveClasses : buttonInactiveClasses}`}
            aria-pressed={currentFilter === option.id}
          >
            {option.label}
          </Button>
        ))}
      </div>
    </nav>
  );
};

export default TaskFilterControls;
