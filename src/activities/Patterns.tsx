import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { ActivityProps } from '../types';
import { ActivityHeader } from '../components/ActivityHeader';
import { playAudio } from '../lib/audio';

const EMOJIS = ['🍎', '🍌', '🚗', '🎈', '🐶', '🐱', '🧸', '🌟', '🌸', '🦋'];

const TRANSLATIONS = {
  'en-IN': { title: 'Pattern Puzzle', instruction: 'What comes next?' },
  'hi-IN': { title: 'पैटर्न पहेली', instruction: 'आगे क्या आएगा?' },
  'gu-IN': { title: 'પેટર્ન કોયડો', instruction: 'આગળ શું આવશે?' },
};

export default function Patterns({ language, onComplete, onBack, onScore }: ActivityProps) {
  const [pattern, setPattern] = useState<string[]>([]);
  const [target, setTarget] = useState('');
  const [options, setOptions] = useState<string[]>([]);
  const [round, setRound] = useState(0);
  const t = TRANSLATIONS[language];

  const generateLevel = () => {
    const e1 = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
    let e2 = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
    while (e2 === e1) e2 = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];

    const pat = [e1, e2, e1, e2, e1];
    setPattern(pat);
    setTarget(e2);
    
    let opts = [e2];
    while (opts.length < 3) {
      const wrong = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
      if (!opts.includes(wrong)) opts.push(wrong);
    }
    setOptions(opts.sort(() => Math.random() - 0.5));
  };

  useEffect(() => {
    generateLevel();
    playAudio(t.instruction, language);
  }, []);

  const handleOptionClick = (opt: string) => {
    if (opt === target) {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      playAudio('Super!', 'en-IN');
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
      
      <div className="flex-1 flex flex-col items-center justify-center gap-16">
        <div className="flex items-center gap-2 sm:gap-4 bg-white px-6 sm:px-12 py-4 sm:py-8 rounded-full shadow-xl border-4 border-emerald-100">
          {pattern.map((emoji, i) => (
            <motion.span 
              key={i} 
              initial={{ scale: 0 }} 
              animate={{ scale: 1 }} 
              transition={{ delay: i * 0.1 }}
              className="text-4xl sm:text-6xl"
            >
              {emoji}
            </motion.span>
          ))}
          <span className="text-4xl sm:text-6xl text-slate-300 ml-2 sm:ml-4">❓</span>
        </div>

        <div className="flex gap-4 sm:gap-8">
          {options.map((opt, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.1, y: -10 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleOptionClick(opt)}
              className="w-24 h-24 sm:w-32 sm:h-32 bg-emerald-50 text-white rounded-3xl shadow-lg border-4 border-emerald-200 flex items-center justify-center text-5xl sm:text-7xl font-bold hover:bg-emerald-100 transition-all"
            >
              {opt}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
