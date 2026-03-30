import { useEffect } from 'react';
import { motion } from 'motion/react';
import { ActivityProps } from '../types';
import { ActivityHeader } from '../components/ActivityHeader';
import { playAudio } from '../lib/audio';

const TRANSLATIONS = {
  'en-IN': { title: 'Music Maker', instruction: 'Tap the keys to make music' },
  'hi-IN': { title: 'संगीतकार', instruction: 'संगीत बनाने के लिए कुंजियों को टैप करें' },
  'gu-IN': { title: 'સંગીતકાર', instruction: 'સંગીત બનાવવા માટે કીઓ ટેપ કરો' },
};

const NOTES = [
  { note: 'C', freq: 261.63, color: 'bg-rose-400' },
  { note: 'D', freq: 293.66, color: 'bg-orange-400' },
  { note: 'E', freq: 329.63, color: 'bg-amber-400' },
  { note: 'F', freq: 349.23, color: 'bg-lime-400' },
  { note: 'G', freq: 392.00, color: 'bg-emerald-400' },
  { note: 'A', freq: 440.00, color: 'bg-cyan-400' },
  { note: 'B', freq: 493.88, color: 'bg-blue-400' },
  { note: 'C', freq: 523.25, color: 'bg-fuchsia-400' },
];

export default function MusicMaker({ language, onBack }: ActivityProps) {
  const t = TRANSLATIONS[language];

  useEffect(() => {
    playAudio(t.instruction, language);
  }, []);

  const playNote = (freq: number) => {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    
    gain.gain.setValueAtTime(0.5, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 1);
  };

  return (
    <div className="flex flex-col h-full">
      <ActivityHeader title={t.title} instruction={t.instruction} language={language} onBack={onBack} />
      
      <div className="flex-1 flex flex-col items-center justify-center gap-8">
        <div className="flex gap-2 sm:gap-4 p-4 sm:p-8 bg-white rounded-[3rem] shadow-2xl border-4 border-slate-100">
          {NOTES.map((n, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.05, y: -10 }}
              whileTap={{ scale: 0.95, y: 10 }}
              onClick={() => playNote(n.freq)}
              className={`w-12 sm:w-16 h-48 sm:h-64 rounded-b-2xl rounded-t-lg shadow-md border-2 border-white/50 flex items-end justify-center pb-6 text-white font-bold text-xl sm:text-2xl ${n.color}`}
            >
              {n.note}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
