

import React, { useState, useEffect } from 'react';
import { Task, Priority, ExerciseDetails } from '../types';
import { PRIORITY_OPTIONS, PRIORITY_TEXT_COLORS } from '../constants';
import Button from './Button';
import PlusIcon from './icons/PlusIcon';

interface TaskFormProps {
  onSubmit: (data: { 
    title: string; 
    description?: string; 
    priority: Priority; 
    exercise?: { title: string; statement: string } | null; // null to remove exercise
  }) => void;
  initialData?: Partial<Pick<Task, 'title' | 'description' | 'priority' | 'exercise'>>;
  submitButtonText?: string;
  onCancel?: () => void;
  isEditMode?: boolean;
  formIdPrefix?: string; // Added for unique IDs
}

const TaskForm: React.FC<TaskFormProps> = ({ 
  onSubmit, 
  initialData, 
  submitButtonText = 'Adicionar',
  onCancel,
  isEditMode = false,
  formIdPrefix = 'form-', // Default prefix
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>(Priority.Media);
  const [hasExercise, setHasExercise] = useState(false);
  const [exerciseTitle, setExerciseTitle] = useState('');
  const [exerciseStatement, setExerciseStatement] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      setPriority(initialData.priority || Priority.Media);
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
        // Reset for new task form (when initialData is not provided)
        setTitle('');
        setDescription('');
        setPriority(Priority.Media);
        setHasExercise(false);
        setExerciseTitle('');
        setExerciseStatement('');
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('O título da tarefa é obrigatório.');
      return;
    }
    if (hasExercise && (!exerciseTitle.trim() || !exerciseStatement.trim())) {
      alert('O título e o enunciado do exercício são obrigatórios.');
      return;
    }

    let exerciseData: { title: string; statement: string } | null | undefined = undefined;
    if (hasExercise) {
      exerciseData = { title: exerciseTitle, statement: exerciseStatement };
    } else if (isEditMode && initialData?.exercise) { 
      exerciseData = null;
    }

    onSubmit({ title, description, priority, exercise: exerciseData });
    
    if (!isEditMode) {
      setTitle('');
      setDescription('');
      setPriority(Priority.Media);
      setHasExercise(false);
      setExerciseTitle('');
      setExerciseStatement('');
    }
  };

  const getToggleLabel = () => {
    if (isEditMode && initialData?.exercise) {
      return hasExercise ? "Manter/Editar Detalhes do Exercício" : "Exercício será REMOVIDO ao salvar";
    }
    if (isEditMode && !initialData?.exercise && hasExercise) {
      return "Definir Detalhes do Novo Exercício";
    }
    return hasExercise ? "Definir Detalhes do Exercício" : "Adicionar Exercício à Tarefa";
  };

  const toggleLabel = getToggleLabel();
  const isRemovingExercise = isEditMode && initialData?.exercise && !hasExercise;

  // Generate unique IDs
  const titleId = `${formIdPrefix}task-title`;
  const descriptionId = `${formIdPrefix}task-description`;
  const priorityId = `${formIdPrefix}task-priority`;
  const exerciseToggleId = `${formIdPrefix}task-has-exercise-toggle`;
  const exerciseTitleId = `${formIdPrefix}exercise-title`;
  const exerciseStatementId = `${formIdPrefix}exercise-statement`;

  return (
    <form onSubmit={handleSubmit} className={`rounded-xl ${!isEditMode ? 'bg-surface-light dark:bg-surface-dark shadow-md p-6 sm:p-8 mb-8' : 'p-1'}`}>
      <div className="mb-5">
        <label htmlFor={titleId} className="block text-sm font-medium text-text_secondary-light dark:text-text_secondary-dark mb-1.5">
          Título da Tarefa
        </label>
        <input
          type="text"
          id={titleId}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ex: Fazer compras"
          className="w-full px-4 py-2.5 border border-border_color-light dark:border-border_color-dark rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-slate-700 text-text_primary-light dark:text-text_primary-dark placeholder-text_secondary-light/70 dark:placeholder-text_secondary-dark/70"
          required
        />
      </div>

      <div className="mb-5">
        <label htmlFor={descriptionId} className="block text-sm font-medium text-text_secondary-light dark:text-text_secondary-dark mb-1.5">
          Descrição (opcional)
        </label>
        <textarea
          id={descriptionId}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Ex: Comprar frutas, legumes e leite"
          rows={3}
          className="w-full px-4 py-2.5 border border-border_color-light dark:border-border_color-dark rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-slate-700 text-text_primary-light dark:text-text_primary-dark placeholder-text_secondary-light/70 dark:placeholder-text_secondary-dark/70"
        />
      </div>

      <div className="mb-5">
        <label htmlFor={priorityId} className="block text-sm font-medium text-text_secondary-light dark:text-text_secondary-dark mb-1.5">
          Prioridade
        </label>
        <select
          id={priorityId}
          value={priority}
          onChange={(e) => setPriority(e.target.value as Priority)}
          className={`w-full px-4 py-2.5 border border-border_color-light dark:border-border_color-dark rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-slate-700 text-text_primary-light dark:text-text_primary-dark ${PRIORITY_TEXT_COLORS[priority]}`}
        >
          {PRIORITY_OPTIONS.map((p) => (
            <option key={p} value={p} className={`${PRIORITY_TEXT_COLORS[p]} bg-surface-light dark:bg-surface-dark`}>
              {p}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-5 p-4 border border-border_color-light dark:border-border_color-dark rounded-lg bg-slate-50 dark:bg-slate-800/30">
        <label htmlFor={exerciseToggleId} className="flex items-center cursor-pointer select-none">
          <div className="relative"> {/* Positioning context for the knob */}
            <input
              type="checkbox"
              id={exerciseToggleId}
              className="sr-only"
              checked={hasExercise}
              onChange={(e) => setHasExercise(e.target.checked)}
              aria-label={toggleLabel}
            />
            {/* Track */}
            <div className={`block w-12 h-7 rounded-full transition-colors duration-150 ease-in-out ${hasExercise ? 'bg-teal-500 dark:bg-teal-400' : 'bg-slate-300 dark:bg-slate-500'}`}></div>
            {/* Knob */}
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
                Título do Exercício
              </label>
              <input
                type="text"
                id={exerciseTitleId}
                value={exerciseTitle}
                onChange={(e) => setExerciseTitle(e.target.value)}
                placeholder="Ex: Cálculo de Força Resultante"
                className="w-full px-3 py-2 border border-border_color-light dark:border-border_color-dark rounded-md shadow-sm text-sm focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-slate-700 text-text_primary-light dark:text-text_primary-dark placeholder-text_secondary-light/70 dark:placeholder-text_secondary-dark/70"
              />
            </div>
            <div>
              <label htmlFor={exerciseStatementId} className="block text-xs font-medium text-text_secondary-light dark:text-text_secondary-dark mb-1">
                Enunciado do Exercício
              </label>
              <textarea
                id={exerciseStatementId}
                value={exerciseStatement}
                onChange={(e) => setExerciseStatement(e.target.value)}
                placeholder="Ex: Um corpo de massa 5kg está sujeito a duas forças..."
                rows={4}
                className="w-full px-3 py-2 border border-border_color-light dark:border-border_color-dark rounded-md shadow-sm text-sm focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-slate-700 text-text_primary-light dark:text-text_primary-dark placeholder-text_secondary-light/70 dark:placeholder-text_secondary-dark/70"
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
        <Button type="submit" variant="primary" size="md" className="flex items-center space-x-2">
          {!isEditMode && <PlusIcon className="w-5 h-5" />}
          <span>{submitButtonText}</span>
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;