const CardPreview = ({ wordEntries, fontSize }) => {
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
        <span className="font-lexend font-light text-center" style={{ fontSize: `${fontSize * 0.5}px` }}>{entry.word}</span>
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
    <div className="mb-6">
      <h2 className="text-2xl font-bold mb-4">Card Preview</h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Word Cards</h3>
        <div className="grid grid-cols-2 gap-4 max-w-[620px]">
          {paddedEntries.map((entry, index) => renderCard(entry, index))}
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-2">Picture Cards</h3>
        <div className="grid grid-cols-2 gap-4 max-w-[620px]">
          {paddedEntries.map((entry, index) => renderImageCard(entry, index))}
        </div>
      </div>
      
      <div className="mt-4 text-sm text-gray-600">
        <p>Print on A4, 100% scale, no margins.</p>
      </div>
    </div>
  );
};

export default CardPreview;
