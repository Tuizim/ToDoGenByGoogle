

import React, { useState } from 'react';
import PaperAirplaneIcon from './icons/PaperAirplaneIcon'; // New Icon
import LoadingSpinnerIcon from './icons/LoadingSpinnerIcon'; // To show loading state

// Helper function to extract video ID from various YouTube URL formats
const extractVideoID = (url: string): string | null => {
  if (!url) return null;
  const patterns = [
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/|user\/\S+\/u\/\w+\/|playlist\?list=PL[^#&?]*)([^#&?]{11})/,
    /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^#&?]{11})/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1] && match[1].length === 11) {
      return match[1];
    }
  }
  const generalMatch = url.match(/([a-zA-Z0-9_-]{11})/);
  if (generalMatch && generalMatch[1]) {
    return generalMatch[1];
  }
  return null;
};

interface YouTubeUrlInputProps {
  onLoadVideo: (videoId: string) => void;
  isLoading: boolean; // Loading state for the global player
  errorMessage: string; // Error message from the global player or URL parsing
  setErrorMessage: (message: string) => void; // To set local errors or clear global ones
  isApiReady: boolean;
  apiLoadingError?: string;
}

const YouTubeUrlInput: React.FC<YouTubeUrlInputProps> = ({ 
    onLoadVideo, 
    isLoading, 
    errorMessage, 
    setErrorMessage,
    isApiReady,
    apiLoadingError
}) => {
  const [videoUrl, setVideoUrl] = useState<string>('');
  
  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(''); // Clear previous errors
    const extractedId = extractVideoID(videoUrl);
    if (extractedId) {
      onLoadVideo(extractedId);
    } else {
      setErrorMessage('URL do YouTube inválida ou ID do vídeo não encontrado.');
    }
  };

  if (apiLoadingError) {
      return <p className="text-center text-danger-light dark:text-danger-dark mt-4">{apiLoadingError}</p>;
  }
  if (!isApiReady) {
      return <p className="text-center text-text_secondary-light dark:text-text_secondary-dark mt-4">Carregando API do YouTube...</p>;
  }


  return (
    <div className="p-4 sm:p-6 bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg">
      <form onSubmit={handleUrlSubmit} className="space-y-3">
        <div>
          <label htmlFor="youtube-url-input" className="block text-sm font-medium text-text_secondary-light dark:text-text_secondary-dark mb-1.5">
            Link do Vídeo do YouTube
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="url"
              id="youtube-url-input"
              value={videoUrl}
              onChange={(e) => {
                setVideoUrl(e.target.value);
                if (errorMessage) setErrorMessage(''); // Clear error when user types
              }}
              placeholder="https://www.youtube.com/watch?v=..."
              className="flex-grow w-full px-4 py-2.5 border border-border_color-light dark:border-border_color-dark rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-slate-700 text-text_primary-light dark:text-text_primary-dark placeholder-text_secondary-light/70 dark:placeholder-text_secondary-dark/70"
              required
              aria-label="Link do Vídeo do YouTube"
              disabled={!isApiReady || isLoading}
            />
            <button
              type="submit"
              className="flex-shrink-0 w-11 h-11 flex items-center justify-center bg-teal-500 hover:bg-teal-600 dark:bg-teal-400 dark:hover:bg-teal-500 text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 dark:focus:ring-offset-background-dark disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-teal-500/50 dark:disabled:bg-teal-400/50 transition-all duration-150"
              disabled={!isApiReady || isLoading || !videoUrl.trim()}
              aria-label="Carregar vídeo"
              title="Carregar vídeo"
            >
              {isLoading ? (
                <LoadingSpinnerIcon className="w-5 h-5" />
              ) : (
                <PaperAirplaneIcon className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
        {errorMessage && <p className="text-sm text-danger-light dark:text-danger-dark mt-2">{errorMessage}</p>}
      </form>
    </div>
  );
};

export default YouTubeUrlInput;
