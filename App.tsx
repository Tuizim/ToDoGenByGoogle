
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
import TaskFilterControls from './components/TaskFilterControls'; 
import SubtaskForm from './components/SubtaskForm';
import { Task, Priority, ExerciseDetails, ViewMode, Theme, TaskFilterOptionId, Subtask, DisplayedExercise } from './types';
import { useYouTubeIframeApi } from './hooks/useYouTubeIframeApi';

interface EditingSubtaskInfo {
  taskId: string;
  subtask: Subtask;
}

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
    updateSubtaskExercise, 
    removeExerciseFromSubtask, 
  } = useTasks();

  const [currentView, setCurrentView] = useState<ViewMode>('tasks');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [taskFilter, setTaskFilter] = useState<TaskFilterOptionId>('all');

  const [editingSubtaskInfo, setEditingSubtaskInfo] = useState<EditingSubtaskInfo | null>(null);
  const [isEditSubtaskModalOpen, setIsEditSubtaskModalOpen] = useState(false);

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
    emoji?: string; // Added emoji
  }) => {
    addTask(data.title, data.description, data.priority, data.exercise, data.emoji); // Pass emoji
  }, [addTask]);

  const handleEditTaskSubmit = useCallback((data: { 
    title: string; 
    description?: string; 
    priority: Priority;
    exercise?: { title: string; statement: string } | null;
    emoji?: string; // Added emoji
  }) => {
    if (taskToEdit) {
      let exerciseForEditTask: ExerciseDetails | null | undefined;

      if (data.exercise === null) { 
        exerciseForEditTask = null;
      } else if (data.exercise) { 
        exerciseForEditTask = {
          title: data.exercise.title,
          statement: data.exercise.statement,
          isCompleted: data.exercise ? (taskToEdit.exercise ? taskToEdit.exercise.isCompleted : false) : false, 
        };
      } else { 
        exerciseForEditTask = taskToEdit.exercise; 
      }

      editTask(taskToEdit.id, { 
        title: data.title,
        description: data.description,
        priority: data.priority,
        exercise: exerciseForEditTask,
        isCompleted: taskToEdit.isCompleted,
        emoji: data.emoji, // Pass emoji
      });
      handleCloseEditModal();
    }
  }, [taskToEdit, editTask, handleCloseEditModal]);

  const handleTaskFilterChange = useCallback((newFilter: TaskFilterOptionId) => {
    setTaskFilter(newFilter);
  }, []);

  const handleOpenEditSubtaskModal = useCallback((taskId: string, subtask: Subtask) => {
    setEditingSubtaskInfo({ taskId, subtask });
    setIsEditSubtaskModalOpen(true);
  }, []);

  const handleCloseEditSubtaskModal = useCallback(() => {
    setIsEditSubtaskModalOpen(false);
    setEditingSubtaskInfo(null);
  }, []);

  const handleEditSubtaskSubmit = useCallback((data: { 
    title: string; 
    exercise?: { title: string; statement: string } | null 
  }) => {
    if (editingSubtaskInfo) {
      const { taskId, subtask } = editingSubtaskInfo;
      let exerciseForEdit: ExerciseDetails | null | undefined;

      if (data.exercise === null) { 
        exerciseForEdit = null;
      } else if (data.exercise) { 
        exerciseForEdit = {
          title: data.exercise.title,
          statement: data.exercise.statement,
          isCompleted: data.exercise ? (subtask.exercise ? subtask.exercise.isCompleted : subtask.isCompleted) : subtask.isCompleted,
        };
      } else { 
        exerciseForEdit = subtask.exercise;
      }
      
      editSubtask(taskId, subtask.id, {
        title: data.title,
        exercise: exerciseForEdit,
      });
      handleCloseEditSubtaskModal();
    }
  }, [editingSubtaskInfo, editSubtask, handleCloseEditSubtaskModal]);

  const handleEditSubtaskExerciseRequest = useCallback((taskId: string, subtaskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    const subtask = task?.subtasks.find(st => st.id === subtaskId);
    if (task && subtask) {
      handleOpenEditSubtaskModal(taskId, subtask);
    }
  }, [tasks, handleOpenEditSubtaskModal]);

  const handleUpdateTaskExercise = updateExercise; 
  const handleUpdateSubtaskExercise = updateSubtaskExercise;
  const handleRemoveTaskExercise = removeExerciseFromTask; 
  const handleRemoveSubtaskExercise = removeExerciseFromSubtask;


  useEffect(() => {
    if (youtubeApiError) {
      const messageText = youtubeApiError.message ? youtubeApiError.message : 'Ocorreu um erro ao tentar carregar a API do YouTube.';
      setYoutubeErrorMessage(`Erro ao carregar API do YouTube: ${messageText}`);
    }
  }, [youtubeApiError]);

  const onPlayerReady = useCallback((event: any) => {
    setIsYoutubeLoading(false);
    setYoutubeVideoTitle(event.target.getVideoData().title || 'Vídeo Carregado');
    if (autoplayNextVideo) {
      event.target.playVideo();
      setAutoplayNextVideo(false); 
    }
  }, [autoplayNextVideo]);


  const onPlayerStateChange = useCallback((event: any) => {
    const playerState = event.data;
    if (playerState === window.YT.PlayerState.PLAYING) setIsYoutubePlaying(true);
    else setIsYoutubePlaying(false);

    if (playerState === window.YT.PlayerState.BUFFERING) setIsYoutubeLoading(true);
    else setIsYoutubeLoading(false);
    
    if (playerState === window.YT.PlayerState.CUED && autoplayNextVideo && youtubePlayerRef.current) {
        youtubePlayerRef.current.playVideo();
        setAutoplayNextVideo(false);
    }
    if (playerState === window.YT.PlayerState.UNSTARTED || playerState === window.YT.PlayerState.ENDED) {
        setAutoplayNextVideo(false); 
    }

  }, [autoplayNextVideo]);

  const onPlayerError = useCallback((event: any) => {
    setIsYoutubeLoading(false);
    setIsYoutubePlaying(false);
    const errorCode = event.data;
    if (errorCode === 2) setYoutubeErrorMessage("Link do vídeo inválido.");
    else if (errorCode === 5) setYoutubeErrorMessage("Erro no player HTML5.");
    else if (errorCode === 100) setYoutubeErrorMessage("Vídeo não encontrado ou privado.");
    else if (errorCode === 101 || errorCode === 150) setYoutubeErrorMessage("Reprodução desativada em players incorporados.");
    else setYoutubeErrorMessage(`Erro no player (código ${errorCode}).`);
  }, []);
  

  useEffect(() => {
    if (!isYouTubeApiReady || !youtubePlayerContainerRef.current) return;

    if (youtubeVideoId) {
      setIsYoutubeLoading(true); 
      setYoutubeErrorMessage(''); 

      if (youtubePlayerRef.current && typeof youtubePlayerRef.current.loadVideoById === 'function') {
        youtubePlayerRef.current.loadVideoById({ videoId: youtubeVideoId });
      } else {
        if (youtubePlayerRef.current && typeof youtubePlayerRef.current.destroy === 'function') {
            youtubePlayerRef.current.destroy();
        }
        try {
          youtubePlayerRef.current = new window.YT.Player(youtubePlayerContainerRef.current, {
            height: '200', width: '200', videoId: youtubeVideoId,
            playerVars: { autoplay: 0, controls: 0, modestbranding: 1, fs: 0, rel: 0 },
            events: { onReady: onPlayerReady, onStateChange: onPlayerStateChange, onError: onPlayerError },
          });
        } catch (e: any) {
          setIsYoutubeLoading(false);
          setYoutubeErrorMessage(`Falha ao inicializar o player: ${e.message || 'Erro desconhecido'}`);
        }
      }
    } else { 
      if (youtubePlayerRef.current && typeof youtubePlayerRef.current.destroy === 'function') {
        youtubePlayerRef.current.destroy();
        youtubePlayerRef.current = null;
      }
      setYoutubeVideoTitle(''); setIsYoutubePlaying(false); setIsYoutubeLoading(false); setYoutubeErrorMessage(''); setAutoplayNextVideo(false);
    }
  }, [isYouTubeApiReady, youtubeVideoId, onPlayerReady, onPlayerStateChange, onPlayerError]);

  useEffect(() => {
    const player = youtubePlayerRef.current;
    if (player && typeof player.setVolume === 'function' && youtubeVideoId) {
      player.setVolume(youtubeVolume);
    }
  }, [youtubeVolume, youtubeVideoId]);


  const loadYouTubeVideoById = useCallback((id: string) => {
    setAutoplayNextVideo(true); 
    setYoutubeVideoId(id); 
  }, []);


  const toggleYouTubePlayPause = useCallback(() => {
    const player = youtubePlayerRef.current;
    if (!player || !youtubeVideoId || typeof player.getPlayerState !== 'function') return;
    const currentState = player.getPlayerState();
    if (currentState === window.YT.PlayerState.BUFFERING && isYoutubeLoading && !youtubeErrorMessage) return;
    if (currentState === window.YT.PlayerState.PLAYING) player.pauseVideo();
    else player.playVideo();
    setAutoplayNextVideo(false); 
  }, [youtubeVideoId, isYoutubeLoading, youtubeErrorMessage]);


  const changeYouTubeVolume = useCallback((newVolume: number) => {
    setYoutubeVolume(newVolume);
  }, []);


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
                onEditSubtask={handleOpenEditSubtaskModal}
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
            onEditTaskRequest={handleOpenEditModal}
            onUpdateTaskExercise={handleUpdateTaskExercise}
            onRemoveTaskExercise={handleRemoveTaskExercise}
            onEditSubtaskExerciseRequest={handleEditSubtaskExerciseRequest}
            onUpdateSubtaskExercise={handleUpdateSubtaskExercise}
            onRemoveSubtaskExercise={handleRemoveSubtaskExercise}
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
              emoji: taskToEdit.emoji, // Pass emoji to edit form
            }}
            submitButtonText="Salvar Alterações"
            onCancel={handleCloseEditModal}
            isEditMode={true}
            formIdPrefix="edit-task-"
          />
        </Modal>
      )}

      {isEditSubtaskModalOpen && editingSubtaskInfo && (
        <Modal
          isOpen={isEditSubtaskModalOpen}
          onClose={handleCloseEditSubtaskModal}
          title="Editar Subtarefa"
        >
          <SubtaskForm
            onSubmit={handleEditSubtaskSubmit}
            initialData={{
                title: editingSubtaskInfo.subtask.title,
                exercise: editingSubtaskInfo.subtask.exercise,
            }}
            submitButtonText="Salvar Subtarefa"
            onCancel={handleCloseEditSubtaskModal}
            formIdPrefix={`edit-subtask-${editingSubtaskInfo.subtask.id}-`}
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
          position: 'absolute', top: '-9999px', left: '-9999px',
          width: '200px', height: '200px', overflow: 'hidden',
        }}
      >
        <div ref={youtubePlayerContainerRef} id="app-youtube-player-iframe-container"></div>
      </div>

       <footer className="text-center py-6 text-sm text-text_secondary-light dark:text-text_secondary-dark border-t border-border_color-light dark:border-border_color-dark">
        © {new Date().getFullYear()} ToDo. Feito com ❤️ e ✨.
      </footer>
    </div>
  );
};

export default App;