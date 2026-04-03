import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { ActivityProps } from '../types';
import { ActivityHeader } from '../components/ActivityHeader';
import { playAudio } from '../lib/audio';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const TRANSLATIONS = {
  'en-IN': { title: 'Alphabet Match', instruction: 'Match uppercase to lowercase' },
  'hi-IN': { title: 'अक्षर मिलाएँ', instruction: 'बड़े अक्षर को छोटे अक्षर से मिलाएँ' },
  'gu-IN': { title: 'અક્ષર મેળવો', instruction: 'મોટા અક્ષરને નાના અક્ષર સાથે મેળવો' },
};

export default function Alphabet({ language, onComplete, onBack, onScore }: ActivityProps) {
  const [targetLetter, setTargetLetter] = useState('A');
  const [options, setOptions] = useState<string[]>([]);
  const [round, setRound] = useState(0);
  const t = TRANSLATIONS[language];

  const generateLevel = () => {
    const target = ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
    setTargetLetter(target);
    
    let opts = [target.toLowerCase()];
    while (opts.length < 3) {
      const wrong = ALPHABET[Math.floor(Math.random() * ALPHABET.length)].toLowerCase();
      if (!opts.includes(wrong)) opts.push(wrong);
    }
    setOptions(opts.sort(() => Math.random() - 0.5));
  };

  useEffect(() => {
    generateLevel();
    playAudio(t.instruction, language);
  }, []);

  const handleOptionClick = (opt: string) => {
    if (opt === targetLetter.toLowerCase()) {
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
      
      <div className="flex-1 flex flex-col items-center justify-center gap-16">
        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          className="w-32 h-32 sm:w-48 sm:h-48 bg-fuchsia-500 text-white rounded-[2rem] shadow-2xl flex items-center justify-center text-7xl sm:text-9xl font-black border-8 border-fuchsia-300"
        >
          {targetLetter}
        </motion.div>

        <div className="flex gap-4 sm:gap-8">
          {options.map((opt, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.1, y: -10 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleOptionClick(opt)}
              className="w-24 h-24 sm:w-32 sm:h-32 bg-white text-fuchsia-600 rounded-2xl shadow-lg border-4 border-fuchsia-100 flex items-center justify-center text-5xl sm:text-7xl font-bold hover:border-fuchsia-400 hover:bg-fuchsia-50 transition-all"
            >
              {opt}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
