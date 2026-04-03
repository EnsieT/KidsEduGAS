import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { ActivityProps } from '../types';
import { ActivityHeader } from '../components/ActivityHeader';
import { playAudio } from '../lib/audio';

const EMOJIS = ['🍎', '🍌', '🚗', '🎈', '🐶', '🐱', '🧸', '🌟'];

const TRANSLATIONS = {
  'en-IN': { title: 'Counting Fun', instruction: 'How many objects are there?' },
  'hi-IN': { title: 'गिनती का मज़ा', instruction: 'यहाँ कितनी वस्तुएँ हैं?' },
  'gu-IN': { title: 'ગણતરીની મજા', instruction: 'અહીં કેટલી વસ્તુઓ છે?' },
};

export default function Counting({ language, onComplete, onBack, onScore }: ActivityProps) {
  const [count, setCount] = useState(0);
  const [emoji, setEmoji] = useState('');
  const [options, setOptions] = useState<number[]>([]);
  const [round, setRound] = useState(0);
  const t = TRANSLATIONS[language];

  const generateLevel = () => {
    const newCount = Math.floor(Math.random() * 9) + 1; // 1 to 9
    setCount(newCount);
    setEmoji(EMOJIS[Math.floor(Math.random() * EMOJIS.length)]);
    
    let opts = [newCount];
    while (opts.length < 3) {
      const wrong = Math.floor(Math.random() * 9) + 1;
      if (!opts.includes(wrong)) opts.push(wrong);
    }
    setOptions(opts.sort(() => Math.random() - 0.5));
  };

  useEffect(() => {
    generateLevel();
    playAudio(t.instruction, language);
  }, []);

  const handleOptionClick = (opt: number) => {
    if (opt === count) {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      playAudio('Yay! Correct!', 'en-IN');
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
      playAudio('Oops! Try again.', 'en-IN');
    }
  };

  return (
    <div className="flex flex-col h-full">
      <ActivityHeader title={t.title} instruction={t.instruction} language={language} onBack={onBack} />
      
      <div className="flex-1 flex flex-col items-center justify-center gap-12">
        <div className="flex flex-wrap justify-center gap-4 max-w-md">
          {Array.from({ length: count }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', delay: i * 0.1 }}
              className="text-6xl"
            >
              {emoji}
            </motion.div>
          ))}
        </div>

        <div className="flex gap-4 sm:gap-6 flex-wrap justify-center">
          {options.map((opt, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleOptionClick(opt)}
              className="w-20 h-20 sm:w-24 sm:h-24 text-3xl sm:text-4xl font-bold bg-white rounded-3xl shadow-lg text-indigo-600 border-4 border-indigo-100 hover:border-indigo-300 transition-colors"
            >
              {opt}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
