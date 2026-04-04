import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { ActivityProps } from '../types';
import { ActivityHeader } from '../components/ActivityHeader';
import { playAudio } from '../lib/audio';
import { Shuffle, Volume2, Sparkles } from 'lucide-react';

const TRANSLATIONS = {
  'en-IN': { title: 'Silly Sentences', instruction: 'Make a silly sentence and read it!', read: 'Read it!', shuffle: 'Shuffle' },
  'hi-IN': { title: 'मजेदार वाक्य', instruction: 'एक मजेदार वाक्य बनाएँ और पढ़ें!', read: 'इसे पढ़ें!', shuffle: 'बदलें' },
  'gu-IN': { title: 'રમુજી વાક્યો', instruction: 'રમુજી વાક્ય બનાવો અને વાંચો!', read: 'તે વાંચો!', shuffle: 'બદલો' },
};

const SUBJECTS = [
  { text: 'The pink elephant', emoji: '🐘' },
  { text: 'A happy alien', emoji: '👽' },
  { text: 'My pet dinosaur', emoji: '🦖' },
  { text: 'The flying pig', emoji: '🐷' },
  { text: 'A dancing robot', emoji: '🤖' },
  { text: 'The sleepy bear', emoji: '🐻' },
];

const VERBS = [
  { text: 'is dancing with', emoji: '💃' },
  { text: 'is eating', emoji: '🍕' },
  { text: 'is jumping on', emoji: '🦘' },
  { text: 'is singing to', emoji: '🎤' },
  { text: 'is running from', emoji: '🏃' },
  { text: 'is painting', emoji: '🎨' },
];

const OBJECTS = [
  { text: 'a giant pizza.', emoji: '🍕' },
  { text: 'a smelly shoe.', emoji: '👞' },
  { text: 'the bright moon.', emoji: '🌕' },
  { text: 'a sparkly rainbow.', emoji: '🌈' },
  { text: 'a chocolate cake.', emoji: '🎂' },
  { text: 'a tiny bug.', emoji: '🐛' },
];

export default function SillySentences({ language, onComplete, onBack, onScore }: ActivityProps) {
  const [subjectIdx, setSubjectIdx] = useState(0);
  const [verbIdx, setVerbIdx] = useState(0);
  const [objectIdx, setObjectIdx] = useState(0);
  const [readCount, setReadCount] = useState(0);
  
  const t = TRANSLATIONS[language];

  useEffect(() => {
    playAudio(t.instruction, language);
  }, [language, t.instruction]);

  const handleShuffle = () => {
    setSubjectIdx(Math.floor(Math.random() * SUBJECTS.length));
    setVerbIdx(Math.floor(Math.random() * VERBS.length));
    setObjectIdx(Math.floor(Math.random() * OBJECTS.length));
    playAudio('Whoosh', 'en-IN');
  };

  const handleRead = () => {
    const sentence = `${SUBJECTS[subjectIdx].text} ${VERBS[verbIdx].text} ${OBJECTS[objectIdx].text}`;
    playAudio(sentence, 'en-IN');
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    
    if (onScore) onScore(5);
    
    setReadCount(prev => {
      const newCount = prev + 1;
      if (newCount >= 5) { // Complete activity after reading 5 sentences
        setTimeout(() => onComplete(), 2000);
      }
      return newCount;
    });
  };

  const cycleSubject = () => setSubjectIdx((prev) => (prev + 1) % SUBJECTS.length);
  const cycleVerb = () => setVerbIdx((prev) => (prev + 1) % VERBS.length);
  const cycleObject = () => setObjectIdx((prev) => (prev + 1) % OBJECTS.length);

  return (
    <div className="flex flex-col h-full">
      <ActivityHeader title={t.title} instruction={t.instruction} language={language} onBack={onBack} />
      
      <div className="flex-1 flex flex-col items-center justify-center gap-6 sm:gap-10 mt-4 bg-amber-50 rounded-3xl border-4 border-amber-200 p-4 sm:p-8">
        
        {/* Sentence Builder */}
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-4xl">
          
          {/* Subject */}
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={cycleSubject}
            className="flex-1 bg-rose-100 border-4 border-rose-300 rounded-2xl p-4 sm:p-6 flex flex-col items-center justify-center gap-4 shadow-md cursor-pointer"
          >
            <span className="text-5xl sm:text-6xl">{SUBJECTS[subjectIdx].emoji}</span>
            <span className="text-xl sm:text-2xl font-bold text-rose-700 text-center">{SUBJECTS[subjectIdx].text}</span>
          </motion.button>

          {/* Verb */}
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={cycleVerb}
            className="flex-1 bg-blue-100 border-4 border-blue-300 rounded-2xl p-4 sm:p-6 flex flex-col items-center justify-center gap-4 shadow-md cursor-pointer"
          >
            <span className="text-5xl sm:text-6xl">{VERBS[verbIdx].emoji}</span>
            <span className="text-xl sm:text-2xl font-bold text-blue-700 text-center">{VERBS[verbIdx].text}</span>
          </motion.button>

          {/* Object */}
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={cycleObject}
            className="flex-1 bg-emerald-100 border-4 border-emerald-300 rounded-2xl p-4 sm:p-6 flex flex-col items-center justify-center gap-4 shadow-md cursor-pointer"
          >
            <span className="text-5xl sm:text-6xl">{OBJECTS[objectIdx].emoji}</span>
            <span className="text-xl sm:text-2xl font-bold text-emerald-700 text-center">{OBJECTS[objectIdx].text}</span>
          </motion.button>

        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleShuffle}
            className="px-6 py-3 sm:px-8 sm:py-4 bg-white text-amber-600 border-4 border-amber-300 rounded-full font-bold text-xl sm:text-2xl shadow-lg flex items-center gap-3"
          >
            <Shuffle className="w-6 h-6" />
            {t.shuffle}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRead}
            className="px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-full font-bold text-xl sm:text-2xl shadow-lg flex items-center gap-3"
          >
            <Volume2 className="w-6 h-6" />
            {t.read}
          </motion.button>
        </div>

        {/* Progress indicator */}
        <div className="flex gap-2 mt-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div 
              key={i} 
              className={`w-4 h-4 rounded-full ${i < readCount ? 'bg-orange-500' : 'bg-orange-200'}`} 
            />
          ))}
        </div>

      </div>
    </div>
  );
}
