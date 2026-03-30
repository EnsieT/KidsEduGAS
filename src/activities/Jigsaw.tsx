import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { ActivityProps } from '../types';
import { ActivityHeader } from '../components/ActivityHeader';
import { playAudio } from '../lib/audio';
import { Eye, EyeOff } from 'lucide-react';

const TRANSLATIONS = {
  'en-IN': { title: 'Jigsaw Puzzle', instruction: 'Swap the pieces to complete the picture' },
  'hi-IN': { title: 'जिगसॉ पहेली', instruction: 'चित्र पूरा करने के लिए टुकड़ों की अदला-बदली करें' },
  'gu-IN': { title: 'જીગ્સૉ કોયડો', instruction: 'ચિત્ર પૂર્ણ કરવા માટે ટુકડાઓ બદલો' },
};

const SVG_BEAR = encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300">
  <rect width="300" height="300" fill="#4ade80"/>
  <circle cx="150" cy="150" r="80" fill="#8b5cf6"/>
  <circle cx="80" cy="90" r="30" fill="#7c3aed"/>
  <circle cx="220" cy="90" r="30" fill="#7c3aed"/>
  <circle cx="80" cy="90" r="15" fill="#fbcfe8"/>
  <circle cx="220" cy="90" r="15" fill="#fbcfe8"/>
  <circle cx="120" cy="130" r="10" fill="#ffffff"/>
  <circle cx="180" cy="130" r="10" fill="#ffffff"/>
  <circle cx="120" cy="130" r="5" fill="#000000"/>
  <circle cx="180" cy="130" r="5" fill="#000000"/>
  <ellipse cx="150" cy="170" rx="30" ry="25" fill="#fbcfe8"/>
  <ellipse cx="150" cy="160" rx="10" ry="8" fill="#000000"/>
  <path d="M 140 175 Q 150 185 160 175" stroke="#000000" stroke-width="3" fill="none" stroke-linecap="round"/>
</svg>
`);

const SVG_CAR = encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300">
  <rect width="300" height="300" fill="#60a5fa"/>
  <rect x="50" y="150" width="200" height="60" rx="10" fill="#ef4444"/>
  <path d="M 80 150 L 100 100 L 200 100 L 220 150 Z" fill="#fca5a5"/>
  <circle cx="90" cy="210" r="25" fill="#1f2937"/>
  <circle cx="90" cy="210" r="10" fill="#9ca3af"/>
  <circle cx="210" cy="210" r="25" fill="#1f2937"/>
  <circle cx="210" cy="210" r="10" fill="#9ca3af"/>
  <rect x="140" y="105" width="50" height="40" fill="#bfdbfe"/>
</svg>
`);

const SVG_HOUSE = encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300">
  <rect width="300" height="300" fill="#fde047"/>
  <rect x="80" y="140" width="140" height="120" fill="#f8fafc"/>
  <polygon points="150,50 50,140 250,140" fill="#ef4444"/>
  <rect x="130" y="200" width="40" height="60" fill="#8b5cf6"/>
  <circle cx="160" cy="230" r="4" fill="#fbbf24"/>
  <rect x="100" y="160" width="30" height="30" fill="#93c5fd"/>
  <rect x="170" y="160" width="30" height="30" fill="#93c5fd"/>
</svg>
`);

const SVG_FLOWER = encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300">
  <rect width="300" height="300" fill="#a7f3d0"/>
  <rect x="145" y="150" width="10" height="120" fill="#16a34a"/>
  <path d="M 145 220 Q 100 200 145 250" fill="#22c55e"/>
  <path d="M 155 200 Q 200 180 155 230" fill="#22c55e"/>
  <circle cx="150" cy="130" r="30" fill="#fbbf24"/>
  <circle cx="150" cy="80" r="25" fill="#f472b6"/>
  <circle cx="150" cy="180" r="25" fill="#f472b6"/>
  <circle cx="100" cy="130" r="25" fill="#f472b6"/>
  <circle cx="200" cy="130" r="25" fill="#f472b6"/>
  <circle cx="115" cy="95" r="25" fill="#f472b6"/>
  <circle cx="185" cy="95" r="25" fill="#f472b6"/>
  <circle cx="115" cy="165" r="25" fill="#f472b6"/>
  <circle cx="185" cy="165" r="25" fill="#f472b6"/>
</svg>
`);

const SVG_ROCKET = encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300">
  <rect width="300" height="300" fill="#1e1b4b"/>
  <circle cx="50" cy="50" r="2" fill="#fff"/>
  <circle cx="250" cy="80" r="3" fill="#fff"/>
  <circle cx="80" cy="220" r="2" fill="#fff"/>
  <circle cx="220" cy="250" r="2" fill="#fff"/>
  <path d="M 150 40 Q 180 100 180 180 L 120 180 Q 120 100 150 40 Z" fill="#e2e8f0"/>
  <path d="M 120 180 L 90 220 L 130 180 Z" fill="#ef4444"/>
  <path d="M 180 180 L 210 220 L 170 180 Z" fill="#ef4444"/>
  <circle cx="150" cy="120" r="15" fill="#38bdf8"/>
  <path d="M 130 180 Q 150 220 170 180 Z" fill="#f97316"/>
  <path d="M 140 180 Q 150 200 160 180 Z" fill="#fbbf24"/>
</svg>
`);

const IMAGES = [
  `data:image/svg+xml;utf8,${SVG_BEAR}`,
  `data:image/svg+xml;utf8,${SVG_CAR}`,
  `data:image/svg+xml;utf8,${SVG_HOUSE}`,
  `data:image/svg+xml;utf8,${SVG_FLOWER}`,
  `data:image/svg+xml;utf8,${SVG_ROCKET}`
];

export default function Jigsaw({ language, onComplete, onBack, onScore }: ActivityProps) {
  const [pieces, setPieces] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [imageUrl, setImageUrl] = useState(IMAGES[0]);
  const [showPreview, setShowPreview] = useState(false);
  const t = TRANSLATIONS[language];

  const generateLevel = () => {
    setImageUrl(IMAGES[Math.floor(Math.random() * IMAGES.length)]);
    let newPieces = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    // Shuffle
    for (let i = newPieces.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newPieces[i], newPieces[j]] = [newPieces[j], newPieces[i]];
    }
    setPieces(newPieces);
    setSelected(null);
  };

  useEffect(() => {
    generateLevel();
    playAudio(t.instruction, language);
  }, []);

  const handlePieceClick = (index: number) => {
    if (selected === null) {
      setSelected(index);
      playAudio('Pop', 'en-IN');
    } else {
      const newPieces = [...pieces];
      [newPieces[selected], newPieces[index]] = [newPieces[index], newPieces[selected]];
      setPieces(newPieces);
      setSelected(null);

      if (newPieces.every((p, i) => p === i)) {
        confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
        playAudio('Perfect picture!', 'en-IN');
        if (onScore) onScore(10);
        setTimeout(generateLevel, 3000);
      } else {
        playAudio('Click', 'en-IN');
      }
    }
  };

  return (
    <div className="flex flex-col h-full">
      <ActivityHeader title={t.title} instruction={t.instruction} language={language} onBack={onBack} />
      
      <div className="flex-1 flex flex-col items-center justify-center gap-8 relative">
        <button 
          className="absolute top-0 right-4 sm:right-8 flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md text-slate-600 font-bold hover:bg-slate-50 active:scale-95 transition-all z-10"
          onPointerDown={() => setShowPreview(true)}
          onPointerUp={() => setShowPreview(false)}
          onPointerLeave={() => setShowPreview(false)}
        >
          {showPreview ? <EyeOff size={20} /> : <Eye size={20} />}
          Preview
        </button>

        <div className="w-[300px] h-[300px] sm:w-[360px] sm:h-[360px] relative bg-slate-200 p-2 rounded-xl shadow-2xl">
          <AnimatePresence>
            {showPreview && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-2 z-20 rounded-lg overflow-hidden"
                style={{
                  backgroundImage: `url(${imageUrl})`,
                  backgroundSize: '100% 100%',
                }}
              />
            )}
          </AnimatePresence>
          <div className="w-full h-full grid grid-cols-3 gap-1">
            {pieces.map((piece, i) => {
              const x = (piece % 3) * 50;
              const y = Math.floor(piece / 3) * 50;
              return (
                <motion.div
                  key={i}
                  whileHover={{ scale: 0.95 }}
                  onClick={() => handlePieceClick(i)}
                  className={`cursor-pointer rounded-lg overflow-hidden border-2 ${selected === i ? 'border-sky-500 scale-95' : 'border-transparent'}`}
                  style={{
                    backgroundImage: `url(${imageUrl})`,
                    backgroundSize: '300% 300%',
                    backgroundPosition: `${x}% ${y}%`,
                  }}
                />
              );
            })}
          </div>
        </div>
        <div className="text-slate-500 font-medium bg-white px-6 py-2 rounded-full shadow-sm">
          Tap two pieces to swap them. Hold Preview to peek!
        </div>
      </div>
    </div>
  );
}
