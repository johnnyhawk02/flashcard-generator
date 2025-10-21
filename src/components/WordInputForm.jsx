import { useState } from 'react';

const WordInputForm = ({ onWordsChange }) => {
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
  const [error, setError] = useState('');

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

    // Update parent component with valid entries
    onWordsChange(validEntries);
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
    <div className="mb-6">
      <h2 className="text-2xl font-bold mb-4">Create Your Flashcards (up to 8)</h2>
      
      <div className="space-y-4 mb-4">
        {wordEntries.map((entry, index) => (
          <div key={index} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Word {index + 1}
              </label>
              <input
                type="text"
                value={entry.word}
                onChange={(e) => handleWordChange(index, e.target.value)}
                placeholder="Enter word..."
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image {index + 1}
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(index, e.target.files[0])}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            {entry.imageUrl && (
              <div className="w-16 h-16 border border-gray-300 rounded overflow-hidden">
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
                className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Remove
              </button>
            )}
          </div>
        ))}
      </div>
      
      {wordEntries.length < 8 && (
        <button
          onClick={addEntry}
          className="mb-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Add Another Word
        </button>
      )}
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <button
        onClick={validateAndProcessWords}
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Generate Preview
      </button>
      
      <div className="mt-4 text-sm text-gray-600">
        <p>• Enter any words you want on your flashcards</p>
        <p>• Upload images for each word (PNG, JPG, GIF supported)</p>
        <p>• Images will be automatically resized to fit the cards</p>
      </div>
    </div>
  );
};

export default WordInputForm;
