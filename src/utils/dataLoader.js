import allPointsData from '../data/meridian_mastery_points_bilateral.json';
import maekChiKiData from '../data/maek_chi_ki.json';
import maekChaKiData from '../data/maek_cha_ki.json';

// Helper function to get element from meridian name
const getElementFromMeridian = (meridianName) => {
  if (!meridianName) return 'earth'; // Default to earth (gold color)
  
  // Normalize the meridian name by removing parentheses and codes
  const normalizedName = meridianName.replace(/\s*\([^)]*\)/, '').trim();
  
  const elementMap = {
    'Lung': 'metal',
    'Large Intestine': 'metal',
    'Stomach': 'earth',
    'Spleen': 'earth',
    'Heart': 'fire',
    'Small Intestine': 'fire',
    'Bladder': 'water',
    'Urinary Bladder': 'water',
    'Kidney': 'water',
    'Pericardium': 'fire',
    'Triple Heater': 'fire',
    'Triple Warmer': 'fire',
    'Gallbladder': 'wood',
    'Liver': 'wood',
    'Governing Vessel': 'extraordinary',
    'Conception Vessel': 'extraordinary',
    'Governing': 'extraordinary',
    'Conception': 'extraordinary'
  };
  
  return elementMap[normalizedName] || 'earth'; // Default to earth for unknown meridians
};

// Transform simple point data to flashcard format (for Maek Chi Ki and Maek Cha Ki)
const transformSimpleToFlashcards = (data) => {
  console.log('transformSimpleToFlashcards called with:', data);
  console.log('Data type:', typeof data);
  console.log('Is array:', Array.isArray(data));
  
  if (!data) {
    console.error('Data is undefined or null');
    return [];
  }
  
  if (!Array.isArray(data)) {
    console.error('Invalid data format: expected array, got:', typeof data);
    return [];
  }

  try {
    const result = data.map((point, index) => {
      try {
        if (!point) {
          console.warn(`Point at index ${index} is undefined/null`);
          return null;
        }
        
        // Handle both formats: complex format from bilateral JSON and simple format
        let transformedPoint;
        
        if (point['Point Number'] || point['Meridian Name']) {
          // Complex format from bilateral JSON
          transformedPoint = {
            id: point.id || index + 1,
            point_number: point['Point Number'] || '',
            hangul: point['Korean Name (Hangul)'] || '',
            romanized: point['Romanized Korean'] || '',
            english: point['English Translation (Verified)'] || '',
            meridian: point['Meridian Name'] ? point['Meridian Name'].replace(/\s*\([^)]*\)/, '').trim() : '',
            element: point.Element || getElementFromMeridian(point['Meridian Name']),
            bilateral: point.Bilateral === "Yes" || point.Bilateral === true,
            insight: point.Insight || '',
            location: point['Anatomical Location'] || '',
            healingFunction: point['Healing Function'] || '',
            martialApplication: point['Martial Application'] || '',
          };
        } else {
          // Simple format already has the correct field names
          transformedPoint = {
            id: point.id || index + 1,
            point_number: point.point_number || '',
            hangul: point.hangul || '',
            romanized: point.romanized || '',
            english: point.english || '',
            meridian: point.meridian || '',
            element: point.element || 'earth',
            bilateral: point.bilateral === "Yes" || point.bilateral === true,
            insight: point.insight || '',
          };
        }

        // Legacy support - also include the original field names for backward compatibility
        transformedPoint.number = transformedPoint.point_number;
        transformedPoint.nameHangul = transformedPoint.hangul;
        transformedPoint.nameRomanized = transformedPoint.romanized;
        transformedPoint.nameEnglish = transformedPoint.english;
        
        return transformedPoint;
      } catch (error) {
        console.error(`Error transforming point at index ${index}:`, error, point);
        return null;
      }
    }).filter(Boolean);
    
    console.log('transformSimpleToFlashcards result:', result);
    return result;
  } catch (error) {
    console.error('Error in transformSimpleToFlashcards:', error);
    return [];
  }
};

// Transform point data to flashcard format
const transformToFlashcards = (data) => {
  if (!Array.isArray(data)) {
    console.error('Invalid data format: expected array');
    return [];
  }

  return data.map((point, index) => {
    try {
      // The data comes from the new bilateral JSON structure
      const transformedPoint = {
        id: point.id || index + 1,        // Map to the expected field names
        point_number: point['Point Number'] || '',
        hangul: point['Korean Name (Hangul)'] || '',
        romanized: point['Romanized Korean'] || '',
        english: point['English Translation (Verified)'] || '',
        meridian: point['Meridian Name'] ? point['Meridian Name'].replace(/\s*\([^)]*\)/, '').trim() : '',
        element: point.Element || getElementFromMeridian(point['Meridian Name']),
        location: point['Anatomical Location'] || '',
        healingFunction: point['Healing Function'] || '',
        martialApplication: point['Martial Application'] || '',
        bilateral: point.Bilateral === "Yes",
        sharedNameIndicator: point['Shared Name Indicator'] || null,
        insight: point.Insight || '',
        // Legacy support - also include the original field names for backward compatibility
        number: point['Point Number'] || '',
        nameHangul: point['Korean Name (Hangul)'] || '',
        nameRomanized: point['Romanized Korean'] || '',
        nameEnglish: point['English Translation (Verified)'] || '',
      };

      return transformedPoint;
    } catch (error) {
      console.error('Error transforming point:', error);
      return null;
    }
  }).filter(Boolean);
};

// Define regions based on common meridian groupings
const regionMap = {
  'Lung (LU)': 'Arm',
  'Large Intestine (LI)': 'Arm',
  'Stomach (ST)': 'Leg',
  'Spleen (SP)': 'Leg',
  'Heart (HT)': 'Arm',
  'Small Intestine (SI)': 'Arm',
  'Urinary Bladder (UB)': 'Back', // UB channel runs along back and leg
  'Kidney (KI)': 'Leg', // KI channel runs along leg and abdomen/chest
  'Pericardium (PC)': 'Arm',
  'Triple Burner (TB)': 'Arm',
  'Gallbladder (GB)': 'Leg', // GB channel runs along head and leg
  'Liver (LV)': 'Leg',
  'Conception Vessel (CV)': 'Trunk', // Midline
  'Governing Vessel (GV)': 'Back', // Midline
};

// Function to get points by meridian name
export const getPointsByMeridian = (meridianName) => {
  console.log('getPointsByMeridian called with:', meridianName);
  
  if (meridianName === 'All') {
    return transformToFlashcards(allPointsData);
  }
  
  // Filter the raw data first, then transform
  const filteredData = allPointsData.filter(point => {
    const pointMeridianName = point['Meridian Name'] || '';
    // Direct exact match - no processing needed since the meridian names from Daily Session match exactly
    const isMatch = pointMeridianName === meridianName;
    if (isMatch) {
      console.log('Found matching point:', point['Point Number'], 'for meridian:', meridianName);
    }
    return isMatch;
  });
  
  console.log(`Found ${filteredData.length} points for meridian: ${meridianName}`);
  
  // Sort by point number to ensure anatomical order (e.g., LU1, LU2, LU3...)
  filteredData.sort((a, b) => {
    const aNum = parseInt(a['Point Number']?.match(/\d+/)?.[0] || '0');
    const bNum = parseInt(b['Point Number']?.match(/\d+/)?.[0] || '0');
    return aNum - bNum;
  });
  
  return transformToFlashcards(filteredData);
};

// Function to get points by region
export const getPointsByRegion = (regionName) => {
  if (regionName === 'All') {
    return allPointsData;
  }
  return allPointsData.filter(point => regionMap[point.meridian_name] === regionName);
};

// Function to get points by theme (currently not supported by data structure)
export const getPointsByTheme = (themeName) => {
  // Need to determine how themes are defined in the JSON if needed
  console.warn(`Theme filtering not yet implemented for theme: ${themeName}`);
  return []; // Return empty array or all data, depending on desired behavior
};

// Function to get Maek Chi Ki points
export const getMaekChiKiPoints = () => {
  // Load data directly from the imported JSON for Maek Chi Ki (already in simplified format)
  console.log('getMaekChiKiPoints called, data:', maekChiKiData);
  console.log('maekChiKiData type:', typeof maekChiKiData);
  console.log('maekChiKiData is array:', Array.isArray(maekChiKiData));
  const result = transformSimpleToFlashcards(maekChiKiData);
  console.log('transformSimpleToFlashcards result:', result);
  return result;
};

// Function to get Maek Cha Ki points
export const getMaekChaKiPoints = () => {
    // Load data directly from the imported JSON for Maek Cha Ki (already in simplified format)
    return transformSimpleToFlashcards(maekChaKiData);
};

// Placeholder for future functions (e.g., getPointsBySearch)
export const getPointsBySearch = (query) => {
  // Implement search logic if needed
  console.warn(`Search functionality not yet implemented for query: ${query}`);
  return []; // Return empty array or all data
};

// Get all points
export const getAllPoints = () => {
  try {
    // Load data directly from the imported JSON
    if (!allPointsData || !Array.isArray(allPointsData)) {
      console.error('allPointsData is not available or not an array:', allPointsData)
      return []
    }
    return transformToFlashcards(allPointsData);
  } catch (error) {
    console.error('Error in getAllPoints:', error)
    return []
  }
};

// Get meridian colors based on Five Elements
export const getMeridianColor = (meridian) => {
  const colors = {
    Lung: '#FFD700', // Gold
    'Large Intestine': '#FFD700', // Gold
    Stomach: '#FFA500', // Orange
    Spleen: '#FFA500', // Orange
    Heart: '#FF0000', // Red
    'Small Intestine': '#FF0000', // Red
    Bladder: '#0000FF', // Blue
    Kidney: '#0000FF', // Blue
    Pericardium: '#FF0000', // Red
    'Triple Warmer': '#FF0000', // Red
    Gallbladder: '#00FF00', // Green
    Liver: '#00FF00', // Green
    'Governing Vessel': '#800080', // Purple
    'Conception Vessel': '#800080' // Purple
  };
  
  // Normalize the meridian name for lookup
  const normalizedMeridian = meridian.replace(/\s*\([^)]*\)/, '').trim();

  return colors[normalizedMeridian] || '#FFFFFF';
};

// Get all meridians
export const getAllMeridians = () => {
  try {
    // Extract unique meridian names from the full dataset
    const meridians = new Set(allPointsData.map(point => point.meridian_name?.replace(/\s*\([^)]*\)/, '').trim()).filter(Boolean));
    return Array.from(meridians);
  } catch (error) {
    console.error('Error getting meridians:', error);
    return [];
  }
};

// Get all body regions
export const getAllRegions = () => {
  return ['head', 'chest', 'abdomen', 'arms', 'legs'];
};

// Get all themes
export const getAllThemes = () => {
  return ['healing', 'martial', 'maek-chi-ki', 'maek-cha-ki'];
};

// Get point by ID
export const getPointById = (id) => {
  if (!id) return null;

  try {
    // Find the point in the full dataset by ID
    const point = allPointsData.find(p => p.id === id);
    return point ? transformToFlashcards([point])[0] : null;
  } catch (error) {
    console.error(`Error getting point with ID ${id}:`, error);
    return null;
  }
};

// Get points by element
export const getPointsByElement = (element) => {
  if (!element) return [];

  try {
    // Filter by element from the full dataset
    const filtered = allPointsData.filter(point => 
      getElementFromMeridian(point.meridian_name).toLowerCase() === element.toLowerCase()
    );
    return transformToFlashcards(filtered);
  } catch (error) {
    console.error(`Error getting points for element ${element}:`, error);
    return [];
  }
};

// Get all elements
export const getAllElements = () => {
  try {
    const elements = new Set(allPointsData.map(point => getElementFromMeridian(point.meridian_name)).filter(element => element !== 'unknown'));
    return Array.from(elements);
  } catch (error) {
    console.error('Error getting elements:', error);
    return [];
  }
}; 