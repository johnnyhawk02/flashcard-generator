import { useState } from 'react';
import wordsData from '../data/words.json';

const WordInputForm = ({ onWordsChange }) => {
  const [inputText, setInputText] = useState('');
  const [error, setError] = useState('');

  const validateAndProcessWords = () => {
    setError('');
    
    // Split by comma or newline, trim whitespace, filter empty strings
    const words = inputText
      .split(/[,\n]/)
      .map(word => word.trim())
      .filter(word => word.length > 0);

    // Validate: max 8 words
    if (words.length > 8) {
      setError('Maximum 8 words allowed');
      return;
    }

    // Validate: no empty inputs
    if (words.length === 0) {
      setError('Please enter at least one word');
      return;
    }

    // Validate: all words must be in words.json (case-insensitive)
    const validWords = [];
    const invalidWords = [];
    
    words.forEach(word => {
      const lowerWord = word.toLowerCase();
      if (wordsData[lowerWord]) {
        validWords.push(lowerWord);
      } else {
        invalidWords.push(word);
      }
    });

    if (invalidWords.length > 0) {
      setError(`Words not found: ${invalidWords.join(', ')}`);
      return;
    }

    // Update parent component with valid words
    onWordsChange(validWords);
  };

  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold mb-4">Enter Words (up to 8)</h2>
      <div className="mb-4">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Enter words separated by commas or new lines (e.g., apple, cat, dog)"
          className="w-full p-3 border border-gray-300 rounded-lg resize-none h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
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
        <p>Available words include: apple, baby, cat, dog, car, house, tree, and 54 more...</p>
      </div>
    </div>
  );
};

export default WordInputForm;
