
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useTheme } from './hooks/useTheme';
import { useTasks } from './hooks/useTasks';
import Header from './components/Header';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import Modal from './components/Modal';
import ExerciseViewer from './components/ExerciseViewer';
import YouTubePlayerView from './components/YouTubePlayerView';
import GlobalPlayerControls from './components/GlobalPlayerControls';
import TaskFilterControls from './components/TaskFilterControls'; // Import new component
import { Task, Priority, ExerciseDetails, ViewMode, Theme, TaskFilterOptionId } from './types';
import { useYouTubeIframeApi } from './hooks/useYouTubeIframeApi';

const App: React.FC = () => {
  const [theme, toggleTheme] = useTheme();
  const {
    tasks,
    addTask,
    editTask,
    deleteTask,
    toggleTaskComplete,
    addSubtask,
    editSubtask,
    deleteSubtask,
    toggleSubtaskComplete,
    updateExercise,
    removeExerciseFromTask,
  } = useTasks();

  const [currentView, setCurrentView] = useState<ViewMode>('tasks');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [taskFilter, setTaskFilter] = useState<TaskFilterOptionId>('all'); // State for task filter

  // YouTube Player Global State
  const { isApiReady: isYouTubeApiReady, error: youtubeApiError } = useYouTubeIframeApi();
  const youtubePlayerRef = useRef<any>(null);
  const youtubePlayerContainerRef = useRef<HTMLDivElement>(null);
  const [youtubeVideoId, setYoutubeVideoId] = useState<string | null>(null);
  const [isYoutubePlaying, setIsYoutubePlaying] = useState<boolean>(false);
  const [youtubeVolume, setYoutubeVolume] = useState<number>(50);
  const [youtubeVideoTitle, setYoutubeVideoTitle] = useState<string>('');
  const [isYoutubeLoading, setIsYoutubeLoading] = useState<boolean>(false);
  const [youtubeErrorMessage, setYoutubeErrorMessage] = useState<string>('');
  const [autoplayNextVideo, setAutoplayNextVideo] = useState(false);


  const handleNavigate = useCallback((view: ViewMode) => {
    setCurrentView(view);
  }, []);

  const handleOpenEditModal = useCallback((task: Task) => {
    setTaskToEdit(task);
    setIsEditModalOpen(true);
  }, []);

  const handleCloseEditModal = useCallback(() => {
    setIsEditModalOpen(false);
    setTaskToEdit(null);
  }, []);

  const handleAddTask = useCallback((data: { 
    title: string; 
    description?: string; 
    priority: Priority;
    exercise?: { title: string; statement: string };
  }) => {
    addTask(data.title, data.description, data.priority, data.exercise);
  }, [addTask]);

  const handleEditTaskSubmit = useCallback((data: { 
    title: string; 
    description?: string; 
    priority: Priority;
    exercise?: { title: string; statement: string } | null;
  }) => {
    if (taskToEdit) {
      let exerciseForEditTask: ExerciseDetails | null | undefined;

      if (data.exercise === null) { 
        exerciseForEditTask = null;
      } else if (data.exercise) { 
        exerciseForEditTask = {
          title: data.exercise.title,
          statement: data.exercise.statement,
          isCompleted: taskToEdit.exercise ? taskToEdit.exercise.isCompleted : false, 
        };
      } else { 
        exerciseForEditTask = taskToEdit.exercise; 
      }

      editTask(taskToEdit.id, { 
        title: data.title,
        description: data.description,
        priority: data.priority,
        exercise: exerciseForEditTask,
        isCompleted: data.exercise ? (exerciseForEditTask ? exerciseForEditTask.isCompleted : taskToEdit.isCompleted) : taskToEdit.isCompleted
      });
      handleCloseEditModal();
    }
  }, [taskToEdit, editTask, handleCloseEditModal]);

  const handleTaskFilterChange = useCallback((newFilter: TaskFilterOptionId) => {
    setTaskFilter(newFilter);
  }, []);

  // YouTube Player Logic
  useEffect(() => {
    if (youtubeApiError) {
      const messageText = youtubeApiError.message ? youtubeApiError.message : 'Ocorreu um erro ao tentar carregar a API do YouTube.';
      setYoutubeErrorMessage(`Erro ao carregar API do YouTube: ${messageText}`);
    }
  }, [youtubeApiError]);

  const onPlayerReady = useCallback((event: any) => {
    console.log("onPlayerReady called");
    setIsYoutubeLoading(false);
    setYoutubeVideoTitle(event.target.getVideoData().title || 'Vídeo Carregado');
    // Volume is now set by a separate useEffect
    if (autoplayNextVideo) {
      console.log("onPlayerReady: Autoplaying video due to autoplayNextVideo flag");
      event.target.playVideo();
      setAutoplayNextVideo(false); 
    }
  }, [autoplayNextVideo, setIsYoutubeLoading, setYoutubeVideoTitle, setAutoplayNextVideo]);


  const onPlayerStateChange = useCallback((event: any) => {
    const playerState = event.data;
    console.log("Player state changed:", playerState, " AutoplayNextVideo:", autoplayNextVideo, "(PLAYING:1, PAUSED:2, ENDED:0, BUFFERING:3, CUED:5, UNSTARTED:-1)");
    if (playerState === window.YT.PlayerState.PLAYING) {
      setIsYoutubePlaying(true);
      setIsYoutubeLoading(false);
      setYoutubeErrorMessage('');
    } else if (playerState === window.YT.PlayerState.PAUSED) {
      setIsYoutubePlaying(false);
    } else if (playerState === window.YT.PlayerState.ENDED) {
      setIsYoutubePlaying(false);
    } else if (playerState === window.YT.PlayerState.BUFFERING) {
      setIsYoutubeLoading(true);
    } else if (playerState === window.YT.PlayerState.CUED) {
        setIsYoutubeLoading(false);
        if(autoplayNextVideo && youtubePlayerRef.current){
            console.log("onPlayerStateChange (CUED): Autoplaying video due to autoplayNextVideo flag");
            youtubePlayerRef.current.playVideo();
            setAutoplayNextVideo(false); 
        }
    } else if (playerState === window.YT.PlayerState.UNSTARTED) {
        setIsYoutubeLoading(false); 
    }
  }, [autoplayNextVideo, setAutoplayNextVideo, setIsYoutubePlaying, setIsYoutubeLoading, setYoutubeErrorMessage]);

  const onPlayerError = useCallback((event: any) => {
    setIsYoutubeLoading(false);
    setIsYoutubePlaying(false);
    const errorCode = event.data;
    console.error('YouTube Player Error:', errorCode);
    if (errorCode === 2) {
       setYoutubeErrorMessage("Link do vídeo inválido.");
    } else if (errorCode === 5) {
        setYoutubeErrorMessage("Erro no player HTML5.");
    } else if (errorCode === 100) {
        setYoutubeErrorMessage("Vídeo não encontrado ou privado.");
    } else if (errorCode === 101 || errorCode === 150) {
      setYoutubeErrorMessage("Reprodução desativada em players incorporados.");
    } else {
      setYoutubeErrorMessage(`Erro no player (código ${errorCode}).`);
    }
  }, [setIsYoutubeLoading, setIsYoutubePlaying, setYoutubeErrorMessage]);
  

  useEffect(() => {
    if (!isYouTubeApiReady || !youtubePlayerContainerRef.current) {
      console.log("YouTube Effect: API not ready or Player Container not available.", { isYouTubeApiReady, containerAvailable: !!youtubePlayerContainerRef.current });
      return;
    }

    if (youtubeVideoId) {
      setIsYoutubeLoading(true); 
      setYoutubeErrorMessage(''); 

      if (youtubePlayerRef.current && typeof youtubePlayerRef.current.loadVideoById === 'function') {
        console.log("Player exists, loading video by ID:", youtubeVideoId);
        youtubePlayerRef.current.loadVideoById({ videoId: youtubeVideoId });
      } else {
        if (youtubePlayerRef.current && typeof youtubePlayerRef.current.destroy === 'function') {
            youtubePlayerRef.current.destroy();
        }
        console.log("Player does not exist or not ready, creating new for video ID:", youtubeVideoId);
        try {
          youtubePlayerRef.current = new window.YT.Player(youtubePlayerContainerRef.current, {
            height: '200',
            width: '200',
            videoId: youtubeVideoId,
            playerVars: {
              autoplay: 0, 
              controls: 0,
              modestbranding: 1,
              fs: 0,
              rel: 0,
            },
            events: {
              onReady: onPlayerReady,
              onStateChange: onPlayerStateChange,
              onError: onPlayerError,
            },
          });
        } catch (e: any) {
          setIsYoutubeLoading(false);
          setYoutubeErrorMessage(`Falha ao inicializar o player: ${e.message || 'Erro desconhecido'}`);
          console.error("Error initializing YouTube player:", e);
        }
      }
    } else { 
      if (youtubePlayerRef.current && typeof youtubePlayerRef.current.destroy === 'function') {
        console.log("No video ID, destroying player.");
        youtubePlayerRef.current.destroy();
        youtubePlayerRef.current = null;
      }
      setYoutubeVideoTitle('');
      setIsYoutubePlaying(false);
      setIsYoutubeLoading(false);
      setYoutubeErrorMessage('');
      setAutoplayNextVideo(false);
    }
  }, [isYouTubeApiReady, youtubeVideoId, onPlayerReady, onPlayerStateChange, onPlayerError, autoplayNextVideo]);

  // Effect to synchronize volume state with player instance
  useEffect(() => {
    const player = youtubePlayerRef.current;
    if (player && typeof player.setVolume === 'function' && youtubeVideoId) {
      player.setVolume(youtubeVolume);
    }
  }, [youtubeVolume, youtubeVideoId]);


  const loadYouTubeVideoById = useCallback((id: string) => {
    console.log("loadYouTubeVideoById called with ID:", id);
    setAutoplayNextVideo(true); 
    setYoutubeVideoId(id); 
  }, [setAutoplayNextVideo, setYoutubeVideoId]);


  const toggleYouTubePlayPause = useCallback(() => {
    const player = youtubePlayerRef.current;
    if (!player || !youtubeVideoId || typeof player.getPlayerState !== 'function') {
      console.warn("Toggle play pause: Player not ready or no video ID.", { hasPlayer: !!player, youtubeVideoId });
      return;
    }
    
    const currentState = player.getPlayerState();
    console.log("toggleYouTubePlayPause: Current player state:", currentState, "isYoutubeLoading:", isYoutubeLoading);
    
    if (currentState === window.YT.PlayerState.BUFFERING && isYoutubeLoading && !youtubeErrorMessage) {
      console.log("Toggle play pause: Player is BUFFERING, action deferred.");
      return;
    }
    
    if (currentState === window.YT.PlayerState.PLAYING) {
      console.log("Player is PLAYING. Calling pauseVideo().");
      player.pauseVideo();
    } else { 
      console.log("Player is NOT PLAYING (state:", currentState, "). Attempting playVideo().");
      player.playVideo();
    }
    setAutoplayNextVideo(false); 
  }, [youtubeVideoId, isYoutubeLoading, youtubeErrorMessage, setAutoplayNextVideo]);


  const changeYouTubeVolume = useCallback((newVolume: number) => {
    setYoutubeVolume(newVolume);
    // The useEffect for volume sync will handle setting it on the player instance.
    // However, setting it here directly can make UI feel more responsive if desired.
    const player = youtubePlayerRef.current;
    if (player && typeof player.setVolume === 'function' && youtubeVideoId) {
      player.setVolume(newVolume);
    }
  }, [youtubeVideoId]);


  const renderCurrentView = () => {
    switch (currentView) {
      case 'tasks':
        return (
          <>
            <TaskForm 
              onSubmit={handleAddTask} 
              submitButtonText="Adicionar"
              formIdPrefix="add-task-"
            />
            <div className="mt-10 sm:mt-12">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-text_primary-light dark:text-text_primary-dark">Minhas Tarefas</h2>
              <TaskFilterControls
                currentFilter={taskFilter}
                onFilterChange={handleTaskFilterChange}
              />
              <TaskList
                tasks={tasks}
                taskFilter={taskFilter} 
                onEdit={handleOpenEditModal}
                onDelete={deleteTask}
                onToggleComplete={toggleTaskComplete}
                onAddSubtask={addSubtask}
                onEditSubtask={editSubtask}
                onDeleteSubtask={deleteSubtask}
                onToggleSubtaskComplete={toggleSubtaskComplete}
                onUpdateExercise={updateExercise}
                onRemoveExercise={removeExerciseFromTask}
              />
            </div>
          </>
        );
      case 'exercises':
        return (
          <ExerciseViewer
            tasks={tasks}
            onUpdateExercise={updateExercise}
            onEditTask={handleOpenEditModal}
            onRemoveExercise={removeExerciseFromTask}
          />
        );
      case 'youtubePlayer':
        return (
          <YouTubePlayerView 
            onLoadVideo={loadYouTubeVideoById}
            isLoadingVideo={isYoutubeLoading}
            playerError={youtubeErrorMessage}
            isApiReady={isYouTubeApiReady}
            apiError={youtubeApiError?.message}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark transition-colors duration-300">
      <Header 
        theme={theme} 
        toggleTheme={toggleTheme} 
        currentView={currentView}
        onNavigate={handleNavigate}
      />
      <main className="flex-grow container mx-auto px-4 py-6 sm:py-8 max-w-4xl">
        {renderCurrentView()}
      </main>

      {isEditModalOpen && taskToEdit && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          title="Editar Tarefa"
        >
          <TaskForm
            onSubmit={handleEditTaskSubmit}
            initialData={{
              title: taskToEdit.title,
              description: taskToEdit.description,
              priority: taskToEdit.priority,
              exercise: taskToEdit.exercise,
            }}
            submitButtonText="Salvar Alterações"
            onCancel={handleCloseEditModal}
            isEditMode={true}
            formIdPrefix="edit-task-"
          />
        </Modal>
      )}

      {isYouTubeApiReady && youtubeVideoId && (
        <GlobalPlayerControls
          videoTitle={youtubeVideoTitle}
          isPlaying={isYoutubePlaying}
          volume={youtubeVolume}
          onTogglePlayPause={toggleYouTubePlayPause}
          onChangeVolume={changeYouTubeVolume}
          isLoading={isYoutubeLoading}
          errorMessage={youtubeErrorMessage}
        />
      )}
      
      <div 
        style={{
          position: 'absolute',
          top: '-9999px',
          left: '-9999px',
          width: '200px', 
          height: '200px',
          overflow: 'hidden', // Ensure it doesn't accidentally show scrollbars
        }}
      >
        <div ref={youtubePlayerContainerRef} id="app-youtube-player-iframe-container"></div>
      </div>

       <footer className="text-center py-6 text-sm text-text_secondary-light dark:text-text_secondary-dark border-t border-border_color-light dark:border-border_color-dark">
        © {new Date().getFullYear()} ToDo. Feito com ❤️.
      </footer>
    </div>
  );
};

export default App;
