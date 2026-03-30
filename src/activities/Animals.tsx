import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { ActivityProps } from '../types';
import { ActivityHeader } from '../components/ActivityHeader';
import { playAudio } from '../lib/audio';

const ANIMALS = [
  { emoji: '🐶', en: 'Dog', hi: 'कुत्ता', gu: 'કૂતરો' },
  { emoji: '🐱', en: 'Cat', hi: 'बिल्ली', gu: 'બિલાડી' },
  { emoji: '🐘', en: 'Elephant', hi: 'हाथी', gu: 'હાથી' },
  { emoji: '🦁', en: 'Lion', hi: 'शेर', gu: 'સિંહ' },
  { emoji: '🐒', en: 'Monkey', hi: 'बंदर', gu: 'વાંદરો' },
  { emoji: '🐮', en: 'Cow', hi: 'गाय', gu: 'ગાય' },
];

const TRANSLATIONS = {
  'en-IN': { title: 'Animal Friends', instruction: 'Find the correct animal' },
  'hi-IN': { title: 'जानवर दोस्त', instruction: 'सही जानवर खोजें' },
  'gu-IN': { title: 'પ્રાણી મિત્રો', instruction: 'સાચું પ્રાણી શોધો' },
};

export default function Animals({ language, onComplete, onBack }: ActivityProps) {
  const [targetAnimal, setTargetAnimal] = useState(ANIMALS[0]);
  const [options, setOptions] = useState<typeof ANIMALS>([]);
  const t = TRANSLATIONS[language];

  const generateLevel = () => {
    const target = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
    setTargetAnimal(target);
    
    let opts = [target];
    while (opts.length < 3) {
      const wrong = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
      if (!opts.find(o => o.en === wrong.en)) opts.push(wrong);
    }
    setOptions(opts.sort(() => Math.random() - 0.5));
  };

  useEffect(() => {
    generateLevel();
    playAudio(t.instruction, language);
  }, []);

  const handleOptionClick = (opt: typeof ANIMALS[0]) => {
    if (opt.en === targetAnimal.en) {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      playAudio('Good job!', 'en-IN');
      setTimeout(() => {
        generateLevel();
      }, 1500);
    } else {
      playAudio('Try again.', 'en-IN');
    }
  };

  const getTargetName = () => {
    if (language === 'hi-IN') return targetAnimal.hi;
    if (language === 'gu-IN') return targetAnimal.gu;
    return targetAnimal.en;
  };

  return (
    <div className="flex flex-col h-full">
      <ActivityHeader title={t.title} instruction={t.instruction} language={language} onBack={onBack} />
      
      <div className="flex-1 flex flex-col items-center justify-center gap-12">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-6xl font-bold text-amber-600 bg-amber-100 px-12 py-6 rounded-full shadow-lg border-4 border-amber-200"
        >
          {getTargetName()}
        </motion.div>

        <div className="flex gap-8">
          {options.map((opt, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleOptionClick(opt)}
              className="w-32 h-32 text-7xl bg-white rounded-3xl shadow-xl border-4 border-slate-100 hover:border-amber-300 transition-colors flex items-center justify-center"
            >
              {opt.emoji}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
