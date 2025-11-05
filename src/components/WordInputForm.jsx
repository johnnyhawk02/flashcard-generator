import { useState, useEffect } from 'react';

const WordInputForm = ({ onWordsChange, initialValues }) => {
  const [wordEntries, setWordEntries] = useState([
    { word: '', image: null, imageUrl: '' },
    { word: '', image: null, imageUrl: '' },
    { word: '', image: null, imageUrl: '' },
    { word: '', image: null, imageUrl: '' },
    { word: '', image: null, imageUrl: '' },
    { word: '', image: null, imageUrl: '' },
    { word: '', image: null, imageUrl: '' },
    { word: '', image: null, imageUrl: '' }
  ]);
  const [fontSize, setFontSize] = useState(80); // Default font size for A4 cards
  const [fontWeight, setFontWeight] = useState(300); // Default font weight (Light)
  const [dpi, setDpi] = useState(300); // Default DPI for high quality
  const [error, setError] = useState('');

  // Sync with external initialValues (e.g., from batch processing)
  useEffect(() => {
    if (initialValues && initialValues.length > 0) {
      // Pad to 8 entries or trim to 8
      const paddedEntries = [...initialValues];
      while (paddedEntries.length < 8) {
        paddedEntries.push({ word: '', image: null, imageUrl: '' });
      }
      const trimmedEntries = paddedEntries.slice(0, 8);
      setWordEntries(trimmedEntries);
    }
  }, [initialValues]);

  const handleWordChange = (index, value) => {
    const updatedEntries = [...wordEntries];
    updatedEntries[index].word = value.trim();
    setWordEntries(updatedEntries);
    setError('');
  };

  const handleImageUpload = (index, file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const updatedEntries = [...wordEntries];
        updatedEntries[index].image = file;
        updatedEntries[index].imageUrl = e.target.result;
        
        // If word field is empty, populate it with filename (minus extension)
        if (!updatedEntries[index].word.trim()) {
          const filename = file.name;
          const nameWithoutExtension = filename.replace(/\.[^/.]+$/, '');
          updatedEntries[index].word = nameWithoutExtension;
        }
        
        setWordEntries(updatedEntries);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateAndProcessWords = () => {
    setError('');
    
    // Filter out empty entries
    const validEntries = wordEntries.filter(entry => entry.word.trim() !== '');
    
    if (validEntries.length === 0) {
      setError('Please enter at least one word');
      return;
    }

    if (validEntries.length > 8) {
      setError('Maximum 8 words allowed');
      return;
    }

    // Check for duplicate words
    const words = validEntries.map(entry => entry.word.toLowerCase());
    const uniqueWords = [...new Set(words)];
    if (words.length !== uniqueWords.length) {
      setError('Duplicate words are not allowed');
      return;
    }

    // Update parent component with valid entries, font size, font weight, and DPI
    onWordsChange(validEntries, fontSize, fontWeight, dpi);
  };

  const addEntry = () => {
    if (wordEntries.length < 8) {
      setWordEntries([...wordEntries, { word: '', image: null, imageUrl: '' }]);
    }
  };

  const removeEntry = (index) => {
    if (wordEntries.length > 1) {
      const updatedEntries = wordEntries.filter((_, i) => i !== index);
      setWordEntries(updatedEntries);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Create Your Flashcards</h2>
        <p className="text-gray-600">Add up to 8 words with optional images</p>
      </div>
      
      <div className="space-y-3 mb-6">
        {wordEntries.map((entry, index) => (
          <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-300 transition-colors">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm mt-1">
              {index + 1}
            </div>
            
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Word
                </label>
                <input
                  type="text"
                  value={entry.word}
                  onChange={(e) => handleWordChange(index, e.target.value)}
                  placeholder="Enter word..."
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Image
                </label>
                <label className="block w-full p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 cursor-pointer transition-all text-center">
                  <span className="text-sm text-gray-600">
                    {entry.imageUrl ? 'Change Image' : 'Click to upload'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(index, e.target.files[0])}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
            
            {entry.imageUrl && (
              <div className="flex-shrink-0 w-20 h-20 border-2 border-gray-300 rounded-lg overflow-hidden shadow-sm">
                <img
                  src={entry.imageUrl}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            {wordEntries.length > 1 && (
              <button
                onClick={() => removeEntry(index)}
                className="flex-shrink-0 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 shadow-sm transition-all mt-7"
                title="Remove this entry"
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>
      
      {wordEntries.length < 8 && (
        <button
          onClick={addEntry}
          className="mb-6 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 font-medium transition-all shadow-sm"
        >
          + Add Another Word
        </button>
      )}
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg">
          <div className="flex items-center">
            <span className="text-xl mr-2">⚠️</span>
            <span className="font-medium">{error}</span>
          </div>
        </div>
      )}
      
      <div className="border-t border-gray-200 pt-6 mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Typography Settings</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-blue-50 rounded-xl p-5">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Font Size: <span className="text-blue-600">{fontSize}px</span>
            </label>
            <input
              type="range"
              min="20"
              max="100"
              value={fontSize}
              onChange={(e) => setFontSize(parseInt(e.target.value))}
              className="w-full h-3 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>20px</span>
              <span>100px</span>
            </div>
          </div>
          
          <div className="bg-purple-50 rounded-xl p-5">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Font Weight: <span className="text-purple-600">{fontWeight} ({fontWeight <= 300 ? 'Light' : fontWeight <= 400 ? 'Normal' : fontWeight <= 600 ? 'Medium' : 'Bold'})</span>
            </label>
            <input
              type="range"
              min="100"
              max="900"
              step="100"
              value={fontWeight}
              onChange={(e) => setFontWeight(parseInt(e.target.value))}
              className="w-full h-3 bg-purple-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>100</span>
              <span>900</span>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 rounded-xl p-5">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Export Quality (DPI)
          </label>
          <div className="flex gap-6">
            <label className="flex items-center cursor-pointer p-3 rounded-lg hover:bg-green-100 transition-colors">
              <input
                type="radio"
                name="dpi"
                value="150"
                checked={dpi === 150}
                onChange={(e) => setDpi(parseInt(e.target.value))}
                className="mr-3 w-4 h-4 accent-green-600"
              />
              <div>
                <div className="font-medium text-gray-800">150 DPI</div>
                <div className="text-xs text-gray-600">Standard quality</div>
              </div>
            </label>
            <label className="flex items-center cursor-pointer p-3 rounded-lg hover:bg-green-100 transition-colors">
              <input
                type="radio"
                name="dpi"
                value="300"
                checked={dpi === 300}
                onChange={(e) => setDpi(parseInt(e.target.value))}
                className="mr-3 w-4 h-4 accent-green-600"
              />
              <div>
                <div className="font-medium text-gray-800">300 DPI</div>
                <div className="text-xs text-gray-600">High quality (recommended)</div>
              </div>
            </label>
          </div>
        </div>
      </div>
      
      <button
        onClick={validateAndProcessWords}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-lg hover:shadow-xl transition-all text-lg"
      >
        ✨ Generate Preview
      </button>
    </div>
  );
};

export default WordInputForm;
