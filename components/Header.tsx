

import React from 'react';
import { Theme, ViewMode } from '../types';
import SunIcon from './icons/SunIcon';
import MoonIcon from './icons/MoonIcon';
import CheckSquareIcon from './icons/CheckSquareIcon';
import AcademicCapIcon from './icons/AcademicCapIcon';
import PlayCircleIcon from './icons/PlayCircleIcon';
import ListBulletIcon from './icons/ListBulletIcon'; // Added for Tasks button
import { APP_TITLE } from '../constants';
import Button from './Button';

interface HeaderProps {
  theme: Theme;
  toggleTheme: () => void;
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
}

const Header: React.FC<HeaderProps> = ({ theme, toggleTheme, currentView, onNavigate }) => {
  
  const navButtonBaseClasses = "!p-2 text-sm sm:text-base flex items-center rounded-md";
  const navButtonInactiveClasses = "hover:bg-slate-200 dark:hover:bg-slate-700"; // Updated hover for light
  const navButtonActiveClasses = "bg-teal-500/10 dark:bg-teal-400/20 text-teal-500 dark:text-teal-400 font-semibold ring-1 ring-teal-500/30 dark:ring-teal-400/40";

  return (
    <header className="py-3 sm:py-4 px-4 sm:px-6 lg:px-8 bg-surface-light dark:bg-surface-dark border-b border-border_color-light dark:border-border_color-dark sticky top-0 z-40">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <button
          onClick={() => onNavigate('tasks')}
          className="flex items-center space-x-2 sm:space-x-3 group focus:outline-none"
          aria-label={`Ir para ${APP_TITLE} - Tarefas`}
        >
          <CheckSquareIcon className="w-7 h-7 sm:w-8 sm:h-8 text-teal-500 dark:text-teal-400 group-hover:opacity-80 transition-opacity" />
          <h1 className="text-xl sm:text-2xl font-bold text-teal-500 dark:text-teal-400 group-hover:opacity-80 transition-opacity">{APP_TITLE}</h1>
        </button>
        
        <nav className="flex items-center space-x-1 sm:space-x-2">
          <Button
            variant="ghost"
            onClick={() => onNavigate('tasks')}
            className={`${navButtonBaseClasses} ${currentView === 'tasks' ? navButtonActiveClasses : navButtonInactiveClasses}`}
            aria-current={currentView === 'tasks' ? 'page' : undefined}
          >
            <ListBulletIcon className="w-5 h-5 mr-1 sm:mr-1.5" />
            <span className="hidden sm:inline">Tarefas</span>
            <span className="sm:hidden">Lista</span>
          </Button>

          <Button
            variant="ghost"
            onClick={() => onNavigate('exercises')}
            className={`${navButtonBaseClasses} ${currentView === 'exercises' ? navButtonActiveClasses : navButtonInactiveClasses}`}
            aria-current={currentView === 'exercises' ? 'page' : undefined}
          >
            <AcademicCapIcon className="w-5 h-5 mr-1 sm:mr-1.5" />
            <span className="hidden sm:inline">Exercícios</span>
            <span className="sm:hidden">Exer.</span>
          </Button>

          <Button
            variant="ghost"
            onClick={() => onNavigate('youtubePlayer')}
            className={`${navButtonBaseClasses} ${currentView === 'youtubePlayer' ? navButtonActiveClasses : navButtonInactiveClasses}`}
            aria-current={currentView === 'youtubePlayer' ? 'page' : undefined}
          >
            <PlayCircleIcon className="w-5 h-5 mr-1 sm:mr-1.5" />
            <span className="hidden sm:inline">Player</span>
            <span className="sm:hidden">Play</span>
          </Button>
          
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-text_primary-light dark:text-text_primary-dark transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500/50 dark:focus:ring-teal-400/50"
            aria-label={theme === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro'}
          >
            {theme === 'light' ? <MoonIcon className="w-5 h-5 sm:w-6 sm:h-6" /> : <SunIcon className="w-5 h-5 sm:w-6 sm:h-6" />}
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;