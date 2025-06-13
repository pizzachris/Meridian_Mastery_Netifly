/**
 * Utility to track which meridian element modals have been shown in the current session
 * This prevents showing the same modal multiple times in one session
 */
class SessionModalTracker {
  constructor() {
    // Initialize an empty Set to track which meridians have shown the modal
    this.shownModals = new Set();
  }

  /**
   * Check if the modal for a specific meridian has been shown this session
   * @param {string} meridianName - The name of the meridian to check
   * @returns {boolean} - True if the modal has already been shown, false otherwise
   */
  hasSeenModal(meridianName) {
    // Normalize the meridian name to handle variations
    const normalizedName = this.normalizeMeridianName(meridianName);
    return this.shownModals.has(normalizedName);
  }

  /**
   * Mark a meridian's modal as having been shown this session
   * @param {string} meridianName - The name of the meridian to mark
   */
  markAsSeen(meridianName) {
    // Normalize the meridian name to handle variations
    const normalizedName = this.normalizeMeridianName(meridianName);
    this.shownModals.add(normalizedName);
  }

  /**
   * Reset the tracker (typically not needed as this resets on page reload)
   */
  resetTracker() {
    this.shownModals.clear();
  }

  /**
   * Normalize a meridian name to handle variations
   * @param {string} meridianName - The name to normalize
   * @returns {string} - The normalized name
   */
  normalizeMeridianName(meridianName) {
    if (!meridianName) return '';
    
    // Remove any parenthetical content (like abbreviations)
    let normalized = meridianName.replace(/\s*\([^)]*\)/, '').trim();
    
    // Handle common variations
    const variations = {
      'Urinary Bladder': 'Bladder',
      'Bladder': 'Urinary Bladder',
      'Triple Burner': 'Triple Heater',
      'Triple Heater': 'Triple Burner'
    };
    
    return variations[normalized] || normalized;
  }
}

// Create a singleton instance
const modalTracker = new SessionModalTracker();

export default modalTracker;
