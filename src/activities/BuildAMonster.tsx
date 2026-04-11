import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { ActivityProps } from '../types';
import { ActivityHeader } from '../components/ActivityHeader';
import { playAudio } from '../lib/audio';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';

const TRANSLATIONS = {
  'en-IN': { title: 'Build a Monster', instruction: 'Create your own silly monster!', done: 'Done!' },
  'hi-IN': { title: 'राक्षस बनाएँ', instruction: 'अपना खुद का मजेदार राक्षस बनाएँ!', done: 'हो गया!' },
  'gu-IN': { title: 'મોન્સ્ટર બનાવો', instruction: 'તમારો પોતાનો રમુજી મોન્સ્ટર બનાવો!', done: 'થઈ ગયું!' },
};

const BODIES = ['🥔', '🥚', '🍏', '💧', '🛑', '🟣', '🟤', '🟩', '🔷'];
const EYES = ['👀', '👁️', '🕶️', '🥽', '👓', '👁️‍🗨️'];
const MOUTHS = ['👄', '👅', '💋', '🦷', '〰️', '🔻'];
const HATS = ['🎩', '👑', '🧢', '🎓', '🎀', '🤠', '🦄', '🌸', '🎧'];

export default function BuildAMonster({ language, onComplete, onBack, onScore }: ActivityProps) {
  const [bodyIdx, setBodyIdx] = useState(0);
  const [eyesIdx, setEyesIdx] = useState(0);
  const [mouthIdx, setMouthIdx] = useState(0);
  const [hatIdx, setHatIdx] = useState(0);
  const t = TRANSLATIONS[language];

  useEffect(() => {
    // Randomize initial monster
    setBodyIdx(Math.floor(Math.random() * BODIES.length));
    setEyesIdx(Math.floor(Math.random() * EYES.length));
    setMouthIdx(Math.floor(Math.random() * MOUTHS.length));
    setHatIdx(Math.floor(Math.random() * HATS.length));
    playAudio(t.instruction, language);
  }, [language, t.instruction]);

  const handleDone = () => {
    confetti({ particleCount: 200, spread: 100, origin: { y: 0.5 } });
    playAudio('Roar! What a cool monster!', 'en-IN');
    if (onScore) onScore(15);
    setTimeout(() => {
      onComplete();
    }, 3000);
  };

  const cycle = (setter: React.Dispatch<React.SetStateAction<number>>, array: string[], dir: number) => {
    playAudio('Click', 'en-IN');
    setter(prev => {
      const next = prev + dir;
      if (next < 0) return array.length - 1;
      if (next >= array.length) return 0;
      return next;
    });
  };

  const Selector = ({ label, idx, setter, array }: { label: string, idx: number, setter: any, array: string[] }) => (
    <div className="flex items-center justify-between bg-white/50 p-2 rounded-2xl w-full max-w-xs">
      <button onClick={() => cycle(setter, array, -1)} className="p-2 bg-white rounded-full shadow hover:bg-slate-100 active:scale-95">
        <ChevronLeft size={24} className="text-purple-600" />
      </button>
      <span className="font-bold text-purple-800 uppercase tracking-wider text-sm">{label}</span>
      <button onClick={() => cycle(setter, array, 1)} className="p-2 bg-white rounded-full shadow hover:bg-slate-100 active:scale-95">
        <ChevronRight size={24} className="text-purple-600" />
      </button>
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      <ActivityHeader title={t.title} instruction={t.instruction} language={language} onBack={onBack} />
      
      <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-8 mt-4">
        
        {/* Monster Display */}
        <div className="relative w-64 h-80 sm:w-80 sm:h-96 bg-purple-100 rounded-[3rem] border-8 border-purple-300 flex items-center justify-center shadow-inner overflow-hidden">
          <motion.div 
            key={bodyIdx}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute text-[12rem] sm:text-[15rem] leading-none select-none"
          >
            {BODIES[bodyIdx]}
          </motion.div>
          
          <motion.div 
            key={`eyes-${eyesIdx}`}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="absolute top-[25%] text-[5rem] sm:text-[6rem] leading-none select-none z-10"
          >
            {EYES[eyesIdx]}
          </motion.div>
          
          <motion.div 
            key={`mouth-${mouthIdx}`}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="absolute bottom-[25%] text-[4rem] sm:text-[5rem] leading-none select-none z-10"
          >
            {MOUTHS[mouthIdx]}
          </motion.div>
          
          <motion.div 
            key={`hat-${hatIdx}`}
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="absolute top-[5%] text-[5rem] sm:text-[6rem] leading-none select-none z-20"
          >
            {HATS[hatIdx]}
          </motion.div>
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-4 w-full max-w-xs items-center">
          <Selector label="Hat" idx={hatIdx} setter={setHatIdx} array={HATS} />
          <Selector label="Eyes" idx={eyesIdx} setter={setEyesIdx} array={EYES} />
          <Selector label="Mouth" idx={mouthIdx} setter={setMouthIdx} array={MOUTHS} />
          <Selector label="Body" idx={bodyIdx} setter={setBodyIdx} array={BODIES} />
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDone}
            className="mt-4 w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl font-bold text-2xl shadow-lg flex items-center justify-center gap-2"
          >
            <Check size={28} />
            {t.done}
          </motion.button>
        </div>

      </div>
    </div>
  );
}
