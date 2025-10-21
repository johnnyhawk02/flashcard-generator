# Deployment Guide

## Netlify Deployment

This React app is ready for deployment on Netlify's free tier.

### Steps:

1. **Push to GitHub** (already done):
   - Repository: https://github.com/jonathantaylor/flashcard-generator
   - Main branch: `main`

2. **Connect to Netlify**:
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub account
   - Select `johnnyhawk02/flashcard-generator`

3. **Build Settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: `18` (or latest)

4. **Deploy**:
   - Click "Deploy site"
   - Wait for build to complete
   - Your site will be live at `https://[random-name].netlify.app`

### Custom Domain (Optional):
- Go to Site settings → Domain management
- Add your custom domain
- Update DNS records as instructed

### Environment Variables:
No environment variables needed for this static app.

### Performance:
- Build size: ~2-3MB (within Netlify free tier limits)
- Images: Add your 60 word images to `/public/images/` before building
- Total size with images: Should stay under 6MB for free tier

## Local Development

```bash
npm install
npm run dev
```

## Building for Production

```bash
npm run build
```

The `dist` folder contains the production build ready for deployment.
