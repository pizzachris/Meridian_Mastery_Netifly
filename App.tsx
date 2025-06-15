import { FlashcardProvider } from './contexts/FlashcardContext';
import { TestPage } from './pages/TestPage';

function App() {
    return (
        <FlashcardProvider>
            <TestPage />
        </FlashcardProvider>
    );
}

export default App;
