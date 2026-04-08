import { ArrowLeft, PlayCircle } from 'lucide-react';
import { Language } from '../types';
import { playAudio } from '../lib/audio';

interface ActivityHeaderProps {
  title: string;
  instruction: string;
  language: Language;
  onBack: () => void;
}

export function ActivityHeader({ title, instruction, language, onBack }: ActivityHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm mb-6">
      <button 
        onClick={onBack}
        className="p-3 bg-rose-100 text-rose-600 rounded-full hover:bg-rose-200 transition-colors"
      >
        <ArrowLeft size={24} />
      </button>
      
      <h2 className="text-2xl font-bold text-slate-800 text-center flex-1 mx-4">
        {title}
      </h2>

      <button 
        onClick={() => playAudio(instruction, language)}
        className="p-3 bg-sky-100 text-sky-600 rounded-full hover:bg-sky-200 transition-colors animate-pulse"
        aria-label="Play Instruction"
      >
        <PlayCircle size={24} />
      </button>
    </div>
  );
}
