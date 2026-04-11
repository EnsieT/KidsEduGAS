import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { ActivityProps } from '../types';
import { ActivityHeader } from '../components/ActivityHeader';
import { playAudio } from '../lib/audio';

const TRANSLATIONS = {
  'en-IN': { title: 'Hide & Seek', instruction: 'Find the hidden items!', found: 'Found it!', select: 'Select a level' },
  'hi-IN': { title: 'लुका-छिपी', instruction: 'छिपी हुई चीजें खोजें!', found: 'मिल गया!', select: 'एक स्तर चुनें' },
  'gu-IN': { title: 'સંતાકૂકડી', instruction: 'છુપાયેલી વસ્તુઓ શોધો!', found: 'મળી ગયું!', select: 'સ્તર પસંદ કરો' },
};

const LEVELS = [
  { id: 'forest', targets: ['🐶', '🐱', '🐰'], distractors: ['🌳', '☁️', '🍄', '🌻', '🌲', '🏡', '🍎', '🦋', '🌿', '🍂', '🌷', '🌼', '🪵', '🐌', '🐞'], cols: 8, rows: 6, bg: 'bg-green-50', border: 'border-green-200' },
  { id: 'ocean', targets: ['🐠', '🐙', '🦀'], distractors: ['🌊', '🐚', '🫧', '🏝️', '⛵', '⚓', '🐟', '🐬', '🐳', '🦈', '🐡', '🦑', '🦐', '🦞', '🐢'], cols: 8, rows: 6, bg: 'bg-blue-50', border: 'border-blue-200' },
  { id: 'sky', targets: ['🦅', '🚀', '🚁'], distractors: ['☁️', '⭐', '🌙', '☀️', '🎈', '🪁', '✈️', '🛸', '🛰️', '☄️', '🌩️', '🌪️', '🌈', '🕊️', '🦇'], cols: 9, rows: 7, bg: 'bg-sky-50', border: 'border-sky-200' },
  { id: 'food', targets: ['🍔', '🍕', '🍩'], distractors: ['🍎', '🍌', '🍇', '🥕', '🥦', '🍓', '🍉', '🍒', '🍑', '🍍', '🥝', '🍅', '🌽', '🥑', '🥐'], cols: 9, rows: 7, bg: 'bg-orange-50', border: 'border-orange-200' },
  { id: 'spooky', targets: ['👻', '🦇', '🕷️'], distractors: ['🎃', '🕸️', '🍬', '🌑', '🥀', '🦉', '💀', '👽', '🧟', '🧛', '🏚️', '🕯️', '🩸', '🦴', '🐈‍⬛'], cols: 10, rows: 8, bg: 'bg-purple-50', border: 'border-purple-200' },
  { id: 'winter', targets: ['🐧', '🐻‍❄️', '🦭'], distractors: ['❄️', '⛄', '🏔️', '🧣', '🧤', '🧊', '🎿', '🏂', '🛷', '⛸️', '🌨️', '🌲', '🦌', '🦉', '🥶'], cols: 10, rows: 8, bg: 'bg-slate-50', border: 'border-slate-200' },
];

export default function HideAndSeek({ language, onComplete, onBack, onScore }: ActivityProps) {
  const [selectedLevelId, setSelectedLevelId] = useState<string | null>(null);
  const [levelIdx, setLevelIdx] = useState(0);
  const [targets, setTargets] = useState<{ id: string; emoji: string; col: number; row: number; jitterX: number; jitterY: number }[]>([]);
  const [distractors, setDistractors] = useState<{ id: string; emoji: string; col: number; row: number; jitterX: number; jitterY: number }[]>([]);
  const [found, setFound] = useState<string[]>([]);
  const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS] || TRANSLATIONS['en-IN'];

  const level = LEVELS[levelIdx];

  const generateLevel = () => {
    if (!selectedLevelId) return;
    const totalSlots = level.cols * level.rows;
    const slots = Array.from({ length: totalSlots }, (_, i) => ({ col: i % level.cols, row: Math.floor(i / level.cols) }));
    const shuffledSlots = slots.sort(() => Math.random() - 0.5);
    
    const shuffledTargets = [...level.targets].sort(() => Math.random() - 0.5);
    const newTargets = shuffledTargets.map((emoji, i) => ({
      id: `target-${i}`,
      emoji,
      col: shuffledSlots[i].col,
      row: shuffledSlots[i].row,
      jitterX: (Math.random() - 0.5) * 4,
      jitterY: (Math.random() - 0.5) * 4,
    }));

    const newDistractors = [];
    for (let i = level.targets.length; i < totalSlots; i++) {
      newDistractors.push({
        id: `distractor-${i}`,
        emoji: level.distractors[Math.floor(Math.random() * level.distractors.length)],
        col: shuffledSlots[i].col,
        row: shuffledSlots[i].row,
        jitterX: (Math.random() - 0.5) * 4,
        jitterY: (Math.random() - 0.5) * 4,
      });
    }

    setTargets(newTargets);
    setDistractors(newDistractors);
    setFound([]);
  };

  useEffect(() => {
    if (selectedLevelId) {
      generateLevel();
      playAudio(t.instruction, language);
    }
  }, [selectedLevelId, language, t.instruction]);

  const handleLevelSelect = (id: string) => {
    const idx = LEVELS.findIndex(l => l.id === id);
    setLevelIdx(idx);
    setSelectedLevelId(id);
  };

  const handleTargetClick = (id: string) => {
    if (found.includes(id)) return;
    
    const newFound = [...found, id];
    setFound(newFound);
    playAudio('Pop', 'en-IN');
    
    if (newFound.length === targets.length) {
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
      playAudio('You found them all!', 'en-IN');
      if (onScore) onScore(15);
      
      setTimeout(() => {
        setSelectedLevelId(null);
      }, 3000);
    }
  };

  const handleDistractorClick = () => {
    playAudio('Boing', 'en-IN');
  };

  if (!selectedLevelId) {
    return (
      <div className="flex flex-col h-full">
        <ActivityHeader title={t.title} instruction={t.select || "Select a level"} language={language} onBack={onBack} />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl w-full">
            {LEVELS.map((l) => (
              <motion.button
                key={l.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleLevelSelect(l.id)}
                className={`bg-white p-6 rounded-3xl shadow-xl border-4 ${l.border} flex flex-col items-center gap-4 hover:opacity-80 transition-opacity`}
              >
                <div className="text-6xl">{l.targets[0]}</div>
                <span className="font-bold text-slate-700 uppercase tracking-wider">{l.id}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <ActivityHeader title={t.title} instruction={t.instruction} language={language} onBack={() => setSelectedLevelId(null)} />
      
      <div className="flex-1 flex flex-col items-center justify-center gap-4 mt-4">
        {/* Targets to find */}
        <div className={`flex gap-4 bg-white/80 p-4 rounded-2xl shadow-sm border-2 ${level.border}`}>
          {targets.map(t => (
            <div 
              key={t.id} 
              className={`text-4xl sm:text-5xl transition-all duration-500 ${found.includes(t.id) ? 'opacity-30 grayscale scale-75' : 'animate-bounce'}`}
            >
              {t.emoji}
            </div>
          ))}
        </div>

        {/* Play Area */}
        <div className={`relative w-full max-w-4xl aspect-[4/3] ${level.bg} rounded-3xl border-4 ${level.border} overflow-hidden shadow-inner`}>
          {distractors.map(d => (
            <motion.div
              key={d.id}
              className="absolute text-2xl sm:text-3xl md:text-4xl cursor-pointer select-none"
              style={{ left: `calc(${(d.col / level.cols) * 100}% + ${d.jitterX}%)`, top: `calc(${(d.row / level.rows) * 100}% + ${d.jitterY}%)`, marginLeft: '1%', marginTop: '1%' }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleDistractorClick}
            >
              {d.emoji}
            </motion.div>
          ))}

          {targets.map(t => (
            <motion.div
              key={t.id}
              className="absolute text-2xl sm:text-3xl md:text-4xl cursor-pointer select-none z-10"
              style={{ left: `calc(${(t.col / level.cols) * 100}% + ${t.jitterX}%)`, top: `calc(${(t.row / level.rows) * 100}% + ${t.jitterY}%)`, marginLeft: '1%', marginTop: '1%' }}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.8 }}
              onClick={() => handleTargetClick(t.id)}
            >
              <div className="relative">
                <span className={found.includes(t.id) ? "opacity-0" : ""}>{t.emoji}</span>
                {found.includes(t.id) && (
                  <motion.div
                    initial={{ scale: 1 }}
                    animate={{ scale: 2, opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 flex items-center justify-center text-green-500"
                  >
                    ✨
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
