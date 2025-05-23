import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-2xl p-6 sm:p-8 w-full max-w-md transform transition-all"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        <div className="flex justify-between items-center mb-6">
          <h3 id="modal-title" className="text-xl sm:text-2xl font-semibold text-text_primary-light dark:text-text_primary-dark">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-text_secondary-light dark:text-text_secondary-dark hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            aria-label="Fechar modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <div className="mb-6 sm:mb-8">{children}</div>
        {footer && (
          <div className="flex justify-end space-x-3 border-t border-border_color-light dark:border-border_color-dark pt-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;