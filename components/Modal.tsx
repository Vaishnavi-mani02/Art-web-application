
import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white border border-brand-border rounded-lg shadow-2xl w-full max-w-lg m-4 p-6 relative animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-serif font-bold text-brand-text">{title}</h2>
          <button
            onClick={onClose}
            className="text-rose-400 hover:text-brand-primary transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        <div className="text-brand-text">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
