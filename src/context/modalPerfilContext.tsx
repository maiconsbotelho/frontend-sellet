"use client";

import React, { createContext, useContext, useState } from "react";

interface ModalContextType {
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const ModalPerfilContext = createContext<ModalContextType | undefined>(undefined);

export const ModalPerfilProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <ModalPerfilContext.Provider value={{ isModalOpen, openModal, closeModal }}>{children}</ModalPerfilContext.Provider>
  );
};

export const useModal = (): ModalContextType => {
  const context = useContext(ModalPerfilContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};
