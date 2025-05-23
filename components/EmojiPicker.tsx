
import React, { useState, useRef, useEffect } from 'react';
import EmojiHappyIcon from './icons/EmojiHappyIcon';
import Button from './Button'; // Re-using Button for consistency if needed, or style directly

const PREDEFINED_EMOJIS = [
  "✨", "🚀", "🎯", "💡", "🎉", "📚", "💰", "📞", "💬", "💻", 
  "✍️", "📅", "📌", "❤️", "⭐", "🤔", "🙌", "👀", "📎", "🏠"
];

interface EmojiPickerProps {
  selectedEmoji: string | undefined;
  onEmojiSelect: (emoji: string) => void;
  onRemoveEmoji: () => void;
  buttonId: string; // For aria-controls
}

const EmojiPicker: React.FC<EmojiPickerProps> = ({ selectedEmoji, onEmojiSelect, onRemoveEmoji, buttonId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const togglePicker = () => setIsOpen(!isOpen);

  const handleSelect = (emoji: string) => {
    onEmojiSelect(emoji);
    setIsOpen(false);
  };

  const handleRemove = () => {
    onRemoveEmoji();
    setIsOpen(false);
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current && 
        !pickerRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const popoverId = `${buttonId}-popover`;

  return (
    <div className="relative inline-block"> {/* Ensure this parent is inline-block or block for correct positioning context */}
      <button
        ref={buttonRef}
        id={buttonId}
        type="button"
        onClick={togglePicker}
        className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-text_secondary-light dark:text-text_secondary-dark focus:outline-none focus:ring-2 focus:ring-teal-500/50"
        aria-label={selectedEmoji ? `Mudar emoji: ${selectedEmoji}` : "Selecionar emoji"}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-controls={popoverId}
      >
        {selectedEmoji ? (
          <span className="text-xl" role="img" aria-label={`Emoji atual: ${selectedEmoji}`}>{selectedEmoji}</span>
        ) : (
          <EmojiHappyIcon className="w-5 h-5" />
        )}
      </button>

      {isOpen && (
        <div
          id={popoverId}
          ref={pickerRef}
          className={
            "absolute z-20 mt-2 p-3 bg-surface-light dark:bg-surface-dark " +
            "border border-border_color-light dark:border-border_color-dark rounded-lg shadow-xl " +
            "w-60 sm:w-64 " + // Width: 240px on small screens, 256px on sm and up
            "left-1/2 transform -translate-x-1/2 sm:left-0 sm:transform-none" // Positioning: centered on small screens, left-aligned (default relative to button) on sm and up
          }
          role="dialog"
          aria-labelledby={`${buttonId}-label`}
        >
          <p id={`${buttonId}-label`} className="text-sm font-medium text-text_primary-light dark:text-text_primary-dark mb-2 sr-only">
            Selecione um emoji
          </p>
          <div className="grid grid-cols-5 gap-2 mb-3">
            {PREDEFINED_EMOJIS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => handleSelect(emoji)}
                className="text-2xl p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-500"
                aria-label={`Selecionar emoji ${emoji}`}
              >
                {emoji}
              </button>
            ))}
          </div>
          {selectedEmoji && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleRemove}
              className="w-full"
            >
              Remover Emoji
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default EmojiPicker;
