import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { ActivityProps } from '../types';
import { ActivityHeader } from '../components/ActivityHeader';
import { playAudio } from '../lib/audio';

const TRANSLATIONS = {
  'en-IN': { title: 'Emotions', instruction: 'How is this face feeling?' },
  'hi-IN': { title: 'भावनाएं', instruction: 'यह चेहरा कैसा महसूस कर रहा है?' },
  'gu-IN': { title: 'લાગણીઓ', instruction: 'આ ચહેરો કેવું અનુભવે છે?' },
};

const EMOTIONS = [
  { id: 'happy', emoji: '😄', en: 'Happy', hi: 'खुश', gu: 'ખુશ' },
  { id: 'sad', emoji: '😢', en: 'Sad', hi: 'उदास', gu: 'ઉદાસ' },
  { id: 'angry', emoji: '😠', en: 'Angry', hi: 'गुस्सा', gu: 'ગુસ્સો' },
  { id: 'surprised', emoji: '😲', en: 'Surprised', hi: 'हैरान', gu: 'આશ્ચર્યચકિત' },
  { id: 'scared', emoji: '😨', en: 'Scared', hi: 'डरा हुआ', gu: 'ડરેલું' },
  { id: 'silly', emoji: '🤪', en: 'Silly', hi: 'नटखट', gu: 'મૂર્ખ' },
];

export default function Emotions({ language, onComplete, onBack, onScore }: ActivityProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [options, setOptions] = useState<typeof EMOTIONS>([]);
  const [showFeedback, setShowFeedback] = useState<'correct' | 'wrong' | null>(null);
  const t = TRANSLATIONS[language];

  const currentEmotion = EMOTIONS[currentIndex];

  useEffect(() => {
    playAudio(t.instruction, language);
    generateOptions();
  }, [currentIndex, language, t.instruction]);

  const generateOptions = () => {
    const others = EMOTIONS.filter((_, i) => i !== currentIndex);
    const shuffledOthers = others.sort(() => 0.5 - Math.random()).slice(0, 2);
    const allOptions = [EMOTIONS[currentIndex], ...shuffledOthers].sort(() => 0.5 - Math.random());
    setOptions(allOptions);
  };

  const handleSelect = (selectedId: string) => {
    if (showFeedback) return;

    if (selectedId === currentEmotion.id) {
      setShowFeedback('correct');
      playAudio('Correct! ' + currentEmotion.en, 'en-IN');
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      if (onScore) onScore(10);
      
      setTimeout(() => {
        setShowFeedback(null);
        if (currentIndex + 1 >= EMOTIONS.length) {
          onComplete();
        } else {
          setCurrentIndex(i => i + 1);
        }
      }, 2000);
    } else {
      setShowFeedback('wrong');
      playAudio('Try again', 'en-IN');
      setTimeout(() => setShowFeedback(null), 1000);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <ActivityHeader title={t.title} instruction={t.instruction} language={language} onBack={onBack} />
      
      <div className="flex-1 flex flex-col items-center justify-center gap-8 sm:gap-12 mt-4 bg-yellow-50 rounded-3xl border-4 border-yellow-200 p-4 sm:p-8">
        
        <motion.div 
          key={currentEmotion.id}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-8xl sm:text-9xl bg-white w-48 h-48 sm:w-64 sm:h-64 rounded-full flex items-center justify-center shadow-xl border-8 border-yellow-100"
        >
          {currentEmotion.emoji}
        </motion.div>

        <div className="flex flex-wrap justify-center gap-4 w-full max-w-2xl">
          {options.map((opt) => {
            const label = language === 'en-IN' ? opt.en : language === 'hi-IN' ? opt.hi : opt.gu;
            return (
              <motion.button
                key={opt.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSelect(opt.id)}
                className={`px-6 py-4 sm:px-8 sm:py-6 rounded-2xl font-bold text-2xl sm:text-3xl shadow-md border-4 transition-colors flex-1 min-w-[140px] max-w-[200px]
                  ${showFeedback === 'correct' && opt.id === currentEmotion.id 
                    ? 'bg-green-400 border-green-500 text-white' 
                    : showFeedback === 'wrong' && opt.id !== currentEmotion.id
                    ? 'bg-red-100 border-red-200 text-red-400 opacity-50'
                    : 'bg-white border-yellow-300 text-yellow-700 hover:bg-yellow-100'
                  }
                `}
              >
                {label}
              </motion.button>
            );
          })}
        </div>

      </div>
    </div>
  );
}
