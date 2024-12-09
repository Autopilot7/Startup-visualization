// src/components/Modal.tsx
import { ReactNode } from 'react';
import Image from 'next/image'; // Import the Image component

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  maxWidth?: string; // Optional prop to set maximum width
}

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'max-w-md', // Default max-width
}: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex justify-center items-center">
      <div
        className={`relative p-8 bg-white w-full ${maxWidth} flex flex-col rounded-lg`}
      >
        {/* Close Button (X) at the Top-Right */}
        <div
          className="absolute top-4 right-4 cursor-pointer"
          onClick={onClose}
        >
          <Image src="/close.png" alt="Close" width={14} height={14} />
        </div>

        {/* Modal Title */}
        <h2 className="text-xl font-semibold mb-4">{title}</h2>

        {/* Modal Content */}
        {children}
      </div>
    </div>
  );
};

export default Modal;