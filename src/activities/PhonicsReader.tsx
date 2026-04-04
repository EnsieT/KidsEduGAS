import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { ActivityProps } from '../types';
import { ActivityHeader } from '../components/ActivityHeader';
import { playAudio } from '../lib/audio';
import { Volume2, ArrowRight, Sparkles } from 'lucide-react';

const TRANSLATIONS = {
  'en-IN': { title: 'Phonics', instruction: 'Tap letters to hear sounds, then blend!', blend: 'Blend it!', next: 'Next Word' },
  'hi-IN': { title: 'फ़ोनिक्स', instruction: 'आवाज़ सुनने के लिए अक्षरों पर टैप करें!', blend: 'मिलाएँ!', next: 'अगला शब्द' },
  'gu-IN': { title: 'ફોનિક્સ', instruction: 'અવાજ સાંભળવા માટે અક્ષરો પર ટેપ કરો!', blend: 'ભેગા કરો!', next: 'આગળનો શબ્દ' },
};

const WORDS = [
  { word: 'CAT', emoji: '🐱', sounds: ['kuh', 'ah', 'tuh'] },
  { word: 'DOG', emoji: '🐶', sounds: ['duh', 'aw', 'guh'] },
  { word: 'PIG', emoji: '🐷', sounds: ['puh', 'ih', 'guh'] },
  { word: 'SUN', emoji: '☀️', sounds: ['sss', 'uh', 'nnn'] },
  { word: 'BUG', emoji: '🐛', sounds: ['buh', 'uh', 'guh'] },
  { word: 'HAT', emoji: '🎩', sounds: ['huh', 'ah', 'tuh'] },
  { word: 'PEN', emoji: '🖊️', sounds: ['puh', 'eh', 'nnn'] },
  { word: 'BOX', emoji: '📦', sounds: ['buh', 'aw', 'ks'] },
];

export default function PhonicsReader({ language, onComplete, onBack, onScore }: ActivityProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [activeLetter, setActiveLetter] = useState<number | null>(null);
  const t = TRANSLATIONS[language];
  const current = WORDS[currentIndex];

  useEffect(() => {
    playAudio(t.instruction, language);
  }, [currentIndex, language, t.instruction]);

  const playSound = (index: number) => {
    setActiveLetter(index);
    playAudio(current.sounds[index], 'en-IN');
    setTimeout(() => setActiveLetter(null), 500);
  };

  const handleBlend = () => {
    playAudio(current.word, 'en-IN');
    setRevealed(true);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    if (onScore) onScore(10);
  };

  const handleNext = () => {
    if (currentIndex + 1 >= WORDS.length) {
      onComplete();
    } else {
      setRevealed(false);
      setCurrentIndex(i => i + 1);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <ActivityHeader title={t.title} instruction={t.instruction} language={language} onBack={onBack} />
      
      <div className="flex-1 flex flex-col items-center justify-center gap-8 sm:gap-12 mt-4 bg-white rounded-3xl border-4 border-indigo-100 p-4 sm:p-6">
        
        {/* Picture Reveal Area */}
        <div className="h-32 sm:h-40 flex items-center justify-center">
          {revealed ? (
            <motion.div 
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              type="spring"
              className="text-7xl sm:text-8xl"
            >
              {current.emoji}
            </motion.div>
          ) : (
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl border-4 border-dashed border-gray-200 flex items-center justify-center bg-gray-50">
              <span className="text-gray-400 text-3xl sm:text-4xl">?</span>
            </div>
          )}
        </div>

        {/* Letters Area */}
        <div className="flex gap-3 sm:gap-8">
          {current.word.split('').map((letter, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              animate={activeLetter === i ? { y: -20, backgroundColor: '#fef08a' } : { y: 0, backgroundColor: '#ffffff' }}
              onClick={() => playSound(i)}
              className="w-20 h-24 sm:w-28 sm:h-32 rounded-2xl border-4 border-indigo-200 shadow-lg flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <span className="text-5xl sm:text-7xl font-bold text-indigo-600">{letter}</span>
              <Volume2 className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-400" />
            </motion.button>
          ))}
        </div>

        {/* Actions */}
        <div className="h-20 mt-4">
          {!revealed ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleBlend}
              className="px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-full font-bold text-xl sm:text-2xl shadow-lg flex items-center gap-3"
            >
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
              {t.blend}
            </motion.button>
          ) : (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNext}
              className="px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full font-bold text-xl sm:text-2xl shadow-lg flex items-center gap-3"
            >
              {t.next}
              <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </motion.button>
          )}
        </div>

      </div>
    </div>
  );
}
