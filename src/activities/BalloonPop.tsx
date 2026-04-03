import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { ActivityProps } from '../types';
import { ActivityHeader } from '../components/ActivityHeader';
import { playAudio } from '../lib/audio';

const TRANSLATIONS = {
  'en-IN': { title: 'Balloon Pop', instruction: 'Pop all the balloons!' },
  'hi-IN': { title: 'गुब्बारे फोड़ें', instruction: 'सभी गुब्बारे फोड़ें!' },
  'gu-IN': { title: 'ફુગ્ગા ફોડો', instruction: 'બધા ફુગ્ગા ફોડો!' },
};

const COLORS = ['bg-red-400', 'bg-blue-400', 'bg-green-400', 'bg-yellow-400', 'bg-purple-400', 'bg-pink-400'];

interface Balloon {
  id: number;
  color: string;
  x: number;
  speed: number;
  popped: boolean;
}

export default function BalloonPop({ language, onComplete, onBack, onScore }: ActivityProps) {
  const [balloons, setBalloons] = useState<Balloon[]>([]);
  const [round, setRound] = useState(0);
  const t = TRANSLATIONS[language];

  const generateBalloons = () => {
    const newBalloons = Array.from({ length: 5 + round }).map((_, i) => ({
      id: i,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      x: Math.random() * 80 + 10, // 10% to 90%
      speed: Math.random() * 2 + 2, // 2s to 4s
      popped: false,
    }));
    setBalloons(newBalloons);
  };

  useEffect(() => {
    generateBalloons();
    playAudio(t.instruction, language);
  }, [round]);

  const popBalloon = (id: number) => {
    setBalloons(prev => {
      const next = prev.map(b => b.id === id ? { ...b, popped: true } : b);
      if (next.every(b => b.popped)) {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        playAudio('Great job!', 'en-IN');
        if (onScore) onScore(10);
        setTimeout(() => {
          if (round + 1 >= 5) {
            onComplete();
          } else {
            setRound(r => r + 1);
          }
        }, 1500);
      } else {
        playAudio('Pop', 'en-IN');
      }
      return next;
    });
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <ActivityHeader title={t.title} instruction={t.instruction} language={language} onBack={onBack} />
      
      <div className="flex-1 relative w-full h-full overflow-hidden bg-sky-50 rounded-3xl mt-4 border-4 border-sky-200">
        <AnimatePresence>
          {balloons.map(b => !b.popped && (
            <motion.button
              key={b.id}
              initial={{ y: '100%', x: `${b.x}%` }}
              animate={{ y: '-120%', x: `${b.x + (Math.random() * 10 - 5)}%` }}
              transition={{ duration: b.speed, ease: 'linear', repeat: Infinity }}
              onPointerDown={() => popBalloon(b.id)}
              className={`absolute bottom-0 w-16 h-20 sm:w-20 sm:h-24 rounded-[50%] ${b.color} shadow-inner border-2 border-white/50 cursor-crosshair`}
              style={{ left: `${b.x}%` }}
            >
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-4 bg-slate-300" />
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
