
import React, { useMemo } from 'react';
import { Task, ExerciseDetails, TaskFilterOptionId } from '../types';
import TaskItem from './TaskItem';

interface TaskListProps {
  tasks: Task[]; // This should be the original, unfiltered list of tasks
  taskFilter: TaskFilterOptionId;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
  onAddSubtask: (taskId: string, subtaskTitle: string) => void;
  onEditSubtask: (taskId: string, subtaskId: string, newTitle: string) => void;
  onDeleteSubtask: (taskId: string, subtaskId: string) => void;
  onToggleSubtaskComplete: (taskId: string, subtaskId: string) => void;
  onUpdateExercise: (taskId: string, exerciseUpdates: Partial<ExerciseDetails>) => void;
  onRemoveExercise: (taskId: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, taskFilter, ...taskActions }) => {
  const filteredTasks = useMemo(() => {
    if (taskFilter === 'pending') {
      return tasks.filter(task => !task.isCompleted);
    }
    if (taskFilter === 'completed') {
      return tasks.filter(task => task.isCompleted);
    }
    return tasks; // 'all'
  }, [tasks, taskFilter]);

  const sortedTasks = useMemo(() => 
    [...filteredTasks].sort((a, b) => {
      if (taskFilter === 'all') {
        // If showing all, sort by completion status first (pending first), then by creation date
        if (a.isCompleted !== b.isCompleted) {
          return a.isCompleted ? 1 : -1; // completed tasks go to the end
        }
      }
      // For 'pending', 'completed', or if completion status is the same in 'all' view, sort by creation date (newest first)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }), [filteredTasks, taskFilter]);


  if (sortedTasks.length === 0) {
    let emptyMessage = "Nenhuma tarefa ainda.";
    let subMessage = "Adicione uma nova tarefa para começar!";

    if (tasks.length > 0) { // Original tasks exist, but filter yields no results
      if (taskFilter === 'pending') {
        emptyMessage = "Nenhuma tarefa pendente.";
        subMessage = "Ótimo trabalho! Ou adicione novas tarefas.";
      } else if (taskFilter === 'completed') {
        emptyMessage = "Nenhuma tarefa concluída.";
        subMessage = "Conclua algumas tarefas para vê-las aqui.";
      }
    }
    
    return (
      <div className="text-center py-12">
        <svg className="mx-auto h-24 w-24 text-slate-300 dark:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
        <p className="mt-5 text-xl font-semibold text-text_primary-light dark:text-text_primary-dark">{emptyMessage}</p>
        <p className="mt-1 text-text_secondary-light dark:text-text_secondary-dark">{subMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      {sortedTasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          {...taskActions}
        />
      ))}
    </div>
  );
};

export default TaskList;
