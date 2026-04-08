import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { ActivityProps } from '../types';
import { ActivityHeader } from '../components/ActivityHeader';
import { playAudio } from '../lib/audio';

const LEVELS = [
  {
    id: 'house',
    regions: [
      { id: 'roof', d: 'M 50 10 L 90 40 L 10 40 Z', color: '#ef4444', num: 1, textX: 50, textY: 30 },
      { id: 'wall', d: 'M 20 40 L 80 40 L 80 90 L 20 90 Z', color: '#eab308', num: 2, textX: 50, textY: 55 },
      { id: 'door', d: 'M 40 60 L 60 60 L 60 90 L 40 90 Z', color: '#8b5cf6', num: 3, textX: 50, textY: 75 },
      { id: 'window1', d: 'M 25 50 L 35 50 L 35 60 L 25 60 Z', color: '#3b82f6', num: 4, textX: 30, textY: 57 },
      { id: 'window2', d: 'M 65 50 L 75 50 L 75 60 L 65 60 Z', color: '#3b82f6', num: 4, textX: 70, textY: 57 },
      { id: 'sun', d: 'M 85 15 A 10 10 0 1 1 84.9 15 Z', color: '#f97316', num: 5, textX: 85, textY: 18 },
    ],
    palette: [
      { num: 1, color: '#ef4444' },
      { num: 2, color: '#eab308' },
      { num: 3, color: '#8b5cf6' },
      { num: 4, color: '#3b82f6' },
      { num: 5, color: '#f97316' },
    ]
  },
  {
    id: 'car',
    regions: [
      { id: 'body', d: 'M 10 60 L 90 60 L 90 80 L 10 80 Z', color: '#ef4444', num: 1, textX: 50, textY: 72 },
      { id: 'top', d: 'M 25 40 L 75 40 L 85 60 L 15 60 Z', color: '#3b82f6', num: 2, textX: 50, textY: 52 },
      { id: 'wheel1', d: 'M 30 80 A 10 10 0 1 1 29.9 80 Z', color: '#1f2937', num: 3, textX: 30, textY: 83 },
      { id: 'wheel2', d: 'M 70 80 A 10 10 0 1 1 69.9 80 Z', color: '#1f2937', num: 3, textX: 70, textY: 83 },
      { id: 'window', d: 'M 35 45 L 65 45 L 70 55 L 30 55 Z', color: '#93c5fd', num: 4, textX: 50, textY: 52 },
    ],
    palette: [
      { num: 1, color: '#ef4444' },
      { num: 2, color: '#3b82f6' },
      { num: 3, color: '#1f2937' },
      { num: 4, color: '#93c5fd' },
    ]
  },
  {
    id: 'tree',
    regions: [
      { id: 'trunk', d: 'M 45 60 L 55 60 L 55 95 L 45 95 Z', color: '#78350f', num: 1, textX: 50, textY: 80 },
      { id: 'leaves1', d: 'M 50 10 A 25 25 0 1 1 49.9 10 Z', color: '#22c55e', num: 2, textX: 50, textY: 35 },
      { id: 'leaves2', d: 'M 30 35 A 20 20 0 1 1 29.9 35 Z', color: '#22c55e', num: 2, textX: 30, textY: 35 },
      { id: 'leaves3', d: 'M 70 35 A 20 20 0 1 1 69.9 35 Z', color: '#22c55e', num: 2, textX: 70, textY: 35 },
      { id: 'apple1', d: 'M 50 25 A 4 4 0 1 1 49.9 25 Z', color: '#ef4444', num: 3, textX: 50, textY: 26 },
      { id: 'apple2', d: 'M 35 45 A 4 4 0 1 1 34.9 45 Z', color: '#ef4444', num: 3, textX: 35, textY: 46 },
      { id: 'apple3', d: 'M 65 45 A 4 4 0 1 1 64.9 45 Z', color: '#ef4444', num: 3, textX: 65, textY: 46 },
    ],
    palette: [
      { num: 1, color: '#78350f' },
      { num: 2, color: '#22c55e' },
      { num: 3, color: '#ef4444' },
    ]
  },
  {
    id: 'boat',
    regions: [
      { id: 'hull', d: 'M 20 70 L 80 70 L 70 90 L 30 90 Z', color: '#b45309', num: 1, textX: 50, textY: 82 },
      { id: 'sail', d: 'M 50 20 L 50 65 L 80 65 Z', color: '#fcd34d', num: 2, textX: 60, textY: 55 },
      { id: 'mast', d: 'M 48 15 L 52 15 L 52 70 L 48 70 Z', color: '#451a03', num: 3, textX: 50, textY: 40 },
      { id: 'water', d: 'M 0 85 Q 25 75 50 85 T 100 85 L 100 100 L 0 100 Z', color: '#3b82f6', num: 4, textX: 50, textY: 95 },
    ],
    palette: [
      { num: 1, color: '#b45309' },
      { num: 2, color: '#fcd34d' },
      { num: 3, color: '#451a03' },
      { num: 4, color: '#3b82f6' },
    ]
  },
  {
    id: 'flower',
    regions: [
      { id: 'stem', d: 'M 48 50 L 52 50 L 52 95 L 48 95 Z', color: '#16a34a', num: 1, textX: 50, textY: 75 },
      { id: 'leaf1', d: 'M 48 70 Q 30 60 35 80 Z', color: '#22c55e', num: 2, textX: 40, textY: 72 },
      { id: 'leaf2', d: 'M 52 60 Q 70 50 65 70 Z', color: '#22c55e', num: 2, textX: 60, textY: 62 },
      { id: 'center', d: 'M 50 40 A 10 10 0 1 1 49.9 40 Z', color: '#eab308', num: 3, textX: 50, textY: 42 },
      { id: 'petal1', d: 'M 50 20 A 10 10 0 1 1 49.9 20 Z', color: '#ec4899', num: 4, textX: 50, textY: 22 },
      { id: 'petal2', d: 'M 70 40 A 10 10 0 1 1 69.9 40 Z', color: '#ec4899', num: 4, textX: 70, textY: 42 },
      { id: 'petal3', d: 'M 50 60 A 10 10 0 1 1 49.9 60 Z', color: '#ec4899', num: 4, textX: 50, textY: 62 },
      { id: 'petal4', d: 'M 30 40 A 10 10 0 1 1 29.9 40 Z', color: '#ec4899', num: 4, textX: 30, textY: 42 },
    ],
    palette: [
      { num: 1, color: '#16a34a' },
      { num: 2, color: '#22c55e' },
      { num: 3, color: '#eab308' },
      { num: 4, color: '#ec4899' },
    ]
  }
];

const TRANSLATIONS = {
  'en-IN': { title: 'Color by Number', instruction: 'Select a color and fill the matching number' },
  'hi-IN': { title: 'नंबर से रंग भरें', instruction: 'रंग चुनें और सही नंबर में भरें' },
  'gu-IN': { title: 'નંબર દ્વારા રંગ', instruction: 'રંગ પસંદ કરો અને સાચા નંબરમાં ભરો' },
};

export default function ColorByNumber({ language, onComplete, onBack, onScore }: ActivityProps) {
  const [levels, setLevels] = useState<typeof LEVELS>([]);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [selectedNum, setSelectedNum] = useState<number | null>(null);
  const [filled, setFilled] = useState<Record<string, string>>({});
  const t = TRANSLATIONS[language];

  useEffect(() => {
    setLevels([...LEVELS].sort(() => Math.random() - 0.5));
  }, []);

  const level = levels[currentLevel];

  useEffect(() => {
    if (level) {
      playAudio(t.instruction, language);
    }
  }, [currentLevel, language, level, t.instruction]);

  const handleRegionClick = (region: typeof LEVELS[0]['regions'][0]) => {
    if (!level) return;
    if (selectedNum === region.num) {
      const newFilled = { ...filled, [region.id]: region.color };
      setFilled(newFilled);
      playAudio('Good!', 'en-IN');
      
      if (Object.keys(newFilled).length === level.regions.length) {
        confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
        playAudio('Beautiful picture!', 'en-IN');
        if (onScore) onScore(10);
        setTimeout(() => {
          setFilled({});
          const nextLevel = currentLevel + 1;
          if (nextLevel >= levels.length) {
            onComplete();
          } else {
            setCurrentLevel(nextLevel);
          }
        }, 3000);
      }
    } else {
      playAudio('Wrong color!', 'en-IN');
    }
  };

  if (!level) return null;

  return (
    <div className="flex flex-col h-full">
      <ActivityHeader title={t.title} instruction={t.instruction} language={language} onBack={onBack} />
      
      <div className="flex-1 flex flex-col items-center justify-center gap-8">
        <div className="w-72 h-72 sm:w-80 sm:h-80 bg-white rounded-3xl shadow-inner border-4 border-slate-200 relative">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {level.regions.map(r => (
              <g key={r.id} onClick={() => handleRegionClick(r)} className="cursor-pointer hover:opacity-80 transition-opacity">
                <path 
                  d={r.d} 
                  fill={filled[r.id] || '#f1f5f9'} 
                  stroke="#94a3b8" 
                  strokeWidth="1" 
                />
                {!filled[r.id] && (
                  <text 
                    x={r.textX} 
                    y={r.textY} 
                    textAnchor="middle" 
                    fontSize="6" 
                    fill="#64748b"
                    className="pointer-events-none font-bold"
                  >
                    {r.num}
                  </text>
                )}
              </g>
            ))}
          </svg>
        </div>

        <div className="flex gap-2 sm:gap-4 flex-wrap justify-center max-w-md">
          {level.palette.map(p => (
            <motion.button
              key={p.num}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSelectedNum(p.num)}
              className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl shadow-md border-4 flex items-center justify-center text-xl sm:text-2xl font-bold text-white transition-all ${selectedNum === p.num ? 'scale-110 border-slate-800' : 'border-transparent'}`}
              style={{ backgroundColor: p.color }}
            >
              {p.num}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
