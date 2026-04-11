import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { ActivityProps } from '../types';
import { ActivityHeader } from '../components/ActivityHeader';
import { playAudio } from '../lib/audio';
import { Eraser, Trash2, Download } from 'lucide-react';

const TRANSLATIONS = {
  'en-IN': { title: 'Free Draw', instruction: 'Draw whatever you like!', clear: 'Clear', save: 'Save' },
  'hi-IN': { title: 'चित्रकारी', instruction: 'जो चाहो वो बनाओ!', clear: 'साफ़ करें', save: 'सेव करें' },
  'gu-IN': { title: 'ચિત્રકામ', instruction: 'તમને ગમે તે દોરો!', clear: 'સાફ કરો', save: 'સાચવો' },
};

const COLORS = [
  '#ef4444', '#f97316', '#f59e0b', '#84cc16', '#22c55e', 
  '#06b6d4', '#3b82f6', '#8b5cf6', '#d946ef', '#f43f5e', 
  '#000000', '#ffffff'
];

const BRUSH_SIZES = [5, 10, 20, 30];

export default function FreeDraw({ language, onComplete, onBack, onScore }: ActivityProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState(COLORS[0]);
  const [brushSize, setBrushSize] = useState(BRUSH_SIZES[1]);
  const [hasDrawn, setHasDrawn] = useState(false);
  const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS] || TRANSLATIONS['en-IN'];

  useEffect(() => {
    playAudio(t.instruction, language);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        // Fill white background initially
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, [language, t.instruction]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : (e as React.MouseEvent).clientX - rect.left;
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : (e as React.MouseEvent).clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setHasDrawn(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : (e as React.MouseEvent).clientX - rect.left;
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : (e as React.MouseEvent).clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) ctx.closePath();
      }
      setIsDrawing(false);
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    playAudio('Swoosh', 'en-IN');
  };

  const saveCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = 'my-drawing.png';
    link.href = dataUrl;
    link.click();
    playAudio('Ding', 'en-IN');
    
    if (hasDrawn) {
      if (onScore) onScore(10);
      onComplete();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <ActivityHeader title={t.title} instruction={t.instruction} language={language} onBack={onBack} />
      
      <div className="flex-1 flex flex-col md:flex-row gap-4 mt-4 items-center justify-center">
        {/* Toolbar */}
        <div className="flex md:flex-col gap-4 bg-white p-4 rounded-3xl shadow-sm border-2 border-slate-200">
          <div className="grid grid-cols-6 md:grid-cols-2 gap-2">
            {COLORS.map(c => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`w-8 h-8 rounded-full border-2 transition-transform ${color === c ? 'scale-125 border-slate-800 shadow-md' : 'border-slate-200 hover:scale-110'}`}
                style={{ backgroundColor: c }}
                aria-label={`Color ${c}`}
              />
            ))}
          </div>
          
          <div className="w-px md:w-full md:h-px bg-slate-200 my-1" />
          
          <div className="flex md:flex-col gap-2 items-center justify-center">
            {BRUSH_SIZES.map(size => (
              <button
                key={size}
                onClick={() => setBrushSize(size)}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${brushSize === size ? 'bg-slate-200' : 'hover:bg-slate-100'}`}
              >
                <div className="bg-slate-800 rounded-full" style={{ width: size, height: size }} />
              </button>
            ))}
          </div>

          <div className="w-px md:w-full md:h-px bg-slate-200 my-1" />

          <div className="flex md:flex-col gap-2">
            <button
              onClick={clearCanvas}
              className="p-3 bg-red-100 text-red-600 rounded-2xl hover:bg-red-200 transition-colors flex flex-col items-center gap-1"
              title={t.clear}
            >
              <Trash2 size={20} />
            </button>
            <button
              onClick={saveCanvas}
              className="p-3 bg-green-100 text-green-600 rounded-2xl hover:bg-green-200 transition-colors flex flex-col items-center gap-1"
              title={t.save}
            >
              <Download size={20} />
            </button>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="relative bg-white rounded-3xl shadow-inner border-4 border-slate-200 overflow-hidden touch-none">
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            className="w-full max-w-[800px] h-auto aspect-[4/3] cursor-crosshair touch-none"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseOut={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            onTouchCancel={stopDrawing}
          />
        </div>
      </div>
    </div>
  );
}
