const fs = require('fs');
const path = require('path');

const sourceDir = 'D:\\Meridian app';
const backupDir = 'D:\\VS Code project backup\\Meridian Mastery';

const directoryStructure = {
    src: {
        app: ['layout.tsx', 'page.tsx', 'globals.css'],
        components: {
            flashcards: ['FlashcardDisplay.tsx', 'FlashcardList.tsx', 'FlashcardStudy.tsx'],
            ui: ['Button.tsx', 'Card.tsx']
        },
        contexts: ['FlashcardContext.tsx'],
        data: ['koreanDatabase.ts', 'meridianFlashcards.ts'],
        types: ['flashcard.ts', 'statistics.ts', 'gptHints.ts'],
        utils: ['storage.ts', 'difficulty.ts']
    },
    public: {
        audio: {},
        images: {}
    }
};

function copyDirectory(source, destination) {
    if (!fs.existsSync(destination)) {
        fs.mkdirSync(destination, { recursive: true });
    }

    const files = fs.readdirSync(source);
    files.forEach(file => {
        const sourcePath = path.join(source, file);
        const destPath = path.join(destination, file);
        
        if (fs.lstatSync(sourcePath).isDirectory()) {
            copyDirectory(sourcePath, destPath);
        } else {
            fs.copyFileSync(sourcePath, destPath);
        }
    });
}

copyDirectory(sourceDir, backupDir);
