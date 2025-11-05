import { useRef, useEffect } from 'react';

const A4Canvas = ({ wordEntries, fontSize, fontWeight = 300, dpi = 300, batchNumber, autoDownload = false, onCanvasDataReady }) => {
  const wordsCanvasRef = useRef(null);
  const picturesCanvasRef = useRef(null);

  // Calculate dimensions based on DPI
  const getDimensions = () => {
    const currentDpi = dpi;
    const margin = 30;
    const gap = 30;
    
    if (currentDpi === 300) {
      const width = 2480;
      const height = 3508;
      // Calculate card dimensions to fill available space perfectly
      // 2 columns: available width = width - 2*margin - gap = 2480 - 60 - 30 = 2390
      // Each card width = 2390 / 2 = 1195
      // 4 rows: available height = height - 2*margin - 3*gap = 3508 - 60 - 90 = 3358
      // Distribute any remainder evenly across cards
      const availableWidth = width - 2 * margin - gap;
      const availableHeight = height - 2 * margin - 3 * gap;
      const cardWidth = Math.floor(availableWidth / 2);
      const cardHeight = Math.floor(availableHeight / 4);
      const widthRemainder = availableWidth - (cardWidth * 2);
      const heightRemainder = availableHeight - (cardHeight * 4);
      
      return {
        width: width,
        height: height,
        cardWidth: cardWidth, // Base width, remainder added to last column
        cardHeight: cardHeight, // Base height, remainder added to last row
        fontSize: fontSize * 2,
        margin: margin,
        gap: gap,
        widthRemainder: widthRemainder,
        heightRemainder: heightRemainder
      };
    } else {
      const width = 1240;
      const height = 1754;
      // Calculate card dimensions to fill available space perfectly
      const availableWidth = width - 2 * margin - gap;
      const availableHeight = height - 2 * margin - 3 * gap;
      const cardWidth = Math.floor(availableWidth / 2);
      const cardHeight = Math.floor(availableHeight / 4);
      const widthRemainder = availableWidth - (cardWidth * 2);
      const heightRemainder = availableHeight - (cardHeight * 4);
      
      return {
        width: width,
        height: height,
        cardWidth: cardWidth, // Base width, remainder added to last column
        cardHeight: cardHeight, // Base height, remainder added to last row
        fontSize: fontSize,
        margin: margin,
        gap: gap,
        widthRemainder: widthRemainder,
        heightRemainder: heightRemainder
      };
    }
  };

  // Draw word cards on canvas
  const drawWordCards = async () => {
    const canvas = wordsCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dimensions = getDimensions();
    
    // Set canvas size
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    // Fill white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, dimensions.width, dimensions.height);

    // Load font
    await document.fonts.load(`${fontWeight} ${dimensions.fontSize}px Lexend`);
    
    // Pad entries to 8
    const paddedEntries = [...wordEntries, ...Array(8 - wordEntries.length).fill(null)];

    // Draw 8 cards (2 columns x 4 rows)
    for (let i = 0; i < 8; i++) {
      const col = i % 2;
      const row = Math.floor(i / 2);
      
      // Calculate actual card dimensions accounting for remainders
      let actualCardWidth = dimensions.cardWidth;
      let actualCardHeight = dimensions.cardHeight;
      
      // Add remainder to last column to fill width
      if (col === 1 && dimensions.widthRemainder > 0) {
        actualCardWidth = dimensions.cardWidth + dimensions.widthRemainder;
      }
      
      // Add remainder to last row to fill height
      if (row === 3 && dimensions.heightRemainder > 0) {
        actualCardHeight = dimensions.cardHeight + dimensions.heightRemainder;
      }
      
      const x = dimensions.margin + col * (dimensions.cardWidth + dimensions.gap);
      const y = dimensions.margin + row * (dimensions.cardHeight + dimensions.gap);

      // Draw dashed border
      ctx.strokeStyle = '#000000';
      ctx.setLineDash([10, 5]);
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, actualCardWidth, actualCardHeight);
      ctx.setLineDash([]);

      // Draw word if exists
      if (paddedEntries[i] && paddedEntries[i].word) {
        ctx.fillStyle = '#000000';
        ctx.font = `${fontWeight} ${dimensions.fontSize}px Lexend`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle'; // This centers text vertically!
        
        const textX = x + actualCardWidth / 2;
        const textY = y + actualCardHeight / 2;
        
        ctx.fillText(paddedEntries[i].word, textX, textY);
      }
    }
  };

  // Draw picture cards on canvas
  const drawPictureCards = async () => {
    const canvas = picturesCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dimensions = getDimensions();
    
    // Set canvas size
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    // Fill white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, dimensions.width, dimensions.height);

    // Pad entries to 8
    const paddedEntries = [...wordEntries, ...Array(8 - wordEntries.length).fill(null)];

    // Draw 8 cards (2 columns x 4 rows)
    for (let i = 0; i < 8; i++) {
      const col = i % 2;
      const row = Math.floor(i / 2);
      
      // Calculate actual card dimensions accounting for remainders
      let actualCardWidth = dimensions.cardWidth;
      let actualCardHeight = dimensions.cardHeight;
      
      // Add remainder to last column to fill width
      if (col === 1 && dimensions.widthRemainder > 0) {
        actualCardWidth = dimensions.cardWidth + dimensions.widthRemainder;
      }
      
      // Add remainder to last row to fill height
      if (row === 3 && dimensions.heightRemainder > 0) {
        actualCardHeight = dimensions.cardHeight + dimensions.heightRemainder;
      }
      
      const x = dimensions.margin + col * (dimensions.cardWidth + dimensions.gap);
      const y = dimensions.margin + row * (dimensions.cardHeight + dimensions.gap);

      // Draw dashed border
      ctx.strokeStyle = '#000000';
      ctx.setLineDash([10, 5]);
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, actualCardWidth, actualCardHeight);
      ctx.setLineDash([]);

      // Draw image if exists
      if (paddedEntries[i] && paddedEntries[i].imageUrl) {
        try {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          
          await new Promise((resolve, reject) => {
            img.onload = () => {
              // Calculate dimensions to fill width and crop top/bottom
              const cardAspect = actualCardWidth / actualCardHeight;
              const imgAspect = img.width / img.height;
              
              let drawWidth, drawHeight, drawX, drawY;
              
              if (imgAspect > cardAspect) {
                // Image is wider than card - fit height, crop sides
                drawHeight = actualCardHeight;
                drawWidth = drawHeight * imgAspect;
                drawX = x - (drawWidth - actualCardWidth) / 2;
                drawY = y;
              } else {
                // Image is taller than card - fit width, crop top/bottom
                drawWidth = actualCardWidth;
                drawHeight = drawWidth / imgAspect;
                drawX = x;
                drawY = y - (drawHeight - actualCardHeight) / 2;
              }
              
              // Clip to card boundaries
              ctx.save();
              ctx.beginPath();
              ctx.rect(x, y, actualCardWidth, actualCardHeight);
              ctx.clip();
              
              ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
              ctx.restore();
              
              resolve();
            };
            img.onerror = reject;
            img.src = paddedEntries[i].imageUrl;
          });
        } catch (error) {
          console.error('Error loading image:', error);
        }
      }
    }
  };

  // Redraw canvases when inputs change
  useEffect(() => {
    const drawAndStore = async () => {
      await drawWordCards();
      await drawPictureCards();
      
      // Store canvas data for PDF compilation
      if (onCanvasDataReady && batchNumber !== undefined && wordsCanvasRef.current && picturesCanvasRef.current) {
        const wordsDataUrl = wordsCanvasRef.current.toDataURL('image/png');
        const picturesDataUrl = picturesCanvasRef.current.toDataURL('image/png');
        onCanvasDataReady(batchNumber, wordsDataUrl, picturesDataUrl);
      }
    };
    
    drawAndStore();
  }, [wordEntries, fontSize, fontWeight, dpi, batchNumber, onCanvasDataReady]);

  // Auto-download when batch number changes in batch mode
  useEffect(() => {
    if (autoDownload && batchNumber !== undefined && wordEntries.length > 0) {
      // Wait for canvases to be drawn, then download
      const downloadTimer = setTimeout(() => {
        const batchSuffix = batchNumber !== undefined ? `_Batch${batchNumber + 1}` : '';
        downloadPNG(wordsCanvasRef, `Words_A4${batchSuffix}.png`);
        setTimeout(() => {
          downloadPNG(picturesCanvasRef, `Pictures_A4${batchSuffix}.png`);
        }, 500); // Small delay between downloads
      }, 1000); // Wait 1 second for canvas to render

      return () => clearTimeout(downloadTimer);
    }
  }, [batchNumber, wordEntries.length, autoDownload]);

  const downloadPNG = (canvasRef, filename) => {
    if (!canvasRef.current) return;

    try {
      const link = document.createElement('a');
      link.download = filename;
      link.href = canvasRef.current.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error downloading PNG:', error);
      alert('Error downloading PNG. Please try again.');
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Download Your Flashcards</h2>
        <p className="text-gray-600">Download high-quality PNG files ready for printing</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <button
          onClick={() => {
            const batchSuffix = batchNumber !== undefined ? `_Batch${batchNumber + 1}` : '';
            downloadPNG(wordsCanvasRef, `Words_A4${batchSuffix}.png`);
          }}
          className="group bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-300 shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          disabled={wordEntries.length === 0}
        >
          <span className="text-2xl">📝</span>
          <span>Download Words PNG</span>
          <span className="text-lg group-hover:translate-x-1 transition-transform">↓</span>
        </button>
        
        <button
          onClick={() => {
            const batchSuffix = batchNumber !== undefined ? `_Batch${batchNumber + 1}` : '';
            downloadPNG(picturesCanvasRef, `Pictures_A4${batchSuffix}.png`);
          }}
          className="group bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-bold py-4 px-6 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-300 shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          disabled={wordEntries.length === 0}
        >
          <span className="text-2xl">🖼️</span>
          <span>Download Pictures PNG</span>
          <span className="text-lg group-hover:translate-x-1 transition-transform">↓</span>
        </button>
      </div>

      {wordEntries.length === 0 && (
        <div className="p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-lg">
          <p className="text-sm text-yellow-800">
            ⚠️ Please generate a preview first before downloading PNGs.
          </p>
        </div>
      )}

      {/* Hidden canvases for PNG generation */}
      <div style={{ position: 'absolute', top: '-10000px', left: '-10000px' }}>
        <canvas ref={wordsCanvasRef} />
        <canvas ref={picturesCanvasRef} />
      </div>
    </div>
  );
};

export default A4Canvas;
