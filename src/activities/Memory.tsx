import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { ActivityProps } from '../types';
import { ActivityHeader } from '../components/ActivityHeader';
import { playAudio } from '../lib/audio';

const EMOJIS = ['🐶', '🐱', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯'];

const TRANSLATIONS = {
  'en-IN': { title: 'Memory Match', instruction: 'Match the pairs' },
  'hi-IN': { title: 'जोड़े मिलाएँ', instruction: 'जोड़े मिलाएँ' },
  'gu-IN': { title: 'જોડીઓ મેળવો', instruction: 'જોડીઓ મેળવો' },
};

interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export default function Memory({ language, onComplete, onBack, onScore }: ActivityProps) {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [isLocked, setIsLocked] = useState(false);
  const t = TRANSLATIONS[language];

  const generateLevel = () => {
    const selectedEmojis = [...EMOJIS].sort(() => Math.random() - 0.5).slice(0, 4);
    const pairs = [...selectedEmojis, ...selectedEmojis];
    const newCards = pairs
      .sort(() => Math.random() - 0.5)
      .map((emoji, i) => ({ id: i, emoji, isFlipped: false, isMatched: false }));
    setCards(newCards);
    setFlippedIndices([]);
    setIsLocked(false);
  };

  useEffect(() => {
    generateLevel();
    playAudio(t.instruction, language);
  }, []);

  const handleCardClick = (index: number) => {
    if (isLocked || cards[index].isFlipped || cards[index].isMatched) return;

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    const newCards = [...cards];
    newCards[index] = { ...newCards[index], isFlipped: true };
    setCards(newCards);

    if (newFlipped.length === 2) {
      setIsLocked(true);
      const [first, second] = newFlipped;
      
      if (newCards[first].emoji === newCards[second].emoji) {
        setTimeout(() => {
          const matchedCards = [...newCards];
          matchedCards[first] = { ...matchedCards[first], isMatched: true };
          matchedCards[second] = { ...matchedCards[second], isMatched: true };
          setCards(matchedCards);
          setFlippedIndices([]);
          setIsLocked(false);
          
          if (matchedCards.every(c => c.isMatched)) {
            confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
            playAudio('You did it!', 'en-IN');
            if (onScore) onScore(10);
            setTimeout(generateLevel, 2000);
          } else {
            playAudio('Match!', 'en-IN');
          }
        }, 500);
      } else {
        setTimeout(() => {
          const resetCards = [...newCards];
          resetCards[first] = { ...resetCards[first], isFlipped: false };
          resetCards[second] = { ...resetCards[second], isFlipped: false };
          setCards(resetCards);
          setFlippedIndices([]);
          setIsLocked(false);
        }, 1000);
      }
    }
  };

  return (
    <div className="flex flex-col h-full">
      <ActivityHeader title={t.title} instruction={t.instruction} language={language} onBack={onBack} />
      
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="grid grid-cols-4 gap-4 max-w-2xl">
          {cards.map((card, i) => (
            <motion.button
              key={card.id}
              whileHover={{ scale: card.isFlipped || card.isMatched ? 1 : 1.05 }}
              whileTap={{ scale: card.isFlipped || card.isMatched ? 1 : 0.95 }}
              onClick={() => handleCardClick(i)}
              className={`w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-2xl shadow-lg border-4 flex items-center justify-center text-4xl sm:text-5xl md:text-6xl transition-all duration-300 ${
                card.isFlipped || card.isMatched 
                  ? 'bg-white border-teal-200 rotate-y-180' 
                  : 'bg-teal-400 border-teal-500 text-transparent'
              }`}
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div style={{ backfaceVisibility: 'hidden' }}>
                {card.isFlipped || card.isMatched ? card.emoji : '?'}
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
