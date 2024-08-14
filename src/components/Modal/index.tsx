import { X } from "lucide-react";
import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black font-mono bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white text-black p-6 rounded-lg max-w-3xl relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          aria-label="Close modal"
        >
          <X size={24} />
        </button>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
