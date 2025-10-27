import { useRef, useEffect } from 'react';

const A4Canvas = ({ wordEntries, fontSize, dpi = 300 }) => {
  const wordsCanvasRef = useRef(null);
  const picturesCanvasRef = useRef(null);

  // Calculate dimensions based on DPI
  const getDimensions = () => {
    const currentDpi = dpi;
    if (currentDpi === 300) {
      return {
        width: 2480,
        height: 3508,
        cardWidth: 1150,
        cardHeight: 802,
        fontSize: fontSize * 2,
        margin: 30,
        gap: 30
      };
    } else {
      return {
        width: 1240,
        height: 1754,
        cardWidth: 575,
        cardHeight: 401,
        fontSize: fontSize,
        margin: 30,
        gap: 30
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
    await document.fonts.load(`300 ${dimensions.fontSize}px Lexend`);
    
    // Pad entries to 8
    const paddedEntries = [...wordEntries, ...Array(8 - wordEntries.length).fill(null)];

    // Draw 8 cards (2 columns x 4 rows)
    for (let i = 0; i < 8; i++) {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = dimensions.margin + col * (dimensions.cardWidth + dimensions.gap);
      const y = dimensions.margin + row * (dimensions.cardHeight + dimensions.gap);

      // Draw dashed border
      ctx.strokeStyle = '#000000';
      ctx.setLineDash([10, 5]);
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, dimensions.cardWidth, dimensions.cardHeight);
      ctx.setLineDash([]);

      // Draw word if exists
      if (paddedEntries[i] && paddedEntries[i].word) {
        ctx.fillStyle = '#000000';
        ctx.font = `300 ${dimensions.fontSize}px Lexend`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle'; // This centers text vertically!
        
        const textX = x + dimensions.cardWidth / 2;
        const textY = y + dimensions.cardHeight / 2;
        
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
      const x = dimensions.margin + col * (dimensions.cardWidth + dimensions.gap);
      const y = dimensions.margin + row * (dimensions.cardHeight + dimensions.gap);

      // Draw dashed border
      ctx.strokeStyle = '#000000';
      ctx.setLineDash([10, 5]);
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, dimensions.cardWidth, dimensions.cardHeight);
      ctx.setLineDash([]);

      // Draw image if exists
      if (paddedEntries[i] && paddedEntries[i].imageUrl) {
        try {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          
          await new Promise((resolve, reject) => {
            img.onload = () => {
              // Calculate dimensions to fill width and crop top/bottom
              const cardAspect = dimensions.cardWidth / dimensions.cardHeight;
              const imgAspect = img.width / img.height;
              
              let drawWidth, drawHeight, drawX, drawY;
              
              if (imgAspect > cardAspect) {
                // Image is wider than card - fit height, crop sides
                drawHeight = dimensions.cardHeight;
                drawWidth = drawHeight * imgAspect;
                drawX = x - (drawWidth - dimensions.cardWidth) / 2;
                drawY = y;
              } else {
                // Image is taller than card - fit width, crop top/bottom
                drawWidth = dimensions.cardWidth;
                drawHeight = drawWidth / imgAspect;
                drawX = x;
                drawY = y - (drawHeight - dimensions.cardHeight) / 2;
              }
              
              // Clip to card boundaries
              ctx.save();
              ctx.beginPath();
              ctx.rect(x, y, dimensions.cardWidth, dimensions.cardHeight);
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
    drawWordCards();
    drawPictureCards();
  }, [wordEntries, fontSize, dpi]);

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
    <div className="mb-6">
      <h2 className="text-2xl font-bold mb-4">Download PNGs</h2>
      
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => downloadPNG(wordsCanvasRef, 'Words_A4.png')}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          disabled={wordEntries.length === 0}
        >
          Download Words PNG
        </button>
        
        <button
          onClick={() => downloadPNG(picturesCanvasRef, 'Pictures_A4.png')}
          className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          disabled={wordEntries.length === 0}
        >
          Download Pictures PNG
        </button>
      </div>

      {/* Hidden canvases for PNG generation */}
      <div style={{ position: 'absolute', top: '-10000px', left: '-10000px' }}>
        <canvas ref={wordsCanvasRef} />
        <canvas ref={picturesCanvasRef} />
      </div>
    </div>
  );
};

export default A4Canvas;
