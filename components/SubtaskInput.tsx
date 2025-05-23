import React, { useState } from 'react';
import Button from './Button';
import PlusIcon from './icons/PlusIcon';

interface SubtaskInputProps {
  onAddSubtask: (title: string) => void;
}

const SubtaskInput: React.FC<SubtaskInputProps> = ({ onAddSubtask }) => {
  const [subtaskTitle, setSubtaskTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (subtaskTitle.trim()) {
      onAddSubtask(subtaskTitle.trim());
      setSubtaskTitle('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-2 mt-3 mb-1 pl-8">
      <input
        type="text"
        value={subtaskTitle}
        onChange={(e) => setSubtaskTitle(e.target.value)}
        placeholder="Adicionar subtarefa..."
        className="flex-grow px-3 py-1.5 border border-border_color-light dark:border-border_color-dark rounded-md shadow-sm text-sm focus:outline-none focus:ring-1 focus:ring-primary-DEFAULT focus:border-primary-DEFAULT bg-background-light dark:bg-slate-700 text-text_primary-light dark:text-text_primary-dark placeholder-text_secondary-light/70 dark:placeholder-text_secondary-dark/70"
      />
      <Button type="submit" variant="ghost" size="sm" className="!p-2" aria-label="Adicionar subtarefa">
        <PlusIcon className="w-4 h-4" />
      </Button>
    </form>
  );
};

export default SubtaskInput;