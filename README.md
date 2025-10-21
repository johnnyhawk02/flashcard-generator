# Flashcard Generator

A React app for generating printable flashcard PNGs based on See and Learn (DSE) words.

## Features

- Input up to 8 words from a predefined list
- Preview word cards and picture cards in a 2x4 grid
- Download high-resolution A4 PNGs (1240x1754px at 150 DPI)
- Optimized for printing on A4 paper

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to the local development URL.

## Usage

1. Enter up to 8 words in the text area (comma-separated or new lines)
2. Click "Generate Preview" to see the cards
3. Use "Download Words PNG" and "Download Pictures PNG" to get A4-sized files
4. Print on A4 paper at 100% scale with no margins

## Project Structure

```
src/
├── components/
│   ├── WordInputForm.jsx    # Form for word input with validation
│   ├── CardPreview.jsx      # 2x4 grid preview
│   └── A4Canvas.jsx         # Hidden A4 layout for PNG generation
├── data/
│   └── words.json           # Maps words to image paths
├── App.jsx                  # Main component
├── App.css                  # Tailwind styles and A4 layout
└── main.jsx                 # Entry point
```

## Available Words

The app includes 60 predefined words from the See and Learn (DSE) program, including:
- Nouns: apple, baby, cat, dog, car, house, tree, etc.
- Common words: the, and, is, in, on, to, a, you, I, etc.
- Action words: eating, drinking, playing, running, etc.

## Technical Details

- **Framework**: React with Vite
- **Styling**: Tailwind CSS
- **PNG Generation**: html2canvas
- **Font**: Lexend Light 300 (Google Fonts)
- **Output**: A4 PNGs at 150 DPI (1240x1754px)
- **Card Size**: ~590x410px with 5mm margins

## Deployment

This app is designed for static hosting (e.g., Netlify):

1. Build the project: `npm run build`
2. Deploy the `dist` folder to your static hosting service

## Notes

- Images are expected to be in `/public/images/` directory
- Placeholder images are used for missing images
- Maximum 8 words per generation (1 A4 sheet)
- Case-insensitive word matching