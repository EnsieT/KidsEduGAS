import { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { ActivityProps } from '../types';
import { ActivityHeader } from '../components/ActivityHeader';
import { playAudio } from '../lib/audio';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

const LEVELS = [
  {
    maze: [
      [0, 0, 1, 0, 0, 0],
      [1, 0, 1, 0, 1, 0],
      [0, 0, 0, 0, 1, 0],
      [0, 1, 1, 1, 1, 0],
      [0, 0, 0, 1, 0, 0],
      [1, 1, 0, 0, 0, 0]
    ],
    start: { x: 0, y: 0 },
    end: { x: 5, y: 5 },
    player: '🐶',
    target: '🏠'
  },
  {
    maze: [
      [0, 1, 0, 0, 0, 0],
      [0, 1, 0, 1, 1, 0],
      [0, 0, 0, 1, 0, 0],
      [1, 1, 0, 1, 0, 1],
      [0, 0, 0, 0, 0, 1],
      [0, 1, 1, 1, 0, 0]
    ],
    start: { x: 0, y: 0 },
    end: { x: 5, y: 5 },
    player: '🐰',
    target: '🥕'
  },
  {
    maze: [
      [0, 0, 0, 1, 0, 0],
      [1, 1, 0, 1, 0, 1],
      [0, 0, 0, 0, 0, 0],
      [0, 1, 1, 1, 1, 0],
      [0, 0, 0, 0, 1, 0],
      [1, 1, 1, 0, 0, 0]
    ],
    start: { x: 0, y: 0 },
    end: { x: 5, y: 5 },
    player: '🐵',
    target: '🍌'
  },
  {
    maze: [
      [0, 1, 1, 1, 1, 1],
      [0, 0, 0, 0, 0, 0],
      [1, 1, 1, 1, 1, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 1, 1, 1, 1, 1],
      [0, 0, 0, 0, 0, 0]
    ],
    start: { x: 0, y: 0 },
    end: { x: 5, y: 5 },
    player: '🚗',
    target: '🏁'
  },
  {
    maze: [
      [0, 0, 0, 0, 1, 0],
      [0, 1, 1, 0, 1, 0],
      [0, 1, 0, 0, 0, 0],
      [0, 1, 0, 1, 1, 1],
      [0, 1, 0, 0, 0, 0],
      [0, 0, 0, 1, 1, 0]
    ],
    start: { x: 0, y: 0 },
    end: { x: 5, y: 5 },
    player: '🚀',
    target: '🌕'
  }
];

const TRANSLATIONS = {
  'en-IN': { title: 'Maze Explorer', instruction: 'Help the dog reach the house' },
  'hi-IN': { title: 'भूलभुलैया', instruction: 'कुत्ते को घर तक पहुँचने में मदद करें' },
  'gu-IN': { title: 'ભૂલભુલામણી', instruction: 'કૂતરાને ઘર સુધી પહોંચવામાં મદદ કરો' },
};

export default function Maze({ language, onComplete, onBack, onScore }: ActivityProps) {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [pos, setPos] = useState(LEVELS[0].start);
  const t = TRANSLATIONS[language];

  const level = LEVELS[currentLevel];

  useEffect(() => {
    playAudio(t.instruction, language);
  }, [currentLevel]);

  const move = useCallback((dx: number, dy: number) => {
    setPos(prev => {
      const newX = prev.x + dx;
      const newY = prev.y + dy;
      if (newX >= 0 && newX < 6 && newY >= 0 && newY < 6 && level.maze[newY][newX] === 0) {
        if (newX === level.end.x && newY === level.end.y) {
          confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
          playAudio('You made it!', 'en-IN');
          if (onScore) onScore(10);
          setTimeout(() => {
            const nextLevel = currentLevel + 1;
            if (nextLevel >= LEVELS.length) {
              onComplete();
            } else {
              setCurrentLevel(nextLevel);
              setPos(LEVELS[nextLevel].start);
            }
          }, 2000);
        }
        return { x: newX, y: newY };
      }
      return prev;
    });
  }, [currentLevel, level, onScore]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') move(0, -1);
      if (e.key === 'ArrowDown') move(0, 1);
      if (e.key === 'ArrowLeft') move(-1, 0);
      if (e.key === 'ArrowRight') move(1, 0);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [move]);

  return (
    <div className="flex flex-col h-full">
      <ActivityHeader title={t.title} instruction={t.instruction} language={language} onBack={onBack} />
      
      <div className="flex-1 flex flex-col items-center justify-center gap-8">
        <div className="bg-emerald-50 p-4 rounded-3xl shadow-inner border-4 border-emerald-200">
          <div className="grid grid-cols-6 gap-1 w-72 h-72 sm:w-96 sm:h-96">
            {level.maze.map((row, y) => 
              row.map((cell, x) => (
                <div 
                  key={`${x}-${y}`} 
                  className={`rounded-lg flex items-center justify-center text-3xl sm:text-4xl ${cell === 1 ? 'bg-emerald-600' : 'bg-emerald-100'}`}
                >
                  {pos.x === x && pos.y === y && level.player}
                  {x === level.end.x && y === level.end.y && (pos.x !== level.end.x || pos.y !== level.end.y) && level.target}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div />
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => move(0, -1)} className="w-16 h-16 bg-white rounded-2xl shadow-md flex items-center justify-center text-emerald-600 border-2 border-emerald-100"><ArrowUp size={32} /></motion.button>
          <div />
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => move(-1, 0)} className="w-16 h-16 bg-white rounded-2xl shadow-md flex items-center justify-center text-emerald-600 border-2 border-emerald-100"><ArrowLeft size={32} /></motion.button>
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => move(0, 1)} className="w-16 h-16 bg-white rounded-2xl shadow-md flex items-center justify-center text-emerald-600 border-2 border-emerald-100"><ArrowDown size={32} /></motion.button>
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => move(1, 0)} className="w-16 h-16 bg-white rounded-2xl shadow-md flex items-center justify-center text-emerald-600 border-2 border-emerald-100"><ArrowRight size={32} /></motion.button>
        </div>
      </div>
    </div>
  );
}
