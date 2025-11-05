import { useState, useRef } from 'react';

const BatchProcessDialog = ({ isOpen, onClose, onProcess }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const extractWordFromFilename = (filename) => {
    // Remove file extension
    const nameWithoutExtension = filename.replace(/\.[^/.]+$/, '');
    
    // Remove numbers from filename
    const withoutNumbers = nameWithoutExtension.replace(/\d+/g, '');
    
    // Split by space, underscore, or hyphen and take first segment
    const firstWord = withoutNumbers.split(/[\s_\-]/)[0];
    
    return firstWord || nameWithoutExtension.replace(/\d+/g, '');
  };

  const handleFolderSelect = async (event) => {
    const files = Array.from(event.target.files || []);
    
    if (files.length === 0) {
      setError('No files selected');
      return;
    }

    // Filter image files
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
      setError('No image files found in the selected folder');
      return;
    }

    // Sort alphabetically - store ALL images, not just first 8
    const sortedImages = imageFiles.sort((a, b) => a.name.localeCompare(b.name));

    setIsProcessing(true);
    setError('');

    try {
      // Process all images to get file references
      // We'll process them in batches later
      const allImageFiles = sortedImages.map(file => ({
        file: file,
        filename: file.name
      }));

      // Call the callback with all image files for batch processing
      onProcess(allImageFiles);
      
      // Close dialog and reset input
      onClose();
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      setError('Error processing images: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleOpenDialog = () => {
    fileInputRef.current?.click();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Batch Process Images</h2>
        
        <p className="text-gray-600 mb-6">
          Select a folder containing images. Images will be processed in batches of 8, with text extracted from filenames.
        </p>

        <input
          ref={fileInputRef}
          type="file"
          webkitdirectory=""
          directory=""
          multiple
          accept="image/*"
          onChange={handleFolderSelect}
          className="hidden"
        />

        {error && (
          <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg">
            <div className="flex items-center">
              <span className="text-xl mr-2">⚠️</span>
              <span className="font-medium">{error}</span>
            </div>
          </div>
        )}

        {isProcessing && (
          <div className="mb-4 p-4 bg-blue-50 border-l-4 border-blue-500 text-blue-700 rounded-lg">
            <div className="flex items-center">
              <span className="text-xl mr-2">⏳</span>
              <span className="font-medium">Processing images...</span>
            </div>
          </div>
        )}

        <div className="flex gap-4">
          <button
            onClick={handleOpenDialog}
            disabled={isProcessing}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Select Folder
          </button>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default BatchProcessDialog;

