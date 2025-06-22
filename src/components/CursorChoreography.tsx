import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Play, Square, RotateCcw, Palette, Download, Sparkles } from 'lucide-react';

interface Point {
  x: number;
  y: number;
  timestamp: number;
}

interface Recording {
  id: number;
  points: Point[];
  color: string;
  name: string;
}

const COLORS = [
  '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57',
  '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43'
];

const CursorChoreography: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [isRecording, setIsRecording] = useState(false);
  const [isReplaying, setIsReplaying] = useState(false);
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [currentPoints, setCurrentPoints] = useState<Point[]>([]);
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [replayProgress, setReplayProgress] = useState(0);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  // Handle mouse movement during recording
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isRecording || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const timestamp = Date.now();

    setCurrentPoints(prev => [...prev, { x, y, timestamp }]);
  }, [isRecording]);

  // Start recording
  const startRecording = () => {
    setCurrentPoints([]);
    setIsRecording(true);
  };

  // Stop recording and save
  const stopRecording = () => {
    if (currentPoints.length > 0) {
      const newRecording: Recording = {
        id: Date.now(),
        points: [...currentPoints],
        color: selectedColor,
        name: `Dance ${recordings.length + 1}`
      };
      setRecordings(prev => [...prev, newRecording]);
    }
    setIsRecording(false);
    setCurrentPoints([]);
  };

  // Clear all recordings
  const clearAll = () => {
    setRecordings([]);
    setCurrentPoints([]);
    setIsRecording(false);
    setIsReplaying(false);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  // Draw a glowing line between two points
  const drawGlowingLine = (ctx: CanvasRenderingContext2D, from: Point, to: Point, color: string, alpha: number = 1) => {
    ctx.save();
    ctx.globalAlpha = alpha;
    
    // Create gradient for the line
    const gradient = ctx.createLinearGradient(from.x, from.y, to.x, to.y);
    gradient.addColorStop(0, color + '00');
    gradient.addColorStop(0.5, color);
    gradient.addColorStop(1, color + '00');

    // Draw outer glow
    ctx.strokeStyle = color + '40';
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();

    // Draw inner line
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();

    // Draw core line
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();

    ctx.restore();
  };

  // Draw trail during recording
  const drawCurrentTrail = (ctx: CanvasRenderingContext2D) => {
    if (currentPoints.length < 2) return;

    for (let i = 1; i < currentPoints.length; i++) {
      const alpha = Math.min(1, (i / currentPoints.length) * 2);
      drawGlowingLine(ctx, currentPoints[i - 1], currentPoints[i], selectedColor, alpha * 0.7);
    }
  };

  // Replay animation
  const replay = async () => {
    if (recordings.length === 0 || isReplaying) return;

    setIsReplaying(true);
    setReplayProgress(0);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Calculate total duration
    const allPoints = recordings.flatMap(r => r.points);
    if (allPoints.length === 0) return;

    const startTime = Math.min(...allPoints.map(p => p.timestamp));
    const endTime = Math.max(...allPoints.map(p => p.timestamp));
    const totalDuration = Math.max(endTime - startTime, 3000); // Minimum 3 seconds

    const animate = (currentTime: number) => {
      const progress = Math.min(currentTime / totalDuration, 1);
      setReplayProgress(progress);

      // Clear canvas with subtle fade effect
      ctx.fillStyle = 'rgba(15, 23, 42, 0.1)';
      ctx.fillRect(0, 0, canvas.width / window.devicePixelRatio, canvas.height / window.devicePixelRatio);

      // Draw each recording
      recordings.forEach(recording => {
        const { points, color } = recording;
        if (points.length < 2) return;

        const recordingStartTime = points[0].timestamp - startTime;
        const recordingEndTime = points[points.length - 1].timestamp - startTime;
        const recordingProgress = Math.max(0, Math.min(1, 
          (currentTime - recordingStartTime) / (recordingEndTime - recordingStartTime)));

        if (recordingProgress <= 0) return;

        const visiblePointsCount = Math.floor(points.length * recordingProgress);
        
        for (let i = 1; i < visiblePointsCount; i++) {
          const segmentProgress = i / points.length;
          const alpha = Math.min(1, (1 - segmentProgress) * 2 + 0.3);
          drawGlowingLine(ctx, points[i - 1], points[i], color, alpha);
        }
      });

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(() => animate(currentTime + 16));
      } else {
        setIsReplaying(false);
        setReplayProgress(0);
      }
    };

    animationRef.current = requestAnimationFrame(() => animate(0));
  };

  // Render canvas continuously
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      if (!isReplaying) {
        // Clear canvas
        ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
        ctx.fillRect(0, 0, canvas.width / window.devicePixelRatio, canvas.height / window.devicePixelRatio);

        // Draw current trail while recording
        if (isRecording) {
          drawCurrentTrail(ctx);
        }

        // Draw static recordings when not replaying
        recordings.forEach(recording => {
          const { points, color } = recording;
          for (let i = 1; i < points.length; i++) {
            drawGlowingLine(ctx, points[i - 1], points[i], color, 0.3);
          }
        });
      }

      requestAnimationFrame(render);
    };

    render();
  }, [isRecording, currentPoints, recordings, isReplaying]);

  // Download canvas as image
  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = 'cursor-choreography.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="p-6 bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-3">
            <Sparkles className="w-8 h-8 text-purple-400" />
            <h1 className="text-2xl font-bold text-white">Cursor Choreography</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Color Palette */}
            <div className="flex items-center space-x-2">
              <Palette className="w-5 h-5 text-gray-300" />
              <div className="flex space-x-1">
                {COLORS.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 rounded-full border-2 transition-all duration-200 hover:scale-110 ${
                      selectedColor === color ? 'border-white shadow-lg' : 'border-gray-600'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* Controls */}
            <div className="flex space-x-2">
              <button
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isReplaying}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
                  isRecording
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-purple-500 hover:bg-purple-600 text-white disabled:opacity-50'
                }`}
              >
                {isRecording ? <Square className="w-4 h-4" /> : <span className="w-3 h-3 bg-red-500 rounded-full" />}
                <span>{isRecording ? 'Stop' : 'Record'}</span>
              </button>

              <button
                onClick={replay}
                disabled={recordings.length === 0 || isReplaying}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white rounded-lg font-medium transition-all duration-200 flex items-center space-x-2"
              >
                <Play className="w-4 h-4" />
                <span>Replay</span>
              </button>

              <button
                onClick={clearAll}
                disabled={isReplaying}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 disabled:opacity-50 text-white rounded-lg font-medium transition-all duration-200 flex items-center space-x-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Clear</span>
              </button>

              <button
                onClick={downloadImage}
                disabled={recordings.length === 0}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white rounded-lg font-medium transition-all duration-200 flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Save</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      {(isRecording || isReplaying || recordings.length > 0) && (
        <div className="px-6 py-3 bg-black/10 backdrop-blur-sm border-b border-white/5">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-6">
              {isRecording && (
                <div className="flex items-center space-x-2 text-red-400">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-sm font-medium">Recording... Move your cursor to create art</span>
                </div>
              )}
              
              {isReplaying && (
                <div className="flex items-center space-x-3 text-blue-400">
                  <div className="text-sm font-medium">Replaying</div>
                  <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 transition-all duration-100"
                      style={{ width: `${replayProgress * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {recordings.length > 0 && !isRecording && !isReplaying && (
                <div className="text-sm text-gray-400">
                  {recordings.length} dance{recordings.length !== 1 ? 's' : ''} recorded
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Canvas */}
      <div className="flex-1 relative overflow-hidden">
        <canvas
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          className="w-full h-full cursor-crosshair bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900"
          style={{ background: 'radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.1) 0%, rgba(15, 23, 42, 1) 70%)' }}
        />
        
        {/* Instructions */}
        {recordings.length === 0 && !isRecording && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-500/20 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-purple-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Create Your Cursor Art</h2>
              <p className="text-gray-400 text-lg">Click "Record" and move your mouse to paint with light</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CursorChoreography;