

import React, { useState, useEffect } from 'react';
import { ExerciseDetails } from '../types';
import Button from './Button';

interface SubtaskFormProps {
  onSubmit: (data: { 
    title: string; 
    exercise?: { title: string; statement: string } | null; 
  }) => void;
  initialData?: { title: string; exercise?: ExerciseDetails };
  submitButtonText?: string;
  onCancel?: () => void;
  formIdPrefix?: string;
}

const SubtaskForm: React.FC<SubtaskFormProps> = ({ 
  onSubmit, 
  initialData, 
  submitButtonText = 'Salvar',
  onCancel,
  formIdPrefix = 'subtask-form-',
}) => {
  const [title, setTitle] = useState('');
  const [hasExercise, setHasExercise] = useState(false);
  const [exerciseTitle, setExerciseTitle] = useState('');
  const [exerciseStatement, setExerciseStatement] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      if (initialData.exercise) {
        setHasExercise(true);
        setExerciseTitle(initialData.exercise.title || '');
        setExerciseStatement(initialData.exercise.statement || '');
      } else {
        setHasExercise(false);
        setExerciseTitle('');
        setExerciseStatement('');
      }
    } else {
        setTitle('');
        setHasExercise(false);
        setExerciseTitle('');
        setExerciseStatement('');
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('O título da subtarefa é obrigatório.');
      return;
    }
    if (hasExercise && (!exerciseTitle.trim() || !exerciseStatement.trim())) {
      alert('O título e o enunciado do exercício são obrigatórios.');
      return;
    }

    let exerciseData: { title: string; statement: string } | null | undefined = undefined;
    if (hasExercise) {
      exerciseData = { title: exerciseTitle, statement: exerciseStatement };
    } else if (initialData?.exercise) { // If initially had exercise but now doesn't
      exerciseData = null; // Signal to remove
    }

    onSubmit({ title, exercise: exerciseData });
  };
  
  const getToggleLabel = () => {
    if (initialData?.exercise) { // Editing existing subtask that has an exercise
        return hasExercise ? "Manter/Editar Detalhes do Exercício" : "Exercício será REMOVIDO ao salvar";
    }
    // Adding exercise to existing subtask or new subtask
    return hasExercise ? "Definir Detalhes do Exercício" : "Adicionar Exercício à Subtarefa";
  };

  const toggleLabel = getToggleLabel();
  const isRemovingExercise = initialData?.exercise && !hasExercise;


  const titleId = `${formIdPrefix}subtask-title`;
  const exerciseToggleId = `${formIdPrefix}subtask-has-exercise-toggle`;
  const exerciseTitleId = `${formIdPrefix}subtask-exercise-title`;
  const exerciseStatementId = `${formIdPrefix}subtask-exercise-statement`;

  return (
    <form onSubmit={handleSubmit} className="p-1">
      <div className="mb-5">
        <label htmlFor={titleId} className="block text-sm font-medium text-text_secondary-light dark:text-text_secondary-dark mb-1.5">
          Título da Subtarefa
        </label>
        <input
          type="text"
          id={titleId}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ex: Comprar maçãs"
          className="w-full px-4 py-2.5 border border-border_color-light dark:border-border_color-dark rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-background-light dark:bg-slate-700 text-text_primary-light dark:text-text_primary-dark placeholder-text_secondary-light/70 dark:placeholder-text_secondary-dark/70"
          required
        />
      </div>
      
      <div className="mb-5 p-4 border border-border_color-light dark:border-border_color-dark rounded-lg bg-slate-50 dark:bg-slate-800/30">
        <label htmlFor={exerciseToggleId} className="flex items-center cursor-pointer select-none">
          <div className="relative">
            <input
              type="checkbox"
              id={exerciseToggleId}
              className="sr-only"
              checked={hasExercise}
              onChange={(e) => setHasExercise(e.target.checked)}
              aria-label={toggleLabel}
            />
            <div className={`block w-12 h-7 rounded-full transition-colors duration-150 ease-in-out ${hasExercise ? 'bg-teal-500 dark:bg-teal-400' : 'bg-slate-300 dark:bg-slate-500'}`}></div>
            <div className={`absolute top-1 bg-white w-5 h-5 rounded-full transition-all duration-150 ease-in-out ${hasExercise ? 'right-1' : 'left-1'}`}></div>
          </div>
          <span className={`ml-3 text-sm font-medium ${isRemovingExercise ? 'text-danger-light dark:text-danger-dark font-semibold' : 'text-text_secondary-light dark:text-text_secondary-dark'}`}>
            {toggleLabel}
          </span>
        </label>

        {hasExercise && (
          <div className="space-y-4 mt-4 pt-4 border-t border-border_color-light dark:border-border_color-dark">
            <div>
              <label htmlFor={exerciseTitleId} className="block text-xs font-medium text-text_secondary-light dark:text-text_secondary-dark mb-1">
                Título do Exercício (da Subtarefa)
              </label>
              <input
                type="text"
                id={exerciseTitleId}
                value={exerciseTitle}
                onChange={(e) => setExerciseTitle(e.target.value)}
                placeholder="Ex: Contar as maçãs"
                className="w-full px-3 py-2 border border-border_color-light dark:border-border_color-dark rounded-md shadow-sm text-sm focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 bg-background-light dark:bg-slate-700 text-text_primary-light dark:text-text_primary-dark placeholder-text_secondary-light/70 dark:placeholder-text_secondary-dark/70"
              />
            </div>
            <div>
              <label htmlFor={exerciseStatementId} className="block text-xs font-medium text-text_secondary-light dark:text-text_secondary-dark mb-1">
                Enunciado do Exercício (da Subtarefa)
              </label>
              <textarea
                id={exerciseStatementId}
                value={exerciseStatement}
                onChange={(e) => setExerciseStatement(e.target.value)}
                placeholder="Ex: Quantas maçãs verdes e vermelhas há na cesta?"
                rows={3}
                className="w-full px-3 py-2 border border-border_color-light dark:border-border_color-dark rounded-md shadow-sm text-sm focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 bg-background-light dark:bg-slate-700 text-text_primary-light dark:text-text_primary-dark placeholder-text_secondary-light/70 dark:placeholder-text_secondary-dark/70"
              />
            </div>
          </div>
        )}
      </div>
      
      <div className={`flex ${onCancel ? 'justify-end space-x-3' : 'justify-start'} mt-6 sm:mt-8`}>
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        <Button type="submit" variant="primary" size="md">
          {submitButtonText}
        </Button>
      </div>
    </form>
  );
};

export default SubtaskForm;