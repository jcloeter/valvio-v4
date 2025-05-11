import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import '../styles/Modal.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  actions: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, actions }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden'; // Prevent scrolling on background
    }
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = ''; // Re-enable scrolling
    };
  }, [isOpen, onClose]);
  
  // Handle click outside modal to close
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen, onClose]);
  
  // Focus trap - keep focus inside modal
  useEffect(() => {
    if (!isOpen) return;
    
    const modal = modalRef.current;
    if (!modal) return;
    
    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
    
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };
    
    modal.addEventListener('keydown', handleTabKey);
    firstElement?.focus();
    
    return () => {
      modal.removeEventListener('keydown', handleTabKey);
    };
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  // Use React Portal to render the modal outside the normal DOM hierarchy
  return ReactDOM.createPortal(
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-container" ref={modalRef}>
        <div className="modal-header">
          <h2 id="modal-title">{title}</h2>
          <button 
            className="modal-close-button" 
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <div className="modal-body">
          {children}
        </div>
        <div className="modal-footer">
          {actions}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal; 