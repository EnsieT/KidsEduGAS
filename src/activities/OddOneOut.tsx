import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { ActivityProps } from '../types';
import { ActivityHeader } from '../components/ActivityHeader';
import { playAudio } from '../lib/audio';

const EMOJIS = ['🍎', '🍌', '🚗', '🎈', '🐶', '🐱', '🧸', '🌟', '🌸', '🦋'];

const TRANSLATIONS = {
  'en-IN': { title: 'Odd One Out', instruction: 'Find the odd one out' },
  'hi-IN': { title: 'सबसे अलग खोजें', instruction: 'सबसे अलग खोजें' },
  'gu-IN': { title: 'સૌથી અલગ શોધો', instruction: 'સૌથી અલગ શોધો' },
};

export default function OddOneOut({ language, onComplete, onBack, onScore }: ActivityProps) {
  const [items, setItems] = useState<{ emoji: string; isOdd: boolean }[]>([]);
  const t = TRANSLATIONS[language];

  const generateLevel = () => {
    const normal = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
    let odd = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
    while (odd === normal) odd = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];

    const newItems = [
      { emoji: normal, isOdd: false },
      { emoji: normal, isOdd: false },
      { emoji: normal, isOdd: false },
      { emoji: odd, isOdd: true },
    ];
    
    setItems(newItems.sort(() => Math.random() - 0.5));
  };

  useEffect(() => {
    generateLevel();
    playAudio(t.instruction, language);
  }, []);

  const handleOptionClick = (isOdd: boolean) => {
    if (isOdd) {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      playAudio('You found it!', 'en-IN');
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
        <div className="grid grid-cols-2 gap-4 sm:gap-8">
          {items.map((item, i) => (
            <motion.button
              key={i}
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleOptionClick(item.isOdd)}
              className="w-32 h-32 sm:w-40 sm:h-40 bg-white rounded-3xl shadow-xl border-4 border-orange-100 flex items-center justify-center text-6xl sm:text-8xl hover:border-orange-400 hover:bg-orange-50 transition-all"
            >
              {item.emoji}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
