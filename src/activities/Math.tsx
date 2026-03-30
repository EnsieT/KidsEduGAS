import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { ActivityProps } from '../types';
import { ActivityHeader } from '../components/ActivityHeader';
import { playAudio } from '../lib/audio';

const TRANSLATIONS = {
  'en-IN': { title: 'Math Magic', instruction: 'Add the numbers' },
  'hi-IN': { title: 'गणित का जादू', instruction: 'संख्याओं को जोड़ें' },
  'gu-IN': { title: 'ગણિતનો જાદુ', instruction: 'સંખ્યાઓ ઉમેરો' },
};

export default function MathActivity({ language, onComplete, onBack, onScore }: ActivityProps) {
  const [num1, setNum1] = useState(1);
  const [num2, setNum2] = useState(1);
  const [options, setOptions] = useState<number[]>([]);
  const t = TRANSLATIONS[language];

  const generateLevel = () => {
    const n1 = Math.floor(Math.random() * 5) + 1;
    const n2 = Math.floor(Math.random() * 5) + 1;
    setNum1(n1);
    setNum2(n2);
    const sum = n1 + n2;
    
    let opts = [sum];
    while (opts.length < 3) {
      const wrong = Math.floor(Math.random() * 10) + 2;
      if (!opts.includes(wrong)) opts.push(wrong);
    }
    setOptions(opts.sort(() => Math.random() - 0.5));
  };

  useEffect(() => {
    generateLevel();
    playAudio(t.instruction, language);
  }, []);

  const handleOptionClick = (opt: number) => {
    if (opt === num1 + num2) {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      playAudio('You are a genius!', 'en-IN');
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
        <div className="flex items-center gap-4 sm:gap-8 text-6xl sm:text-8xl font-black text-indigo-800 bg-white px-8 sm:px-12 py-6 sm:py-8 rounded-3xl shadow-xl border-4 border-indigo-100">
          <motion.span initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>{num1}</motion.span>
          <span className="text-pink-500">+</span>
          <motion.span initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>{num2}</motion.span>
          <span className="text-pink-500">=</span>
          <span className="text-slate-300">?</span>
        </div>

        <div className="flex gap-4 sm:gap-8">
          {options.map((opt, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.1, y: -10 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleOptionClick(opt)}
              className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-2xl shadow-lg border-4 border-indigo-200 flex items-center justify-center text-5xl sm:text-6xl font-bold hover:shadow-2xl transition-all"
            >
              {opt}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
