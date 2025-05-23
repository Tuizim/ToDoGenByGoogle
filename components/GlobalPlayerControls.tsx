
import React, { useState } from 'react';
import Button from './Button';
import PlayCircleIcon from './icons/PlayCircleIcon';
import PauseIcon from './icons/PauseIcon';
import SpeakerWaveIcon from './icons/SpeakerWaveIcon';
import SpeakerXMarkIcon from './icons/SpeakerXMarkIcon';
import ChevronDownIcon from './icons/ChevronDownIcon';
import LoadingSpinnerIcon from './icons/LoadingSpinnerIcon';
import ExclamationTriangleIcon from './icons/ExclamationTriangleIcon';

interface GlobalPlayerControlsProps {
  videoTitle: string;
  isPlaying: boolean;
  volume: number;
  onTogglePlayPause: () => void;
  onChangeVolume: (newVolume: number) => void;
  isLoading: boolean;
  errorMessage: string;
}

const GlobalPlayerControls: React.FC<GlobalPlayerControlsProps> = ({
  videoTitle,
  isPlaying,
  volume,
  onTogglePlayPause,
  onChangeVolume,
  isLoading,
  errorMessage,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleMuteToggle = () => {
    onChangeVolume(volume > 0 ? 0 : 50);
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  if (!videoTitle && !isLoading && !errorMessage) {
    return null; // Don't render if no video context
  }

  const MinimizedIcon = () => {
    if (isLoading) return <LoadingSpinnerIcon className="w-6 h-6 text-primary-light dark:text-primary-dark" />;
    if (errorMessage) return <ExclamationTriangleIcon className="w-6 h-6 text-danger-light dark:text-danger-dark" />;
    return isPlaying ? <PauseIcon className="w-6 h-6" /> : <PlayCircleIcon className="w-6 h-6" />;
  };

  if (!isExpanded) {
    return (
      <button
        onClick={toggleExpand}
        className="fixed bottom-4 right-4 z-50 w-12 h-12 sm:w-14 sm:h-14 bg-primary-DEFAULT dark:bg-primary-dark text-white rounded-full shadow-lg flex items-center justify-center hover:bg-sky-600 dark:hover:bg-sky-500 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background-light dark:focus:ring-offset-background-dark focus:ring-primary-light"
        aria-label="Abrir controles do player"
        title={isLoading ? "Carregando..." : errorMessage ? "Erro no player" : isPlaying ? "Pausar" : "Reproduzir"}
      >
        <MinimizedIcon />
      </button>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 sm:bottom-4 sm:left-auto sm:right-4 z-50 bg-surface-light dark:bg-surface-dark border-t sm:border sm:rounded-lg border-border_color-light dark:border-border_color-dark p-3 shadow-2xl w-full sm:max-w-xs md:max-w-sm">
      <div className="flex flex-col space-y-2">
        <div className="flex justify-between items-center">
          {isLoading && <p className="text-sm text-text_secondary-light dark:text-text_secondary-dark animate-pulse">Carregando áudio...</p>}
          {errorMessage && !isLoading && <p className="text-sm text-danger-light dark:text-danger-dark truncate" title={errorMessage}>{errorMessage}</p>}
          {!isLoading && !errorMessage && videoTitle && (
            <p className="text-xs sm:text-sm font-semibold text-text_primary-light dark:text-text_primary-dark truncate" title={videoTitle}>
              {videoTitle}
            </p>
          )}
          <Button
            onClick={toggleExpand}
            variant="ghost"
            size="sm"
            className="!p-1"
            aria-label="Minimizar player"
          >
            <ChevronDownIcon className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex items-center justify-between space-x-2">
          <Button
            onClick={onTogglePlayPause}
            variant="ghost"
            size="md"
            className="!p-2"
            disabled={isLoading} // Only disabled if actively loading. User can try to play if error.
            aria-label={isPlaying ? "Pausar áudio" : "Reproduzir áudio"}
          >
            {isPlaying ? <PauseIcon className="w-5 h-5" /> : <PlayCircleIcon className="w-5 h-5" />}
          </Button>

          <div className="flex items-center space-x-2 flex-grow">
            <Button
              onClick={handleMuteToggle}
              variant="ghost"
              className="!p-1.5"
              disabled={isLoading} // Only disabled if actively loading
              aria-label={volume === 0 ? "Ativar som" : "Silenciar áudio"}
            >
              {volume === 0 ? <SpeakerXMarkIcon className="w-4 h-4" /> : <SpeakerWaveIcon className="w-4 h-4" />}
            </Button>
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => onChangeVolume(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-primary-DEFAULT"
              disabled={isLoading} // Only disabled if actively loading
              aria-label="Controle de volume"
            />
          </div>
          <span className="text-xs w-7 text-right text-text_secondary-light dark:text-text_secondary-dark">{volume}%</span>
        </div>
      </div>
    </div>
  );
};

export default GlobalPlayerControls;
