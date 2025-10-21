import { useRef } from 'react';
import html2canvas from 'html2canvas';
import wordsData from '../data/words.json';

const A4Canvas = ({ words }) => {
  const wordsCanvasRef = useRef(null);
  const picturesCanvasRef = useRef(null);

  const getImagePath = (word) => {
    return wordsData[word] || '/placeholder.png';
  };

  const downloadPNG = async (canvasRef, filename) => {
    if (!canvasRef.current) return;

    console.log(`Starting PNG generation for ${filename}`);
    console.log('Canvas element:', canvasRef.current);
    console.log('Words to render:', words);

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
        removeContainer: true
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

  const renderA4Card = (word, index) => {
    if (!word) {
      return (
        <div 
          key={index} 
          style={{
            width: '590px',
            height: '410px',
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
          width: '590px',
          height: '410px',
          border: '1px dashed #000',
          backgroundColor: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <span 
          style={{ 
            fontFamily: "'Lexend', sans-serif",
            fontWeight: '300',
            fontSize: '60px',
            color: '#000',
            textAlign: 'center'
          }}
        >
          {word}
        </span>
      </div>
    );
  };

  const renderA4ImageCard = (word, index) => {
    if (!word) {
      return (
        <div 
          key={index} 
          style={{
            width: '590px',
            height: '410px',
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
          width: '590px',
          height: '410px',
          border: '1px dashed #000',
          backgroundColor: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px'
        }}
      >
        <img
          src={getImagePath(word)}
          alt={word}
          style={{ 
            maxWidth: '470px', 
            maxHeight: '330px',
            objectFit: 'contain'
          }}
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
      <h2 className="text-2xl font-bold mb-4">Download PNGs</h2>
      
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => downloadPNG(wordsCanvasRef, 'Words_A4.png')}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          disabled={words.length === 0}
        >
          Download Words PNG
        </button>
        
        <button
          onClick={() => downloadPNG(picturesCanvasRef, 'Pictures_A4.png')}
          className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          disabled={words.length === 0}
        >
          Download Pictures PNG
        </button>
      </div>

      {/* Off-screen A4 canvases for PNG generation */}
      <div style={{ position: 'absolute', top: '-10000px', left: '-10000px', visibility: 'hidden' }}>
        {/* Words A4 Canvas */}
        <div
          ref={wordsCanvasRef}
          className="bg-white"
          style={{
            width: '1240px',
            height: '1754px',
            display: 'grid',
            gridTemplate: 'repeat(4, 410px) / repeat(2, 590px)',
            gap: '30px',
            padding: '30px',
            fontFamily: "'Lexend', sans-serif",
            fontWeight: '300',
            position: 'relative'
          }}
        >
          {paddedWords.map((word, index) => renderA4Card(word, index))}
        </div>

        {/* Pictures A4 Canvas */}
        <div
          ref={picturesCanvasRef}
          className="bg-white"
          style={{
            width: '1240px',
            height: '1754px',
            display: 'grid',
            gridTemplate: 'repeat(4, 410px) / repeat(2, 590px)',
            gap: '30px',
            padding: '30px',
            position: 'relative'
          }}
        >
          {paddedWords.map((word, index) => renderA4ImageCard(word, index))}
        </div>
      </div>
    </div>
  );
};

export default A4Canvas;
