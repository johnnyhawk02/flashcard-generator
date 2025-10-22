import { useRef } from 'react';
import html2canvas from 'html2canvas';

const A4Canvas = ({ wordEntries, fontSize }) => {
  const wordsCanvasRef = useRef(null);
  const picturesCanvasRef = useRef(null);

  const downloadPNG = async (canvasRef, filename) => {
    if (!canvasRef.current) return;

    console.log(`Starting PNG generation for ${filename}`);
    console.log('Canvas element:', canvasRef.current);
    console.log('Words to render:', wordEntries);

    try {
      // Temporarily make the canvas visible for rendering
      const originalStyle = canvasRef.current.style.cssText;
      canvasRef.current.style.cssText = `
        position: absolute;
        top: -10000px;
        left: -10000px;
        visibility: visible;
        opacity: 1;
        z-index: 9999;
      `;

      // Wait a moment for the element to be rendered
      await new Promise(resolve => setTimeout(resolve, 100));

      console.log('About to call html2canvas...');
      const canvas = await html2canvas(canvasRef.current, {
        scale: 1,
        width: 1240,
        height: 1754,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        removeContainer: true,
        foreignObjectRendering: false,
        ignoreElements: (element) => {
          return element.tagName === 'SCRIPT' || element.tagName === 'STYLE';
        }
      });

      console.log('html2canvas completed, canvas size:', canvas.width, 'x', canvas.height);

      // Restore original style
      canvasRef.current.style.cssText = originalStyle;

      const link = document.createElement('a');
      link.download = filename;
      link.href = canvas.toDataURL('image/png');
      link.click();
      
      console.log(`PNG download initiated for ${filename}`);
    } catch (error) {
      console.error('Error generating PNG:', error);
      alert('Error generating PNG. Please try again.');
    }
  };

  const renderA4Card = (entry, index) => {
    // Calculate position: 2 columns, 4 rows
    const col = index % 2;
    const row = Math.floor(index / 2);
    const cardWidth = 575; // Adjusted to fit A4: (1240 - 2*30 - 30) / 2
    const cardHeight = 401; // Adjusted to fit A4: (1754 - 2*30 - 3*30) / 4
    const x = 30 + col * (cardWidth + 30); // 30px padding + column offset
    const y = 30 + row * (cardHeight + 30); // 30px padding + row offset

    if (!entry || !entry.word) {
      return (
        <div 
          key={index} 
          style={{
            position: 'absolute',
            left: `${x}px`,
            top: `${y}px`,
            width: `${cardWidth}px`,
            height: `${cardHeight}px`,
            border: '1px dashed #ccc',
            backgroundColor: '#f9f9f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <span style={{ color: '#999', fontSize: '14px' }}>Empty</span>
        </div>
      );
    }

    return (
      <div 
        key={index} 
        style={{
          position: 'absolute',
          left: `${x}px`,
          top: `${y}px`,
          width: `${cardWidth}px`,
          height: `${cardHeight}px`,
          border: '1px dashed #000',
          backgroundColor: '#fff'
        }}
      >
        <span 
          style={{ 
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontFamily: "'Lexend', sans-serif",
            fontWeight: '300',
            fontSize: `${fontSize}px`,
            color: '#000',
            textAlign: 'center',
            lineHeight: '1',
            whiteSpace: 'nowrap',
            maxWidth: '100%',
            overflow: 'hidden'
          }}
        >
          {entry.word}
        </span>
      </div>
    );
  };

  const renderA4ImageCard = (entry, index) => {
    // Calculate position: 2 columns, 4 rows
    const col = index % 2;
    const row = Math.floor(index / 2);
    const cardWidth = 575; // Adjusted to fit A4: (1240 - 2*30 - 30) / 2
    const cardHeight = 401; // Adjusted to fit A4: (1754 - 2*30 - 3*30) / 4
    const x = 30 + col * (cardWidth + 30); // 30px padding + column offset
    const y = 30 + row * (cardHeight + 30); // 30px padding + row offset

    if (!entry || !entry.word) {
      return (
        <div 
          key={index} 
          style={{
            position: 'absolute',
            left: `${x}px`,
            top: `${y}px`,
            width: `${cardWidth}px`,
            height: `${cardHeight}px`,
            border: '1px dashed #ccc',
            backgroundColor: '#f9f9f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <span style={{ color: '#999', fontSize: '14px' }}>Empty</span>
        </div>
      );
    }

    return (
      <div 
        key={index} 
        style={{
          position: 'absolute',
          left: `${x}px`,
          top: `${y}px`,
          width: `${cardWidth}px`,
          height: `${cardHeight}px`,
          border: '1px dashed #000',
          backgroundColor: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {entry.imageUrl ? (
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundImage: `url(${entry.imageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          />
        ) : (
          <div style={{ textAlign: 'center', color: '#999' }}>
            <div style={{ fontSize: '48px', marginBottom: '8px' }}>📷</div>
            <div style={{ fontSize: '16px' }}>No image</div>
          </div>
        )}
      </div>
    );
  };

  // Ensure we have exactly 8 slots (pad with empty slots if needed)
  const paddedEntries = [...wordEntries, ...Array(8 - wordEntries.length).fill(null)];
  
  console.log('Padded entries for A4 canvas:', paddedEntries);
  console.log('Number of cards to render:', paddedEntries.length);

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

      {/* Off-screen A4 canvases for PNG generation */}
      <div style={{ position: 'absolute', top: '-10000px', left: '-10000px', visibility: 'hidden' }}>
        {/* Words A4 Canvas */}
        <div
          ref={wordsCanvasRef}
          style={{
            width: '1240px',
            height: '1754px',
            backgroundColor: '#ffffff',
            fontFamily: "'Lexend', sans-serif",
            fontWeight: '300',
            position: 'relative',
            boxSizing: 'border-box'
          }}
        >
          {paddedEntries.map((entry, index) => renderA4Card(entry, index))}
        </div>

        {/* Pictures A4 Canvas */}
        <div
          ref={picturesCanvasRef}
          style={{
            width: '1240px',
            height: '1754px',
            backgroundColor: '#ffffff',
            position: 'relative',
            boxSizing: 'border-box'
          }}
        >
          {paddedEntries.map((entry, index) => renderA4ImageCard(entry, index))}
        </div>
      </div>
    </div>
  );
};

export default A4Canvas;
