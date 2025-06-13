// Track which element theory modals have been shown in the current session
const seenModals = new Set<string>();

export const hasSeenElementModal = (element: string): boolean => {
  return seenModals.has(element.toLowerCase());
};

export const markElementModalAsSeen = (element: string): void => {
  seenModals.add(element.toLowerCase());
};

export const resetSeenModals = (): void => {
  seenModals.clear();
};

export const getSeenModals = (): string[] => {
  return Array.from(seenModals);
};

// Legacy functions for compatibility
export const shouldShowElementPopup = (meridian: string): boolean => {
  // Get element from meridian and check if modal has been seen
  const getElementFromMeridian = (meridianName: string): string => {
    if (!meridianName) return 'Metal';
    
    const normalizedName = meridianName.replace(/\s*\([^)]*\)/, '').trim();
    const elementMap: { [key: string]: string } = {
      'Lung': 'Metal', 'Large Intestine': 'Metal',
      'Heart': 'Fire', 'Small Intestine': 'Fire', 'Pericardium': 'Fire', 'Triple Heater': 'Fire', 'Triple Burner': 'Fire',
      'Stomach': 'Earth', 'Spleen': 'Earth',
      'Kidney': 'Water', 'Bladder': 'Water', 'Urinary Bladder': 'Water',
      'Liver': 'Wood', 'Gallbladder': 'Wood'
    };
    
    return elementMap[normalizedName] || 'Metal';
  };

  const element = getElementFromMeridian(meridian);
  return !hasSeenElementModal(element);
};
