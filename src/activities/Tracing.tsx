import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { ActivityProps } from '../types';
import { ActivityHeader } from '../components/ActivityHeader';
import { playAudio } from '../lib/audio';
import { Eraser, CheckCircle2, XCircle } from 'lucide-react';

const TRANSLATIONS = {
  'en-IN': { title: 'Tracing', instruction: 'Trace the letter!', clear: 'Clear', check: 'Check', success: 'Great job!', fail: 'Try again!' },
  'hi-IN': { title: 'लिखना', instruction: 'अक्षर पर लिखें!', clear: 'साफ़ करें', check: 'जाँचें', success: 'बहुत बढ़िया!', fail: 'फिर से प्रयास करें!' },
  'gu-IN': { title: 'લખવું', instruction: 'અક્ષર પર લખો!', clear: 'સાફ કરો', check: 'ચકાસો', success: 'ખૂબ સરસ!', fail: 'ફરી પ્રયાસ કરો!' },
};

const ITEMS = ['A', 'B', 'C', '1', '2', '3'];

export default function Tracing({ language, onComplete, onBack, onScore }: ActivityProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [feedback, setFeedback] = useState<'success' | 'fail' | null>(null);
  const t = TRANSLATIONS[language];
  const currentItem = ITEMS[currentIndex];

  useEffect(() => {
    playAudio(t.instruction, language);
    drawTemplate();
  }, [currentIndex, language, t.instruction]);

  const drawTemplate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = 400;
    canvas.height = 400;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw dotted text
    ctx.font = 'bold 250px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#e2e8f0'; // slate-200
    ctx.fillText(currentItem, canvas.width / 2, canvas.height / 2 + 20);
    
    // Set up brush for user
    ctx.strokeStyle = '#ec4899'; // pink-500
    ctx.lineWidth = 24;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  };

  const startDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (feedback) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing || feedback) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleCheck = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Create an offscreen canvas to generate a "mask" of the acceptable tracing area
    const maskCanvas = document.createElement('canvas');
    maskCanvas.width = 400;
    maskCanvas.height = 400;
    const maskCtx = maskCanvas.getContext('2d');
    if (!maskCtx) return;

    maskCtx.font = 'bold 250px Inter, sans-serif';
    maskCtx.textAlign = 'center';
    maskCtx.textBaseline = 'middle';
    maskCtx.lineWidth = 60; // Generous tolerance for kids
    maskCtx.lineJoin = 'round';
    maskCtx.lineCap = 'round';
    maskCtx.strokeText(currentItem, 200, 220);
    maskCtx.fillText(currentItem, 200, 220);

    const maskData = maskCtx.getImageData(0, 0, 400, 400).data;
    const visibleData = ctx.getImageData(0, 0, 400, 400).data;

    let totalDrawn = 0;
    let correctDrawn = 0;
    let totalTarget = 0;

    // Analyze pixels
    for (let i = 0; i < maskData.length; i += 4) {
      const isTarget = maskData[i + 3] > 0; // Alpha channel of mask
      const g = visibleData[i + 1]; // Green channel of visible canvas
      const a = visibleData[i + 3]; // Alpha channel of visible canvas
      
      // The brush is pink (#ec4899), which has a low green value compared to the white background or slate template
      const isPink = a > 0 && g < 150;

      if (isTarget) totalTarget++;
      if (isPink) {
        totalDrawn++;
        if (isTarget) correctDrawn++;
      }
    }

    // If they barely drew anything
    if (totalDrawn < 200) {
      setFeedback('fail');
      playAudio(t.fail, language);
      setTimeout(() => setFeedback(null), 1500);
      return;
    }

    const accuracy = correctDrawn / totalDrawn; // How much of their ink is inside the lines
    const coverage = correctDrawn / totalTarget; // How much of the letter they covered

    // Require 65% accuracy (staying in lines) and 15% coverage (drawing enough of the letter)
    if (accuracy > 0.65 && coverage > 0.15) {
      setFeedback('success');
      playAudio(t.success, language);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      if (onScore) onScore(10);
      
      setTimeout(() => {
        setFeedback(null);
        if (currentIndex + 1 >= ITEMS.length) {
          onComplete();
        } else {
          setCurrentIndex(i => i + 1);
        }
      }, 2000);
    } else {
      setFeedback('fail');
      playAudio(t.fail, language);
      setTimeout(() => {
        setFeedback(null);
        drawTemplate(); // Reset the canvas for them to try again
      }, 1500);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <ActivityHeader title={t.title} instruction={t.instruction} language={language} onBack={onBack} />
      
      <div className="flex-1 flex flex-col items-center justify-center gap-6 mt-4 bg-pink-50 rounded-3xl border-4 border-pink-200 p-4">
        
        <div className="relative bg-white rounded-3xl shadow-inner border-4 border-pink-100 overflow-hidden touch-none">
          <canvas
            ref={canvasRef}
            width={400}
            height={400}
            onPointerDown={startDrawing}
            onPointerMove={draw}
            onPointerUp={stopDrawing}
            onPointerOut={stopDrawing}
            className="cursor-crosshair w-full max-w-[400px] aspect-square"
          />
          
          <AnimatePresence>
            {feedback && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className={`absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm ${feedback === 'success' ? 'text-green-500' : 'text-rose-500'}`}
              >
                {feedback === 'success' ? <CheckCircle2 className="w-32 h-32" /> : <XCircle className="w-32 h-32" />}
                <span className="text-3xl font-bold mt-4">{feedback === 'success' ? t.success : t.fail}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={drawTemplate}
            className="px-6 py-3 bg-white text-pink-500 border-4 border-pink-200 rounded-full font-bold text-xl shadow-md flex items-center gap-2"
          >
            <Eraser className="w-6 h-6" />
            {t.clear}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCheck}
            className="px-6 py-3 bg-gradient-to-r from-pink-400 to-rose-500 text-white rounded-full font-bold text-xl shadow-md flex items-center gap-2"
          >
            <CheckCircle2 className="w-6 h-6" />
            {t.check}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
