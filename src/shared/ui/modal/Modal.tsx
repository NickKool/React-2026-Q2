import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      modalRef.current?.focus();
      document.body.style.overflow = 'hidden'; 
    } else {
      document.body.style.overflow = '';
      previousFocusRef.current?.focus();
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose} 
    >
      <div 
        ref={modalRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="relative w-full max-w-lg rounded-lg bg-white p-6 shadow-xl outline-none"
        onClick={(e) => e.stopPropagation()} 
      >
        <div className="flex items-center justify-between border-b pb-3">
          <h3 id="modal-title" className="text-xl font-semibold text-gray-900">{title}</h3>
          <button 
            onClick={onClose}
            className="rounded-md text-gray-400 hover:text-gray-600 focus:ring-2 focus:ring-blue-500 p-1"
            aria-label="Close the modal window"
          >
            ✕
          </button>
        </div>
        <div className="mt-4 max-h-[70vh] overflow-y-auto pr-1">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};
