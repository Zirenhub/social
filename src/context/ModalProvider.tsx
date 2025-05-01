"use client";

import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

import { BasicProfile } from "@/types/profile";

const Avatar = dynamic(() => import("../components/ui/Avatar"));

type ModalOptions = { title?: string; profile?: BasicProfile; onClose?: () => void };

type ModalContextType = {
  openModal: (content: ReactNode, options?: ModalOptions) => void;
  closeModal: () => void;
  isOpen: boolean;
};

const ModalContext = createContext<ModalContextType | null>(null);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState<ReactNode | null>(null);
  const [options, setOptions] = useState<ModalOptions>({});

  const openModal = useCallback((node: ReactNode, opts?: ModalOptions) => {
    setContent(node);
    setOptions(opts || {});
    setIsOpen(true);
  }, []);

  useEffect(() => {
    if (!isOpen && options.onClose) {
      options.onClose();
    }
  }, [isOpen, options]);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setContent(null);
  }, []);

  const contextValue = useMemo(() => ({ openModal, closeModal, isOpen }), [openModal, closeModal, isOpen]);

  return (
    <ModalContext.Provider value={contextValue}>
      {children}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={clsx(
                "flex flex-col relative w-full max-w-lg overflow-hidden bg-white dark:bg-zinc-900 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-white/10 shadow-xl",
                options.title === "Create a post" && "h-[70%] md:h-[50%]"
              )}
              onClick={(e) => e.stopPropagation()}
            >
              {options.title || options.profile ? (
                <div className="flex items-center justify-between px-6 pt-6">
                  <div className="flex items-center gap-3">
                    {options.profile && <Avatar profile={options.profile} />}
                    {options.title && (
                      <h3 className="text-lg font-semibold text-zinc-800 dark:text-white">{options.title}</h3>
                    )}
                  </div>
                  <button onClick={closeModal} className="text-zinc-500 hover:text-pink-500 cursor-pointer">
                    <X size={20} />
                  </button>
                </div>
              ) : null}
              <div className="px-6 py-4 text-zinc-800 dark:text-white flex-1">{content}</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ModalContext.Provider>
  );
};

export const useModal = (): ModalContextType => {
  const context = useContext(ModalContext);
  if (!context) throw new Error("useModal must be used within ModalProvider");
  return context;
};
