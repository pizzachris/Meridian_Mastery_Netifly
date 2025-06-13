import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SettingsContextType {
  showElementTheoryModal: boolean;
  setShowElementTheoryModal: (show: boolean) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [showElementTheoryModal, setShowElementTheoryModal] = useState<boolean>(true);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('meridianMasterySettings');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        if (typeof settings.showElementTheoryModal === 'boolean') {
          setShowElementTheoryModal(settings.showElementTheoryModal);
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    const settings = {
      showElementTheoryModal
    };
    localStorage.setItem('meridianMasterySettings', JSON.stringify(settings));
  }, [showElementTheoryModal]);

  const value = {
    showElementTheoryModal,
    setShowElementTheoryModal
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
