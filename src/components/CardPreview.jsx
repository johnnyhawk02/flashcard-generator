const CardPreview = ({ wordEntries, fontSize, fontWeight }) => {
  const renderCard = (entry, index) => {
    if (!entry || !entry.word) {
      return (
        <div key={index} className="w-[295px] h-[205px] border border-dashed border-gray-400 bg-gray-50 flex items-center justify-center">
          <span className="text-gray-400 text-sm">Empty</span>
        </div>
      );
    }

    return (
      <div key={index} className="w-[295px] h-[205px] border border-dashed border-black bg-white flex items-center justify-center">
        <span className="font-lexend text-center" style={{ fontSize: `${fontSize * 0.5}px`, fontWeight: fontWeight }}>{entry.word}</span>
      </div>
    );
  };

  const renderImageCard = (entry, index) => {
    if (!entry || !entry.word) {
      return (
        <div key={index} className="w-[295px] h-[205px] border border-dashed border-gray-400 bg-gray-50 flex items-center justify-center">
          <span className="text-gray-400 text-sm">Empty</span>
        </div>
      );
    }

    return (
      <div key={index} className="w-[295px] h-[205px] border border-dashed border-black bg-white flex items-center justify-center">
        {entry.imageUrl ? (
          <img
            src={entry.imageUrl}
            alt={entry.word}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-center text-gray-500">
            <div className="text-4xl mb-2">📷</div>
            <div className="text-sm">No image</div>
          </div>
        )}
      </div>
    );
  };

  // Ensure we have exactly 8 slots (pad with empty slots if needed)
  const paddedEntries = [...wordEntries, ...Array(8 - wordEntries.length).fill(null)];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Card Preview</h2>
        <p className="text-gray-600">Preview how your flashcards will look when printed</p>
      </div>
      
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">📝</span>
          <h3 className="text-xl font-semibold text-gray-800">Word Cards</h3>
        </div>
        <div className="bg-gray-50 rounded-xl p-4 inline-block">
          <div className="grid grid-cols-2 gap-4 max-w-[620px]">
            {paddedEntries.map((entry, index) => renderCard(entry, index))}
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">🖼️</span>
          <h3 className="text-xl font-semibold text-gray-800">Picture Cards</h3>
        </div>
        <div className="bg-gray-50 rounded-xl p-4 inline-block">
          <div className="grid grid-cols-2 gap-4 max-w-[620px]">
            {paddedEntries.map((entry, index) => renderImageCard(entry, index))}
          </div>
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
        <p className="text-sm text-gray-700 font-medium">
          💡 <strong>Printing Tip:</strong> Print on A4 paper at 100% scale with no margins for best results.
        </p>
      </div>
    </div>
  );
};

export default CardPreview;
