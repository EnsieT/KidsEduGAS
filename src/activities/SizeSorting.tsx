import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { ActivityProps } from '../types';
import { ActivityHeader } from '../components/ActivityHeader';
import { playAudio } from '../lib/audio';

const EMOJIS = ['🍎', '🍌', '🚗', '🎈', '🐶', '🐱', '🧸', '🌟', '🌸', '🦋'];

const TRANSLATIONS = {
  'en-IN': { title: 'Size Sorter', instruction: 'Find the biggest one' },
  'hi-IN': { title: 'आकार छाँटें', instruction: 'सबसे बड़ा खोजें' },
  'gu-IN': { title: 'કદ પ્રમાણે ગોઠવો', instruction: 'સૌથી મોટું શોધો' },
};

export default function SizeSorting({ language, onComplete, onBack, onScore }: ActivityProps) {
  const [items, setItems] = useState<{ id: number; emoji: string; scale: number; isBiggest: boolean }[]>([]);
  const t = TRANSLATIONS[language];

  const generateLevel = () => {
    const emoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
    const scales = [0.5, 0.7, 1.0, 1.5]; // 1.5 is the biggest
    const shuffledScales = [...scales].sort(() => Math.random() - 0.5);
    
    const newItems = shuffledScales.map((scale, i) => ({
      id: i,
      emoji,
      scale,
      isBiggest: scale === 1.5,
    }));
    
    setItems(newItems);
  };

  useEffect(() => {
    generateLevel();
    playAudio(t.instruction, language);
  }, []);

  const handleOptionClick = (isBiggest: boolean) => {
    if (isBiggest) {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      playAudio('Fantastic!', 'en-IN');
      if (onScore) onScore(10);
      setTimeout(() => {
        generateLevel();
      }, 1500);
    } else {
      playAudio('Try again.', 'en-IN');
    }
  };

  return (
    <div className="flex flex-col h-full">
      <ActivityHeader title={t.title} instruction={t.instruction} language={language} onBack={onBack} />
      
      <div className="flex-1 flex flex-col items-center justify-center gap-16">
        <div className="flex items-end justify-center gap-8 h-64">
          {items.map((item) => (
            <motion.button
              key={item.id}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: 'spring', delay: item.id * 0.1 }}
              whileHover={{ scale: 1.1, y: -10 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleOptionClick(item.isBiggest)}
              className="bg-white rounded-3xl shadow-xl border-4 border-lime-100 flex items-center justify-center hover:border-lime-400 hover:bg-lime-50 transition-all"
              style={{ 
                width: `${item.scale * 100}px`, 
                height: `${item.scale * 100}px`,
                fontSize: `${item.scale * 3}rem`
              }}
            >
              {item.emoji}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
