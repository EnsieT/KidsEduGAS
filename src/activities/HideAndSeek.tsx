import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { ActivityProps } from '../types';
import { ActivityHeader } from '../components/ActivityHeader';
import { playAudio } from '../lib/audio';

const TRANSLATIONS = {
  'en-IN': { title: 'Hide & Seek', instruction: 'Find the hidden items!', found: 'Found it!' },
  'hi-IN': { title: 'लुका-छिपी', instruction: 'छिपी हुई चीजें खोजें!', found: 'मिल गया!' },
  'gu-IN': { title: 'સંતાકૂકડી', instruction: 'છુપાયેલી વસ્તુઓ શોધો!', found: 'મળી ગયું!' },
};

const DISTRACTORS = ['🌳', '☁️', '🍄', '🌻', '🌲', '🏡', '🍎', '🦋', '🌿', '🍂', '🌷', '🌼', '🪵', '🐌', '🐞'];
const TARGETS_POOL = ['🐶', '🐱', '🦊', '🐰', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵'];

export default function HideAndSeek({ language, onComplete, onBack, onScore }: ActivityProps) {
  const [targets, setTargets] = useState<{ id: string; emoji: string; col: number; row: number }[]>([]);
  const [distractors, setDistractors] = useState<{ id: string; emoji: string; col: number; row: number }[]>([]);
  const [found, setFound] = useState<string[]>([]);
  const [round, setRound] = useState(0);
  const t = TRANSLATIONS[language];

  const generateLevel = () => {
    // 8 columns x 6 rows grid = 48 slots
    const slots = Array.from({ length: 48 }, (_, i) => ({ col: i % 8, row: Math.floor(i / 8) }));
    const shuffledSlots = slots.sort(() => Math.random() - 0.5);
    
    // Pick 3 targets
    const shuffledTargets = [...TARGETS_POOL].sort(() => Math.random() - 0.5).slice(0, 3);
    const newTargets = shuffledTargets.map((emoji, i) => ({
      id: `target-${i}`,
      emoji,
      col: shuffledSlots[i].col,
      row: shuffledSlots[i].row,
      jitterX: (Math.random() - 0.5) * 4,
      jitterY: (Math.random() - 0.5) * 4,
    }));

    // Pick 45 distractors to fill the rest of the grid
    const newDistractors = [];
    for (let i = 3; i < 48; i++) {
      newDistractors.push({
        id: `distractor-${i}`,
        emoji: DISTRACTORS[Math.floor(Math.random() * DISTRACTORS.length)],
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
    generateLevel();
    playAudio(t.instruction, language);
  }, [round, language, t.instruction]);

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
        if (round < 2) {
          setRound(r => r + 1);
        } else {
          onComplete();
        }
      }, 3000);
    }
  };

  const handleDistractorClick = () => {
    playAudio('Boing', 'en-IN');
  };

  return (
    <div className="flex flex-col h-full">
      <ActivityHeader title={t.title} instruction={t.instruction} language={language} onBack={onBack} />
      
      <div className="flex-1 flex flex-col items-center justify-center gap-4 mt-4">
        {/* Targets to find */}
        <div className="flex gap-4 bg-white/80 p-4 rounded-2xl shadow-sm border-2 border-green-200">
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
        <div className="relative w-full max-w-3xl aspect-[4/3] bg-green-50 rounded-3xl border-4 border-green-200 overflow-hidden shadow-inner">
          {distractors.map(d => (
            <motion.div
              key={d.id}
              className="absolute text-3xl sm:text-4xl md:text-5xl cursor-pointer select-none"
              style={{ left: `calc(${(d.col / 8) * 100}% + ${d.jitterX}%)`, top: `calc(${(d.row / 6) * 100}% + ${d.jitterY}%)`, marginLeft: '1%', marginTop: '1%' }}
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
              className="absolute text-3xl sm:text-4xl md:text-5xl cursor-pointer select-none z-10"
              style={{ left: `calc(${(t.col / 8) * 100}% + ${t.jitterX}%)`, top: `calc(${(t.row / 6) * 100}% + ${t.jitterY}%)`, marginLeft: '1%', marginTop: '1%' }}
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
