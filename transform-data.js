// Transform the full workbook data to match the app's flashcard format
const fs = require('fs');
const path = require('path');

// Read the full workbook data
const workbookPath = 'c:/Users/pizza/Downloads/Meridian_Mastery_FULL_WORKBOOK_FINAL_REVIEW.json';
const outputPath = './src/data/flashcards.json';

try {
  console.log('Reading workbook data...');
  const workbookData = JSON.parse(fs.readFileSync(workbookPath, 'utf8'));
  const allPoints = workbookData['All Points (Master)'];
  
  console.log(`Found ${allPoints.length} points in workbook`);
  
  // Transform each point to match the app format
  const transformedFlashcards = allPoints.map((point, index) => {
    // Extract meridian name and element mapping
    const meridianName = point['Meridian Name'];
    let meridian = '';
    let element = '';
    
    // Map meridians to elements based on TCM theory
    if (meridianName.includes('Lung')) {
      meridian = 'Lung';
      element = 'metal';
    } else if (meridianName.includes('Large Intestine')) {
      meridian = 'Large Intestine';
      element = 'metal';
    } else if (meridianName.includes('Stomach')) {
      meridian = 'Stomach';
      element = 'earth';
    } else if (meridianName.includes('Spleen')) {
      meridian = 'Spleen';
      element = 'earth';
    } else if (meridianName.includes('Heart') && !meridianName.includes('Small')) {
      meridian = 'Heart';
      element = 'fire';
    } else if (meridianName.includes('Small Intestine')) {
      meridian = 'Small Intestine';
      element = 'fire';
    } else if (meridianName.includes('Bladder')) {
      meridian = 'Bladder';
      element = 'water';
    } else if (meridianName.includes('Kidney')) {
      meridian = 'Kidney';
      element = 'water';
    } else if (meridianName.includes('Pericardium')) {
      meridian = 'Pericardium';
      element = 'fire';
    } else if (meridianName.includes('Triple')) {
      meridian = 'Triple Heater';
      element = 'fire';
    } else if (meridianName.includes('Gallbladder')) {
      meridian = 'Gallbladder';
      element = 'wood';
    } else if (meridianName.includes('Liver')) {
      meridian = 'Liver';
      element = 'wood';
    } else if (meridianName.includes('Governing')) {
      meridian = 'Governing Vessel';
      element = 'extraordinary';
    } else if (meridianName.includes('Conception')) {
      meridian = 'Conception Vessel';
      element = 'extraordinary';
    } else {
      meridian = meridianName;
      element = 'other';
    }
    
    return {
      id: index + 1,
      number: point['Point Number'],
      nameHangul: point['Korean Name (Hangul)'],
      nameRomanized: point['Romanized Korean'],
      nameEnglish: point['English Translation (Verified)'],
      meridian: meridian,
      element: element,
      location: point['Anatomical Location'],
      healingFunction: point['Healing Function'],
      martialApplication: point['Martial Application'],
      insight: `Traditional pressure point from ${meridian} meridian with both healing and martial applications`,
      tcmActions: [point['Healing Function'].split(',')[0].trim()], // Extract first action
      indications: [] // Empty array as workbook doesn't have specific indications format
    };
  });
  
  // Create the final flashcards object
  const flashcardsData = {
    flashcards: transformedFlashcards
  };
  
  // Write to the app's data file
  fs.writeFileSync(outputPath, JSON.stringify(flashcardsData, null, 2));
  
  console.log(`✅ Successfully transformed ${transformedFlashcards.length} points`);
  console.log(`📁 Saved to: ${outputPath}`);
  console.log('🔄 Ready to rebuild and deploy!');
  
} catch (error) {
  console.error('❌ Error transforming data:', error.message);
  process.exit(1);
}
