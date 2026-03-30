import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { ActivityProps } from '../types';
import { ActivityHeader } from '../components/ActivityHeader';
import { playAudio } from '../lib/audio';

const SHAPES = [
  { name: 'Circle', path: 'M 50, 50 m -45, 0 a 45,45 0 1,0 90,0 a 45,45 0 1,0 -90,0' },
  { name: 'Square', path: 'M 10 10 H 90 V 90 H 10 Z' },
  { name: 'Triangle', path: 'M 50 10 L 90 90 L 10 90 Z' },
  { name: 'Star', path: 'M 50 5 L 61 39 L 97 39 L 68 60 L 79 95 L 50 74 L 21 95 L 32 60 L 3 39 L 39 39 Z' },
];

const TRANSLATIONS = {
  'en-IN': { title: 'Shape Sorter', instruction: 'Match the shape' },
  'hi-IN': { title: 'आकार मिलाएँ', instruction: 'आकृतियों का मिलान करें' },
  'gu-IN': { title: 'આકાર મેળવો', instruction: 'આકારો મેળવો' },
};

export default function Shapes({ language, onComplete, onBack }: ActivityProps) {
  const [targetShape, setTargetShape] = useState(SHAPES[0]);
  const [options, setOptions] = useState<typeof SHAPES>([]);
  const t = TRANSLATIONS[language];

  const generateLevel = () => {
    const target = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    setTargetShape(target);
    
    let opts = [target];
    while (opts.length < 3) {
      const wrong = SHAPES[Math.floor(Math.random() * SHAPES.length)];
      if (!opts.find(o => o.name === wrong.name)) opts.push(wrong);
    }
    setOptions(opts.sort(() => Math.random() - 0.5));
  };

  useEffect(() => {
    generateLevel();
    playAudio(t.instruction, language);
  }, []);

  const handleOptionClick = (opt: typeof SHAPES[0]) => {
    if (opt.name === targetShape.name) {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      playAudio('Awesome!', 'en-IN');
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
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-48 h-48 bg-slate-200 rounded-3xl flex items-center justify-center shadow-inner border-4 border-dashed border-slate-400"
        >
          <svg viewBox="0 0 100 100" className="w-32 h-32 fill-slate-300">
            <path d={targetShape.path} />
          </svg>
        </motion.div>

        <div className="flex gap-8">
          {options.map((opt, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleOptionClick(opt)}
              className="w-32 h-32 bg-white rounded-2xl shadow-lg border-4 border-sky-200 flex items-center justify-center hover:border-sky-400 transition-colors"
            >
              <svg viewBox="0 0 100 100" className="w-20 h-20 fill-sky-500">
                <path d={opt.path} />
              </svg>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
