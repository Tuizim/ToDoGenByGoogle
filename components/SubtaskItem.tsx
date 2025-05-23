import React, { useState } from 'react';
import { Subtask } from '../types';
import TrashIcon from './icons/TrashIcon';
import EditIcon from './icons/EditIcon';
import CheckIcon from './icons/CheckIcon';
import Button from './Button';

interface SubtaskItemProps {
  subtask: Subtask;
  onToggleComplete: () => void;
  onDelete: () => void;
  onEdit: (newTitle: string) => void;
}

const SubtaskItem: React.FC<SubtaskItemProps> = ({ subtask, onToggleComplete, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(subtask.title);

  const handleEditSubmit = () => {
    if (editedTitle.trim() && editedTitle.trim() !== subtask.title) {
      onEdit(editedTitle.trim());
    }
    setIsEditing(false);
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleEditSubmit();
    } else if (e.key === 'Escape') {
      setEditedTitle(subtask.title);
      setIsEditing(false);
    }
  };


  return (
    <div className="flex items-center space-x-3 py-2 pl-8 group">
      <button
        onClick={onToggleComplete}
        className={`w-5 h-5 border-2 rounded flex-shrink-0 flex items-center justify-center transition-all duration-200 ease-in-out
                    ${subtask.isCompleted 
                      ? 'bg-primary-light dark:bg-primary-dark border-primary-light dark:border-primary-dark text-white' 
                      : 'border-slate-400 dark:border-slate-500 hover:border-primary-light dark:hover:border-primary-dark'}`}
        aria-label={subtask.isCompleted ? 'Marcar subtarefa como pendente' : 'Marcar subtarefa como concluída'}
      >
        {subtask.isCompleted && <CheckIcon className="w-3 h-3" />}
      </button>
      
      {isEditing ? (
        <input
          type="text"
          value={editedTitle}
          onChange={(e) => setEditedTitle(e.target.value)}
          onBlur={handleEditSubmit}
          onKeyDown={handleKeyPress}
          className="flex-grow text-sm px-1 py-0.5 border-b-2 border-primary-DEFAULT bg-transparent focus:outline-none text-text_primary-light dark:text-text_primary-dark"
          autoFocus
        />
      ) : (
        <span
          className={`flex-grow text-sm cursor-pointer break-all ${ // Added break-all
            subtask.isCompleted 
              ? 'line-through text-text_secondary-light dark:text-text_secondary-dark opacity-75' 
              : 'text-text_primary-light dark:text-text_primary-dark'
          }`}
          onClick={() => {setIsEditing(true); setEditedTitle(subtask.title);}}
          title="Clique para editar"
        >
          {subtask.title}
        </span>
      )}
      
      <div className="flex space-x-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-150">
        {!isEditing && (
          <Button variant="ghost" size="sm" onClick={() => {setIsEditing(true); setEditedTitle(subtask.title);}} className="!p-1" aria-label="Editar subtarefa">
            <EditIcon className="w-4 h-4 text-text_secondary-light dark:text-text_secondary-dark hover:text-primary-light dark:hover:text-primary-dark" />
          </Button>
        )}
        <Button variant="ghost" size="sm" onClick={onDelete} className="!p-1" aria-label="Excluir subtarefa">
          <TrashIcon className="w-4 h-4 text-text_secondary-light dark:text-text_secondary-dark hover:text-danger-light dark:hover:text-danger-dark" />
        </Button>
      </div>
    </div>
  );
};

export default SubtaskItem;