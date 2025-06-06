import fs from 'fs';
import path from 'path';

try {
  // Read the source data as text
  const sourceFile = path.join(process.cwd(), 'src', 'data', 'meridian_mastery_points_bilateral.json');
  const outputDir = path.join(process.cwd(), 'src', 'data', 'meridians');

  // Create output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Read file as text and replace all ': NaN' with ': null'
  let fileText = fs.readFileSync(sourceFile, 'utf8');
  const nanCount = (fileText.match(/: NaN/g) || []).length;
  if (nanCount > 0) {
    console.log(`Found ${nanCount} instances of ': NaN', replacing with ': null'`);
    fileText = fileText.replace(/: NaN/g, ': null');
  }

  // Parse the cleaned JSON
  const meridianData = JSON.parse(fileText);
  console.log(`Loaded ${meridianData.length} points from source file.`);

  // Clean the data by replacing 'NaN' string with null
  const cleanData = meridianData.map((point, idx) => {
    let sni = point.shared_name_indicator;
    if (sni === 'NaN') {
      console.log(`'NaN' string found at index ${idx}, replacing with null.`);
      sni = null;
    }
    return {
      ...point,
      shared_name_indicator: sni
    };
  });

  // Group points by meridian
  const meridianGroups = cleanData.reduce((groups, point) => {
    const meridianName = point.meridian_name.split(' ')[0].toLowerCase();
    if (!groups[meridianName]) {
      groups[meridianName] = [];
    }
    groups[meridianName].push(point);
    return groups;
  }, {});

  const groupKeys = Object.keys(meridianGroups);
  console.log(`Found ${groupKeys.length} meridian groups:`, groupKeys);
  groupKeys.forEach(key => {
    console.log(`  ${key}: ${meridianGroups[key].length} points`);
  });

  // Write each meridian group to its own file
  Object.entries(meridianGroups).forEach(([meridian, points]) => {
    const fileName = `${meridian}.json`;
    const filePath = path.join(outputDir, fileName);
    fs.writeFileSync(filePath, JSON.stringify(points, null, 2));
    console.log(`Created ${fileName} with ${points.length} points`);
  });

  // Create an index file that exports all meridians
  const indexContent = `// This file is auto-generated. Do not edit directly.\n${Object.keys(meridianGroups).map(meridian => 
    `import ${meridian} from './${meridian}.json';`
  ).join('\n')}\n\nexport const allMeridians = {\n${Object.keys(meridianGroups).map(meridian => 
    `  ${meridian}: ${meridian}`
  ).join(',\n')}\n};\n\nexport default allMeridians;\n`;

  fs.writeFileSync(path.join(outputDir, 'index.js'), indexContent);
  console.log('Created index.js with all meridian exports');

} catch (err) {
  console.error('Error during splitMeridianData.js execution:', err);
} 