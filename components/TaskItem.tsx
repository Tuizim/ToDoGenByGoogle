
import React, { useState } from 'react';
import { Task, Priority, ExerciseDetails, Subtask } from '../types';
import { PRIORITY_COLORS } from '../constants';
import TrashIcon from './icons/TrashIcon';
import EditIcon from './icons/EditIcon';
import CheckIcon from './icons/CheckIcon';
import SubtaskItem from './SubtaskItem';
import SubtaskInput from './SubtaskInput';
import Button from './Button';
import AcademicCapIcon from './icons/AcademicCapIcon';
import ChevronDownIcon from './icons/ChevronDownIcon'; // Re-used
import ChevronUpIcon from './icons/ChevronUpIcon';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void; 
  onAddSubtask: (taskId: string, subtaskTitle: string) => void;
  onEditSubtask: (taskId: string, subtask: Subtask) => void; 
  onDeleteSubtask: (taskId: string, subtaskId: string) => void;
  onToggleSubtaskComplete: (taskId: string, subtaskId: string) => void;
  onUpdateExercise: (taskId: string, exerciseUpdates: Partial<ExerciseDetails>) => void;
  onRemoveExercise: (taskId: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggleComplete,
  onDelete,
  onEdit,
  onAddSubtask,
  onEditSubtask,
  onDeleteSubtask,
  onToggleSubtaskComplete,
  onUpdateExercise,
}) => {
  const [isSubtasksExpanded, setIsSubtasksExpanded] = useState(true);
  
  const completedSubtasks = task.subtasks.filter(st => st.isCompleted).length;
  const totalSubtasks = task.subtasks.length;

  const handleMainCheckboxToggle = () => {
    if (task.exercise) {
      onUpdateExercise(task.id, { isCompleted: !task.exercise.isCompleted });
    } else {
      onToggleComplete(task.id);
    }
  };

  const toggleSubtasksExpand = () => {
    setIsSubtasksExpanded(!isSubtasksExpanded);
  };

  const canAddSubtasks = !task.isCompleted && !task.exercise;
  const showSubtaskSection = totalSubtasks > 0 || canAddSubtasks;
  const subtasksSectionId = `subtasks-section-${task.id}`;

  return (
    <div className="bg-surface-light dark:bg-surface-dark p-4 rounded-xl shadow-lg mb-4 hover:shadow-xl transition-shadow duration-300 ease-in-out">
      <div className="flex items-start space-x-4">
        <button
          onClick={handleMainCheckboxToggle}
          className={`mt-1 w-6 h-6 border-2 rounded-md flex-shrink-0 flex items-center justify-center transition-all duration-200 ease-in-out
                      ${task.isCompleted 
                        ? 'bg-teal-500 border-teal-500 text-white' 
                        : 'border-slate-400 dark:border-slate-500 hover:border-teal-500 dark:hover:border-teal-400'}`}
          aria-label={task.isCompleted ? 'Marcar tarefa como pendente' : 'Marcar tarefa como concluída'}
          aria-checked={task.isCompleted}
        >
          {task.isCompleted && <CheckIcon className="w-4 h-4" />}
        </button>

        <div className="flex-grow min-w-0">
          <div className="flex justify-between items-start">
            <h3
              className={`text-lg font-semibold break-words ${
                task.isCompleted 
                  ? 'line-through text-text_secondary-light dark:text-text_secondary-dark opacity-75' 
                  : 'text-text_primary-light dark:text-text_primary-dark'
              }`}
            >
              {task.emoji && <span className="mr-2 text-xl" role="img" aria-label="Emoji da tarefa">{task.emoji}</span>}
              {task.title}
            </h3>
            <div className="flex items-center space-x-1.5 flex-shrink-0 ml-2">
              <span 
                className={`px-2.5 py-1 text-xs font-semibold rounded-full text-white ${PRIORITY_COLORS[task.priority]}`}
              >
                {task.priority}
              </span>
              <Button variant="ghost" size="sm" onClick={() => onEdit(task)} className="!p-1.5" aria-label="Editar tarefa">
                <EditIcon className="w-5 h-5 text-text_secondary-light dark:text-text_secondary-dark hover:text-teal-500 dark:hover:text-teal-400" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onDelete(task.id)} className="!p-1.5" aria-label="Excluir tarefa">
                <TrashIcon className="w-5 h-5 text-text_secondary-light dark:text-text_secondary-dark hover:text-danger-light dark:hover:text-danger-dark" />
              </Button>
            </div>
          </div>
          {task.description && (
            <p className={`text-sm mt-1.5 break-words ${
              task.isCompleted 
                ? 'line-through text-text_secondary-light/80 dark:text-text_secondary-dark/80 opacity-75' 
                : 'text-text_secondary-light dark:text-text_secondary-dark'
            }`}>
              {task.description}
            </p>
          )}
          
          {task.exercise && (
            <div 
              className="mt-2 pt-2 border-t border-border_color-light/40 dark:border-border_color-dark/40 flex items-center space-x-2"
              title="Exercício Vinculado à Tarefa"
            >
              <AcademicCapIcon className="w-4 h-4 text-secondary-light dark:text-secondary-dark flex-shrink-0" />
              <p 
                className={`text-sm font-medium break-words ${
                  task.exercise.isCompleted 
                    ? 'line-through text-text_secondary-light dark:text-text_secondary-dark opacity-70' 
                    : 'text-text_primary-light dark:text-text_primary-dark'
                }`}
              >
                {task.exercise.title}
              </p>
            </div>
          )}
        </div>
      </div>

      {showSubtaskSection && (
        <div className={`mt-4 pt-3 ${!task.exercise ? 'border-t border-border_color-light/50 dark:border-border_color_dark/50' : ''}`}>
          <div className="flex justify-between items-center mb-2 px-1">
            <h4 className="text-sm font-medium text-text_secondary-light dark:text-text_secondary-dark">
              Subtarefas 
              {totalSubtasks > 0 && (
                <span className="ml-1 text-xs">({completedSubtasks}/{totalSubtasks})</span>
              )}
            </h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSubtasksExpand}
              className="!p-1.5"
              aria-expanded={isSubtasksExpanded}
              aria-controls={subtasksSectionId}
              aria-label={isSubtasksExpanded ? 'Minimizar subtarefas' : 'Expandir subtarefas'}
            >
              {isSubtasksExpanded ? <ChevronUpIcon className="w-5 h-5" /> : <ChevronDownIcon className="w-5 h-5" />}
            </Button>
          </div>

          {isSubtasksExpanded && (
            <div id={subtasksSectionId}>
              {task.subtasks.map(subtask => (
                <SubtaskItem
                  key={subtask.id}
                  subtask={subtask}
                  onToggleComplete={() => onToggleSubtaskComplete(task.id, subtask.id)}
                  onDelete={() => onDeleteSubtask(task.id, subtask.id)}
                  onEdit={() => onEditSubtask(task.id, subtask)}
                />
              ))}
              {canAddSubtasks && <SubtaskInput onAddSubtask={(title) => onAddSubtask(task.id, title)} />}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskItem;
