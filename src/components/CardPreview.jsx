import wordsData from '../data/words.json';

const CardPreview = ({ words }) => {
  const getImagePath = (word) => {
    return wordsData[word] || '/placeholder.png';
  };

  const renderCard = (word, index) => {
    if (!word) {
      return (
        <div key={index} className="w-[295px] h-[205px] border border-dashed border-gray-400 bg-gray-50 flex items-center justify-center">
          <span className="text-gray-400 text-sm">Empty</span>
        </div>
      );
    }

    return (
      <div key={index} className="w-[295px] h-[205px] border border-dashed border-black bg-white flex items-center justify-center">
        <span className="font-lexend font-light text-3xl text-center">{word}</span>
      </div>
    );
  };

  const renderImageCard = (word, index) => {
    if (!word) {
      return (
        <div key={index} className="w-[295px] h-[205px] border border-dashed border-gray-400 bg-gray-50 flex items-center justify-center">
          <span className="text-gray-400 text-sm">Empty</span>
        </div>
      );
    }

    return (
      <div key={index} className="w-[295px] h-[205px] border border-dashed border-black bg-white flex items-center justify-center p-4">
        <img
          src={getImagePath(word)}
          alt={word}
          className="max-w-full max-h-full object-contain"
          onError={(e) => {
            e.target.src = '/placeholder.png';
          }}
        />
      </div>
    );
  };

  // Ensure we have exactly 8 slots (pad with empty slots if needed)
  const paddedWords = [...words, ...Array(8 - words.length).fill(null)];

  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold mb-4">Card Preview</h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Word Cards</h3>
        <div className="grid grid-cols-2 gap-4 max-w-[620px]">
          {paddedWords.map((word, index) => renderCard(word, index))}
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-2">Picture Cards</h3>
        <div className="grid grid-cols-2 gap-4 max-w-[620px]">
          {paddedWords.map((word, index) => renderImageCard(word, index))}
        </div>
      </div>
      
      <div className="mt-4 text-sm text-gray-600">
        <p>Print on A4, 100% scale, no margins.</p>
      </div>
    </div>
  );
};

export default CardPreview;
