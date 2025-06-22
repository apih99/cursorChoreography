# Cursor Choreography ✨

A mesmerizing web application that transforms your cursor movements into beautiful, glowing art trails. Record elegant cursor dances and replay them as stunning animated light shows.

![Cursor Choreography](https://img.shields.io/badge/React-18.3.1-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue) ![Vite](https://img.shields.io/badge/Vite-5.4.2-purple) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.1-cyan)

## 🎨 Features

- **Real-time Recording**: Capture smooth cursor movements as you create artistic patterns
- **Glowing Trails**: Beautiful glowing effects with gradient trails and dynamic opacity
- **Color Palette**: Choose from 10 vibrant colors to paint your cursor art
- **Smooth Replay**: Watch your recordings come to life with synchronized animations
- **Multiple Recordings**: Layer multiple cursor dances on the same canvas
- **Export Functionality**: Save your masterpieces as PNG images
- **Responsive Design**: Works seamlessly across different screen sizes
- **Modern UI**: Beautiful dark theme with backdrop blur effects

## 🚀 Quick Start

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/apih99/cursorChoreography.git
cd cursorChoreography
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 🎮 How to Use

1. **Choose a Color**: Select your preferred color from the palette in the top bar
2. **Start Recording**: Click the "Record" button to begin capturing cursor movements
3. **Create Art**: Move your cursor around the canvas to paint glowing trails
4. **Stop Recording**: Click "Stop" to finish your current recording
5. **Replay**: Hit "Replay" to watch all your recordings animate simultaneously
6. **Save**: Use the "Save" button to download your artwork as a PNG image
7. **Clear**: Start fresh by clearing all recordings

## 🛠️ Technical Stack

- **Frontend Framework**: React 18.3.1 with TypeScript
- **Build Tool**: Vite 5.4.2
- **Styling**: Tailwind CSS 3.4.1
- **Icons**: Lucide React
- **Canvas Rendering**: HTML5 Canvas with 2D Context
- **Animation**: RequestAnimationFrame for smooth 60fps animations

## 📁 Project Structure

```
cursorChoreography/
├── src/
│   ├── components/
│   │   └── CursorChoreography.tsx  # Main component with all functionality
│   ├── App.tsx                     # Root component
│   ├── main.tsx                    # Application entry point
│   └── index.css                   # Global styles
├── public/                         # Static assets
├── package.json                    # Dependencies and scripts
└── README.md                       # Project documentation
```

## 🎯 Key Features Explained

### Recording System
- Captures mouse coordinates with timestamps for precise replay
- Implements smooth interpolation between points
- Stores recordings with unique IDs and color information

### Rendering Engine
- **Glowing Effects**: Multi-layer rendering with outer glow, inner line, and core highlight
- **Fade Effects**: Dynamic opacity based on trail age and replay progress
- **Performance Optimization**: Efficient canvas clearing and redrawing strategies

### Animation System
- **Synchronized Playback**: Multiple recordings replay simultaneously with proper timing
- **Progress Tracking**: Visual progress bar during replay
- **Smooth Interpolation**: Fluid animation using requestAnimationFrame

## 🎨 Customization

### Adding New Colors
Modify the `COLORS` array in `CursorChoreography.tsx`:
```typescript
const COLORS = [
  '#ff6b6b', '#4ecdc4', '#45b7d1', // ... add your colors here
];
```

### Adjusting Visual Effects
Customize the glowing effects by modifying the `drawGlowingLine` function parameters:
- Line width for different glow intensities
- Alpha values for transparency effects
- Color gradients for enhanced visual appeal

## 📊 Performance

- **Optimized Rendering**: Canvas operations optimized for smooth 60fps
- **Memory Management**: Efficient handling of large cursor datasets
- **Device Pixel Ratio**: High-DPI display support for crisp graphics
- **Animation Cleanup**: Proper cleanup of animation frames to prevent memory leaks

## 🚀 Deployment

This project is set up for easy deployment to GitHub Pages with two methods:

### Method 1: Automatic Deployment (Recommended)
The project includes a GitHub Actions workflow that automatically deploys to GitHub Pages when you push to the main branch.

1. Make sure GitHub Pages is enabled in your repository settings
2. Set the source to "GitHub Actions" in Pages settings
3. Push your changes to the main branch
4. The site will be automatically built and deployed

### Method 2: Manual Deployment
```bash
# Install dependencies if not already installed
npm install

# Deploy manually
npm run deploy
```

🌐 **Live Demo**: [https://apih99.github.io/cursorChoreography](https://apih99.github.io/cursorChoreography)

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run deploy` - Manual deployment to GitHub Pages

## 🌟 Future Enhancements

- Multiple canvas layers for complex compositions
- Brush size and style variations
- Sound synchronization for audio-visual experiences
- Recording export/import functionality
- Collaborative real-time drawing sessions

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Made with ✨ and cursor magic
