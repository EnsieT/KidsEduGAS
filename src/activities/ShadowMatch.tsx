import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { ActivityProps } from '../types';
import { ActivityHeader } from '../components/ActivityHeader';
import { playAudio } from '../lib/audio';

const TRANSLATIONS = {
  'en-IN': { title: 'Shadow Match', instruction: 'Match the object to its shadow!' },
  'hi-IN': { title: 'परछाई मिलाओ', instruction: 'वस्तु को उसकी परछाई से मिलाओ!' },
  'gu-IN': { title: 'પડછાયો મેળવો', instruction: 'વસ્તુને તેના પડછાયા સાથે મેળવો!' },
};

const ITEMS = [
  { id: 1, emoji: '🍎' },
  { id: 2, emoji: '🚗' },
  { id: 3, emoji: '🐶' },
  { id: 4, emoji: '🧸' },
  { id: 5, emoji: '🦋' },
  { id: 6, emoji: '🎸' },
  { id: 7, emoji: '🚀' },
  { id: 8, emoji: '🍕' },
];

export default function ShadowMatch({ language, onComplete, onBack, onScore }: ActivityProps) {
  const [target, setTarget] = useState(ITEMS[0]);
  const [options, setOptions] = useState<typeof ITEMS>([]);
  const [round, setRound] = useState(0);
  const t = TRANSLATIONS[language];

  const generateLevel = () => {
    const shuffled = [...ITEMS].sort(() => 0.5 - Math.random());
    const newTarget = shuffled[0];
    const newOptions = shuffled.slice(0, 3).sort(() => 0.5 - Math.random());
    
    setTarget(newTarget);
    setOptions(newOptions);
  };

  useEffect(() => {
    generateLevel();
    playAudio(t.instruction, language);
  }, []);

  const handleMatch = (selectedId: number) => {
    if (selectedId === target.id) {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      playAudio('Great job!', 'en-IN');
      if (onScore) onScore(10);
      
      const nextRound = round + 1;
      setRound(nextRound);
      
      setTimeout(() => {
        if (nextRound >= 5) {
          onComplete();
        } else {
          generateLevel();
        }
      }, 1500);
    } else {
      playAudio('Try again.', 'en-IN');
    }
  };

  return (
    <div className="flex flex-col h-full">
      <ActivityHeader title={t.title} instruction={t.instruction} language={language} onBack={onBack} />
      
      <div className="flex-1 flex flex-col items-center justify-center gap-12">
        {/* Target Shadow */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          key={target.id}
          className="w-48 h-48 bg-slate-200 rounded-3xl flex items-center justify-center border-4 border-slate-300 shadow-inner"
        >
          <span 
            className="text-8xl brightness-0 opacity-40 drop-shadow-md"
            style={{ filter: 'brightness(0) drop-shadow(0 4px 4px rgba(0,0,0,0.2))' }}
          >
            {target.emoji}
          </span>
        </motion.div>

        {/* Options */}
        <div className="flex gap-6">
          {options.map((option, i) => (
            <motion.button
              key={`${option.id}-${i}`}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.1, y: -5 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleMatch(option.id)}
              className="w-32 h-32 bg-white rounded-3xl shadow-xl border-4 border-indigo-100 flex items-center justify-center text-6xl hover:border-indigo-400 hover:bg-indigo-50 transition-all"
            >
              {option.emoji}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
