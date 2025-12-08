import React, { useEffect } from "react";
import { createPortal } from "react-dom";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: string;
};

export default function Modal({
  isOpen,
  onClose,
  children,
  maxWidth = "max-w-lg",
}: ModalProps) {
  // ESC ile kapatma
  useEffect(() => {
    if (!isOpen) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // SSR / güvenlik
  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      className={`
        fixed inset-0 z-[9999]
        flex items-center justify-center
        transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]
        ${isOpen
          ? "opacity-100 pointer-events-auto bg-slate-900/40 backdrop-blur-md"
          : "opacity-0 pointer-events-none bg-slate-900/0 backdrop-blur-none"
        }
      `}
      onClick={onClose}
    >
      <div
        className={`
          glass-card relative w-full ${maxWidth}
          rounded-3xl p-7
          shadow-[0_24px_70px_rgba(15,23,42,0.55)]
          transform transition-all duration-300 
          ease-[cubic-bezier(0.22,1,0.36,1)]
          ${isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}
