import { useState, useEffect, useRef, useCallback } from 'react';
import WordInputForm from './components/WordInputForm';
import CardPreview from './components/CardPreview';
import A4Canvas from './components/A4Canvas';
import BatchProcessDialog from './components/BatchProcessDialog';
import './App.css';

function App() {
  const [wordEntries, setWordEntries] = useState([]);
  const [fontSize, setFontSize] = useState(80);
  const [fontWeight, setFontWeight] = useState(300);
  const [dpi, setDpi] = useState(300);
  const [isBatchDialogOpen, setIsBatchDialogOpen] = useState(false);
  
  // Batch processing state
  const [allImageFiles, setAllImageFiles] = useState([]);
  const [currentBatchIndex, setCurrentBatchIndex] = useState(0);
  const [isBatchMode, setIsBatchMode] = useState(false);
  const [isProcessingBatch, setIsProcessingBatch] = useState(false);
  const [batchCanvasData, setBatchCanvasData] = useState({}); // Store canvas data for each batch
  const canvasRefs = useRef({ wordsCanvas: null, picturesCanvas: null });

  const extractWordFromFilename = (filename) => {
    const nameWithoutExtension = filename.replace(/\.[^/.]+$/, '');
    // Remove numbers from filename
    const withoutNumbers = nameWithoutExtension.replace(/\d+/g, '');
    // Split by space, underscore, or hyphen and take first segment
    const firstWord = withoutNumbers.split(/[\s_\-]/)[0];
    return firstWord || nameWithoutExtension.replace(/\d+/g, '');
  };

  const processBatch = useCallback(async (imageFiles, batchIndex) => {
    const startIndex = batchIndex * 8;
    const endIndex = Math.min(startIndex + 8, imageFiles.length);
    const batchFiles = imageFiles.slice(startIndex, endIndex);

    setIsProcessingBatch(true);

    try {
      // Process each image in the batch
      const processedEntries = await Promise.all(
        batchFiles.map(async (item) => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
              const word = extractWordFromFilename(item.filename);
              resolve({
                word: word,
                image: item.file,
                imageUrl: e.target.result
              });
            };
            reader.onerror = reject;
            reader.readAsDataURL(item.file);
          });
        })
      );

      setWordEntries(processedEntries);
      setCurrentBatchIndex(batchIndex);
      setIsProcessingBatch(false);
    } catch (err) {
      console.error('Error processing batch:', err);
      setIsProcessingBatch(false);
    }
  }, []);

  const handleBatchProcess = async (imageFiles) => {
    setAllImageFiles(imageFiles);
    setIsBatchMode(true);
    setCurrentBatchIndex(0);
    setBatchCanvasData({}); // Reset canvas data
    await processBatch(imageFiles, 0);
  };

  const handleCanvasDataReady = useCallback((batchIndex, wordsDataUrl, picturesDataUrl) => {
    setBatchCanvasData(prev => ({
      ...prev,
      [batchIndex]: {
        words: wordsDataUrl,
        pictures: picturesDataUrl
      }
    }));
  }, []);

  const handleNextBatch = async () => {
    const nextBatchIndex = currentBatchIndex + 1;
    const totalBatches = Math.ceil(allImageFiles.length / 8);
    
    if (nextBatchIndex < totalBatches) {
      await processBatch(allImageFiles, nextBatchIndex);
    }
  };

  const handlePreviousBatch = async () => {
    if (currentBatchIndex > 0) {
      const prevBatchIndex = currentBatchIndex - 1;
      await processBatch(allImageFiles, prevBatchIndex);
    }
  };

  const handleWordsChange = (newWordEntries, newFontSize, newFontWeight, newDpi) => {
    setWordEntries(newWordEntries);
    if (newFontSize !== undefined) setFontSize(newFontSize);
    if (newFontWeight !== undefined) setFontWeight(newFontWeight);
    if (newDpi !== undefined) setDpi(newDpi);
  };

  const handleCompilePDF = useCallback(async () => {
    const totalBatches = Math.ceil(allImageFiles.length / 8);
    if (totalBatches === 0 || Object.keys(batchCanvasData).length === 0) {
      alert('No batches to compile. Please process some images first.');
      return;
    }

    try {
      // Dynamic import of jsPDF
      const { default: jsPDF } = await import('jspdf');
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // A4 dimensions in mm: 210 x 297
      const a4Width = 210;
      const a4Height = 297;

      let isFirstPage = true;

      // Process each batch in order - create 1 image sheet, then 2 text sheets
      for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
        const batchData = batchCanvasData[batchIndex];
        
        if (!batchData) {
          console.warn(`No canvas data for batch ${batchIndex + 1}, skipping...`);
          continue;
        }

        // Add pictures page first
        if (batchData.pictures) {
          if (!isFirstPage) {
            pdf.addPage();
          }
          pdf.addImage(batchData.pictures, 'PNG', 0, 0, a4Width, a4Height, undefined, 'FAST');
          isFirstPage = false;
        }

        // Add first words page
        if (batchData.words) {
          pdf.addPage();
          pdf.addImage(batchData.words, 'PNG', 0, 0, a4Width, a4Height, undefined, 'FAST');
        }

        // Add second words page (duplicate)
        if (batchData.words) {
          pdf.addPage();
          pdf.addImage(batchData.words, 'PNG', 0, 0, a4Width, a4Height, undefined, 'FAST');
        }
      }

      // Save PDF
      pdf.save('Flashcards_AllBatches.pdf');
    } catch (error) {
      console.error('Error compiling PDF:', error);
      alert('Error compiling PDF. Please make sure all batches have been processed.');
    }
  }, [allImageFiles.length, batchCanvasData]);

  // Auto-advance to next batch after a delay when current batch is displayed
  useEffect(() => {
    if (isBatchMode && wordEntries.length > 0 && !isProcessingBatch && allImageFiles.length > 0) {
      const totalBatches = Math.ceil(allImageFiles.length / 8);
      const hasMoreBatches = currentBatchIndex < totalBatches - 1;
      
      if (hasMoreBatches) {
        // Wait for canvas to render and downloads to complete, then auto-advance
        // Downloads happen after 1s delay, so wait 3s total to allow downloads
        const timer = setTimeout(async () => {
          const nextBatchIndex = currentBatchIndex + 1;
          await processBatch(allImageFiles, nextBatchIndex);
        }, 3000); // 3 second delay to allow downloads

        return () => clearTimeout(timer);
      }
    }
  }, [wordEntries.length, currentBatchIndex, isBatchMode, isProcessingBatch, allImageFiles.length, processBatch]);

  // Auto-generate PDF when all batches are complete and canvas data is ready
  useEffect(() => {
    if (isBatchMode && allImageFiles.length > 0 && !isProcessingBatch) {
      const totalBatches = Math.ceil(allImageFiles.length / 8);
      const allBatchesComplete = currentBatchIndex === totalBatches - 1;
      const allBatchesReady = Object.keys(batchCanvasData).length >= totalBatches;
      
      if (allBatchesComplete && allBatchesReady && totalBatches > 0) {
        // Wait a bit to ensure all canvas data is fully stored
        const pdfTimer = setTimeout(async () => {
          await handleCompilePDF();
        }, 3000); // Wait 3 seconds after last batch to ensure canvas data is stored

        return () => clearTimeout(pdfTimer);
      }
    }
  }, [isBatchMode, allImageFiles.length, isProcessingBatch, currentBatchIndex, batchCanvasData, handleCompilePDF]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
            Flashcard Generator
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
            Create professional printable flashcards with custom words and images
          </p>
          <button
            onClick={() => setIsBatchDialogOpen(true)}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 px-8 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-300 shadow-lg hover:shadow-xl transition-all text-lg"
          >
            📁 Batch Process
          </button>
        </header>

        <main className="space-y-8">
          {/* Batch Progress Indicator */}
          {isBatchMode && allImageFiles.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-1">Batch Processing</h3>
                  <p className="text-gray-600">
                    Batch {currentBatchIndex + 1} of {Math.ceil(allImageFiles.length / 8)} • {allImageFiles.length} total images
                  </p>
                </div>
                {isProcessingBatch && (
                  <div className="text-blue-600">
                    <span className="text-xl mr-2">⏳</span>
                    Processing...
                  </div>
                )}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                <div
                  className="bg-gradient-to-r from-green-500 to-emerald-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${((currentBatchIndex + 1) / Math.ceil(allImageFiles.length / 8)) * 100}%` }}
                />
              </div>
              <div className="flex gap-4">
                <button
                  onClick={handlePreviousBatch}
                  disabled={currentBatchIndex === 0 || isProcessingBatch}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ← Previous Batch
                </button>
                <button
                  onClick={handleNextBatch}
                  disabled={currentBatchIndex >= Math.ceil(allImageFiles.length / 8) - 1 || isProcessingBatch}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next Batch →
                </button>
                <button
                  onClick={() => {
                    setIsBatchMode(false);
                    setAllImageFiles([]);
                    setCurrentBatchIndex(0);
                  }}
                  className="ml-auto px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 font-medium transition-all"
                >
                  Stop Batch Processing
                </button>
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
            <WordInputForm onWordsChange={handleWordsChange} initialValues={wordEntries} />
          </div>
          
          {wordEntries.length > 0 && (
            <>
              <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
                <CardPreview wordEntries={wordEntries} fontSize={fontSize} fontWeight={fontWeight} />
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
                <A4Canvas 
                  wordEntries={wordEntries} 
                  fontSize={fontSize} 
                  fontWeight={fontWeight} 
                  dpi={dpi}
                  batchNumber={isBatchMode ? currentBatchIndex : undefined}
                  autoDownload={isBatchMode}
                  onCanvasDataReady={isBatchMode ? handleCanvasDataReady : undefined}
                />
              </div>
            </>
          )}
        </main>

        <footer className="mt-16 text-center text-gray-500 text-sm">
          <p className="mb-2">Designed for A4 printing • 8 cards per sheet • High-quality PNG export</p>
          <p className="text-xs">Print at 100% scale with no margins for best results</p>
        </footer>
      </div>

      <BatchProcessDialog
        isOpen={isBatchDialogOpen}
        onClose={() => setIsBatchDialogOpen(false)}
        onProcess={handleBatchProcess}
      />
    </div>
  );
}

export default App;