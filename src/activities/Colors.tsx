import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { ActivityProps } from '../types';
import { ActivityHeader } from '../components/ActivityHeader';
import { playAudio } from '../lib/audio';

const COLORS = [
  { name: 'Red', hex: '#ef4444', hi: 'लाल', gu: 'લાલ' },
  { name: 'Blue', hex: '#3b82f6', hi: 'नीला', gu: 'વાદળી' },
  { name: 'Green', hex: '#22c55e', hi: 'हरा', gu: 'લીલો' },
  { name: 'Yellow', hex: '#eab308', hi: 'पीला', gu: 'પીળો' },
  { name: 'Purple', hex: '#a855f7', hi: 'बैंगनी', gu: 'જાંબલી' },
  { name: 'Orange', hex: '#f97316', hi: 'नारंगी', gu: 'નારંગી' },
];

const TRANSLATIONS = {
  'en-IN': { title: 'Color Match', instruction: 'Find the matching color' },
  'hi-IN': { title: 'रंग मिलाएँ', instruction: 'मिलता-जुलता रंग खोजें' },
  'gu-IN': { title: 'રંગ મેળવો', instruction: 'મેળ ખાતો રંગ શોધો' },
};

export default function Colors({ language, onComplete, onBack, onScore }: ActivityProps) {
  const [targetColor, setTargetColor] = useState(COLORS[0]);
  const [options, setOptions] = useState<typeof COLORS>([]);
  const [round, setRound] = useState(0);
  const t = TRANSLATIONS[language];

  const generateLevel = () => {
    const target = COLORS[Math.floor(Math.random() * COLORS.length)];
    setTargetColor(target);
    
    let opts = [target];
    while (opts.length < 3) {
      const wrong = COLORS[Math.floor(Math.random() * COLORS.length)];
      if (!opts.find(o => o.name === wrong.name)) opts.push(wrong);
    }
    setOptions(opts.sort(() => Math.random() - 0.5));
  };

  useEffect(() => {
    generateLevel();
    playAudio(t.instruction, language);
  }, []);

  const handleOptionClick = (opt: typeof COLORS[0]) => {
    if (opt.name === targetColor.name) {
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

  const getTargetName = () => {
    if (language === 'hi-IN') return targetColor.hi;
    if (language === 'gu-IN') return targetColor.gu;
    return targetColor.name;
  };

  return (
    <div className="flex flex-col h-full">
      <ActivityHeader title={t.title} instruction={t.instruction} language={language} onBack={onBack} />
      
      <div className="flex-1 flex flex-col items-center justify-center gap-12">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-6xl font-bold p-8 rounded-3xl bg-white shadow-xl border-4"
          style={{ borderColor: targetColor.hex, color: targetColor.hex }}
        >
          {getTargetName()}
        </motion.div>

        <div className="flex gap-6">
          {options.map((opt, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleOptionClick(opt)}
              className="w-32 h-32 rounded-full shadow-lg border-4 border-white/50 transition-transform"
              style={{ backgroundColor: opt.hex }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
