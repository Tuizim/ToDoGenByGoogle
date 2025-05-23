
import React, { useState } from 'react';
import YouTubeUrlInput from './YouTubeUrlInput';

interface YouTubePlayerViewProps {
  onLoadVideo: (videoId: string) => void;
  isLoadingVideo: boolean;
  playerError: string;
  isApiReady: boolean;
  apiError?: string;
}

const YouTubePlayerView: React.FC<YouTubePlayerViewProps> = ({
  onLoadVideo,
  isLoadingVideo,
  playerError,
  isApiReady,
  apiError
}) => {
  // Local error state for URL input, distinct from global player errors
  const [urlInputError, setUrlInputError] = useState('');

  // Combine global player error with local URL input error if any
  const displayError = urlInputError || playerError;

  return (
    <div className="py-8 sm:py-10">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-text_primary-light dark:text-text_primary-dark">
        Carregar Áudio do YouTube
      </h2>
      <YouTubeUrlInput
        onLoadVideo={onLoadVideo}
        isLoading={isLoadingVideo}
        errorMessage={displayError}
        setErrorMessage={setUrlInputError} // Pass setter for local errors
        isApiReady={isApiReady}
        apiLoadingError={apiError}
      />
      {/* Instructions or info can be added here */}
      <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg text-sm text-text_secondary-light dark:text-text_secondary-dark">
        <p>Cole um link de um vídeo do YouTube acima para carregar o áudio. Os controles de reprodução aparecerão na barra inferior da tela e ficarão acessíveis em todas as abas do aplicativo.</p>
      </div>
    </div>
  );
};

export default YouTubePlayerView;
