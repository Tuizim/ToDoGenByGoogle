

import React from 'react';
import { Subtask } from '../types';
import TrashIcon from './icons/TrashIcon';
import EditIcon from './icons/EditIcon';
import CheckIcon from './icons/CheckIcon';
import AcademicCapIcon from './icons/AcademicCapIcon'; // For exercise icon
import Button from './Button';

interface SubtaskItemProps {
  subtask: Subtask;
  onToggleComplete: () => void;
  onDelete: () => void;
  onEdit: () => void; // Changed: now just calls a handler to open modal
}

const SubtaskItem: React.FC<SubtaskItemProps> = ({ subtask, onToggleComplete, onDelete, onEdit }) => {
  // In-place editing state is removed, will be handled by modal
  // const [isEditing, setIsEditing] = useState(false);
  // const [editedTitle, setEditedTitle] = useState(subtask.title);

  // const handleEditSubmit = () => {
  //   if (editedTitle.trim() && editedTitle.trim() !== subtask.title) {
  //     onEdit(editedTitle.trim()); // This onEdit prop signature will change
  //   }
  //   setIsEditing(false);
  // };
  
  // const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
  //   if (e.key === 'Enter') {
  //     handleEditSubmit();
  //   } else if (e.key === 'Escape') {
  //     setEditedTitle(subtask.title);
  //     setIsEditing(false);
  //   }
  // };

  return (
    <div className="flex flex-col py-2 pl-8 group">
      <div className="flex items-center space-x-3">
        <button
          onClick={onToggleComplete}
          className={`mt-0.5 w-5 h-5 border-2 rounded flex-shrink-0 flex items-center justify-center transition-all duration-200 ease-in-out
                      ${subtask.isCompleted 
                        ? 'bg-teal-500 dark:bg-teal-400 border-teal-500 dark:border-teal-400 text-white' 
                        : 'border-slate-400 dark:border-slate-500 hover:border-teal-500 dark:hover:border-teal-400'}`}
          aria-label={subtask.isCompleted ? 'Marcar subtarefa como pendente' : 'Marcar subtarefa como concluída'}
          aria-checked={subtask.isCompleted}
        >
          {subtask.isCompleted && <CheckIcon className="w-3 h-3" />}
        </button>
        
        {/* Displaying subtask title */}
        <span
          className={`flex-grow text-sm cursor-pointer break-all ${
            subtask.isCompleted 
              ? 'line-through text-text_secondary-light dark:text-text_secondary-dark opacity-75' 
              : 'text-text_primary-light dark:text-text_primary-dark'
          }`}
          onClick={onEdit} // Open edit modal on click
          title="Clique para editar"
        >
          {subtask.title}
        </span>
        
        <div className="flex space-x-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-150">
          <Button variant="ghost" size="sm" onClick={onEdit} className="!p-1" aria-label="Editar subtarefa">
            <EditIcon className="w-4 h-4 text-text_secondary-light dark:text-text_secondary-dark hover:text-teal-500 dark:hover:text-teal-400" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onDelete} className="!p-1" aria-label="Excluir subtarefa">
            <TrashIcon className="w-4 h-4 text-text_secondary-light dark:text-text_secondary-dark hover:text-danger-light dark:hover:text-danger-dark" />
          </Button>
        </div>
      </div>
      {/* Display Subtask's Exercise Title if it exists */}
      {subtask.exercise && (
        <div 
            className="ml-[32px] mt-1 flex items-center space-x-1.5" // Align with subtask title approximately
            title="Exercício Vinculado à Subtarefa"
        >
            <AcademicCapIcon className="w-3.5 h-3.5 text-secondary-light/80 dark:text-secondary-dark/80 flex-shrink-0" />
            <p 
            className={`text-xs italic break-words ${
                subtask.exercise.isCompleted 
                ? 'line-through text-text_secondary-light/70 dark:text-text_secondary-dark/70 opacity-70' 
                : 'text-text_secondary-light/90 dark:text-text_secondary-dark/90'
            }`}
            >
            {subtask.exercise.title}
            </p>
        </div>
      )}
    </div>
  );
};

export default SubtaskItem;