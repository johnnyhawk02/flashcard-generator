import { useState } from 'react';
import WordInputForm from './components/WordInputForm';
import CardPreview from './components/CardPreview';
import A4Canvas from './components/A4Canvas';
import './App.css';

function App() {
  const [wordEntries, setWordEntries] = useState([]);
  const [fontSize, setFontSize] = useState(70);
  const [dpi, setDpi] = useState(300);

  const handleWordsChange = (newWordEntries, newFontSize, newDpi) => {
    setWordEntries(newWordEntries);
    if (newFontSize !== undefined) setFontSize(newFontSize);
    if (newDpi !== undefined) setDpi(newDpi);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Flashcard Generator
          </h1>
          <p className="text-lg text-gray-600">
            Generate printable flashcards for See and Learn (DSE) words
          </p>
        </header>

        <main className="space-y-8">
          <WordInputForm onWordsChange={handleWordsChange} />
          
          {wordEntries.length > 0 && (
            <>
              <CardPreview wordEntries={wordEntries} fontSize={fontSize} />
              <A4Canvas wordEntries={wordEntries} fontSize={fontSize} dpi={dpi} />
            </>
          )}
        </main>

        <footer className="mt-12 text-center text-gray-500 text-sm">
          <p>Designed for A4 printing • 8 cards per sheet • 150 DPI output</p>
        </footer>
      </div>
    </div>
  );
}

export default App;