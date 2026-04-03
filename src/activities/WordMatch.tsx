import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { ActivityProps } from '../types';
import { ActivityHeader } from '../components/ActivityHeader';
import { playAudio } from '../lib/audio';

const WORDS = [
  { word: 'Apple', hi: 'सेब', gu: 'સફરજન', emoji: '🍎' },
  { word: 'Dog', hi: 'कुत्ता', gu: 'કૂતરો', emoji: '🐶' },
  { word: 'Cat', hi: 'बिल्ली', gu: 'બિલાડી', emoji: '🐱' },
  { word: 'Car', hi: 'गाड़ी', gu: 'ગાડી', emoji: '🚗' },
  { word: 'Sun', hi: 'सूरज', gu: 'સૂર્ય', emoji: '☀️' },
  { word: 'Moon', hi: 'चाँद', gu: 'ચંદ્ર', emoji: '🌙' },
  { word: 'Star', hi: 'तारा', gu: 'તારો', emoji: '⭐' },
  { word: 'Tree', hi: 'पेड़', gu: 'વૃક્ષ', emoji: '🌳' },
];

const TRANSLATIONS = {
  'en-IN': { title: 'Word Match', instruction: 'Match the picture with the word' },
  'hi-IN': { title: 'शब्द मिलान', instruction: 'चित्र को शब्द से मिलाएँ' },
  'gu-IN': { title: 'શબ્દ મેળવો', instruction: 'ચિત્રને શબ્દ સાથે મેળવો' },
};

export default function WordMatch({ language, onComplete, onBack, onScore }: ActivityProps) {
  const [target, setTarget] = useState(WORDS[0]);
  const [options, setOptions] = useState<typeof WORDS>([]);
  const [round, setRound] = useState(0);
  const t = TRANSLATIONS[language];

  const generateLevel = () => {
    const shuffled = [...WORDS].sort(() => Math.random() - 0.5);
    const selectedTarget = shuffled[0];
    setTarget(selectedTarget);
    
    const opts = [selectedTarget, shuffled[1], shuffled[2], shuffled[3]].sort(() => Math.random() - 0.5);
    setOptions(opts);
  };

  useEffect(() => {
    generateLevel();
    playAudio(t.instruction, language);
  }, []);

  const handleOptionClick = (opt: typeof WORDS[0]) => {
    if (opt.word === target.word) {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      playAudio('Excellent!', 'en-IN');
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
        <motion.div
          key={target.word}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring' }}
          className="text-8xl sm:text-9xl bg-white p-8 rounded-[3rem] shadow-xl border-4 border-slate-100"
        >
          {target.emoji}
        </motion.div>

        <div className="grid grid-cols-2 gap-4 sm:gap-6 w-full max-w-lg">
          {options.map((opt, i) => (
            <motion.button
              key={`${opt.word}-${i}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleOptionClick(opt)}
              className="py-4 px-6 text-2xl sm:text-3xl font-bold bg-white rounded-2xl shadow-md text-slate-700 border-4 border-indigo-100 hover:border-indigo-300 transition-colors"
            >
              {language === 'en-IN' ? opt.word : language === 'hi-IN' ? opt.hi : opt.gu}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
