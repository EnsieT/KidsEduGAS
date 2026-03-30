import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Language } from './types';
import { playAudio } from './lib/audio';
import { 
  Calculator, 
  Shapes as ShapesIcon, 
  Cat, 
  Type, 
  Hash, 
  Puzzle, 
  Search, 
  Brain, 
  Route,
  PaintBucket,
  LayoutGrid,
  Music,
  Star
} from 'lucide-react';

import Counting from './activities/Counting';
import Shapes from './activities/Shapes';
import Animals from './activities/Animals';
import Alphabet from './activities/Alphabet';
import MathActivity from './activities/Math';
import Patterns from './activities/Patterns';
import OddOneOut from './activities/OddOneOut';
import Memory from './activities/Memory';
import Maze from './activities/Maze';
import ColorByNumber from './activities/ColorByNumber';
import Jigsaw from './activities/Jigsaw';
import MusicMaker from './activities/MusicMaker';

const ACTIVITIES = [
  { id: 'counting', icon: Hash, color: 'bg-rose-400', en: 'Counting', hi: 'गिनती', gu: 'ગણતરી', component: Counting },
  { id: 'colornum', icon: PaintBucket, color: 'bg-blue-400', en: 'Color by Number', hi: 'नंबर से रंग', gu: 'નંબર દ્વારા રંગ', component: ColorByNumber },
  { id: 'shapes', icon: ShapesIcon, color: 'bg-emerald-400', en: 'Shapes', hi: 'आकार', gu: 'આકાર', component: Shapes },
  { id: 'animals', icon: Cat, color: 'bg-amber-400', en: 'Animals', hi: 'जानवर', gu: 'પ્રાણીઓ', component: Animals },
  { id: 'alphabet', icon: Type, color: 'bg-fuchsia-400', en: 'Alphabet', hi: 'वर्णमाला', gu: 'મૂળાક્ષરો', component: Alphabet },
  { id: 'math', icon: Calculator, color: 'bg-indigo-400', en: 'Math', hi: 'गणित', gu: 'ગણિત', component: MathActivity },
  { id: 'patterns', icon: Puzzle, color: 'bg-teal-400', en: 'Patterns', hi: 'पैटर्न', gu: 'પેટર્ન', component: Patterns },
  { id: 'odd', icon: Search, color: 'bg-orange-400', en: 'Odd One Out', hi: 'सबसे अलग', gu: 'સૌથી અલગ', component: OddOneOut },
  { id: 'memory', icon: Brain, color: 'bg-cyan-400', en: 'Memory', hi: 'याददाश्त', gu: 'યાદશક્તિ', component: Memory },
  { id: 'maze', icon: Route, color: 'bg-lime-400', en: 'Maze', hi: 'भूलभुलैया', gu: 'ભૂલભુલામણી', component: Maze },
  { id: 'jigsaw', icon: LayoutGrid, color: 'bg-sky-400', en: 'Jigsaw', hi: 'जिगसॉ', gu: 'જીગ્સૉ', component: Jigsaw },
  { id: 'music', icon: Music, color: 'bg-violet-400', en: 'Music', hi: 'संगीत', gu: 'સંગીત', component: MusicMaker },
];

export default function App() {
  const [language, setLanguage] = useState<Language>('en-IN');
  const [currentActivity, setCurrentActivity] = useState<string | null>(null);
  const [score, setScore] = useState<number>(() => {
    const saved = localStorage.getItem('edufun_score');
    return saved ? parseInt(saved, 10) : 0;
  });

  useEffect(() => {
    localStorage.setItem('edufun_score', score.toString());
  }, [score]);

  const handleScore = (points: number) => {
    setScore(prev => prev + points);
  };

  const handleActivitySelect = (id: string, name: string) => {
    playAudio(`Let's play ${name}`, language);
    setCurrentActivity(id);
  };

  const ActiveComponent = ACTIVITIES.find(a => a.id === currentActivity)?.component;

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-rose-100/50 blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-100/50 blur-3xl" />
        <div className="absolute top-[20%] right-[10%] w-[20%] h-[20%] rounded-full bg-amber-100/50 blur-3xl" />
      </div>

      <div className="relative max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 min-h-screen flex flex-col">
        <header className="flex flex-wrap items-center justify-center sm:justify-between gap-4 mb-8 bg-white/80 backdrop-blur-md p-4 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 rotate-3">
              <span className="text-2xl">🌟</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
              Edu<span className="text-indigo-500">Fun</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-amber-100 px-4 py-2 rounded-xl border-2 border-amber-200">
              <Star className="text-amber-500 fill-amber-500" size={24} />
              <span className="font-bold text-amber-700 text-lg">{score}</span>
            </div>
            <div className="flex bg-slate-100 p-1.5 rounded-2xl shadow-inner">
            {(['en-IN', 'hi-IN', 'gu-IN'] as Language[]).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  language === lang 
                    ? 'bg-white text-indigo-600 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                }`}
              >
                {lang === 'en-IN' ? 'English' : lang === 'hi-IN' ? 'हिंदी' : 'ગુજરાતી'}
              </button>
            ))}
            </div>
          </div>
        </header>

        <main className="flex-1 relative flex flex-col">
          <AnimatePresence mode="wait">
            {!currentActivity ? (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 pb-12"
              >
                {ACTIVITIES.map((activity, index) => {
                  const Icon = activity.icon;
                  const title = language === 'en-IN' ? activity.en : language === 'hi-IN' ? activity.hi : activity.gu;
                  
                  return (
                    <motion.button
                      key={activity.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.05, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleActivitySelect(activity.id, title)}
                      className={`${activity.color} aspect-square rounded-[2rem] p-6 flex flex-col items-center justify-center gap-4 text-white shadow-lg hover:shadow-xl transition-all border-4 border-white/20 relative overflow-hidden group`}
                    >
                      <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />
                      <Icon size={48} strokeWidth={2.5} className="drop-shadow-md" />
                      <span className="font-bold text-lg sm:text-xl text-center drop-shadow-md leading-tight">
                        {title}
                      </span>
                    </motion.button>
                  );
                })}
              </motion.div>
            ) : (
              <motion.div
                key="activity"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, y: 20 }}
                className="flex-1 bg-white/50 backdrop-blur-xl rounded-[2rem] sm:rounded-[3rem] p-4 sm:p-8 shadow-2xl border border-white flex flex-col min-h-[500px] sm:min-h-[600px]"
              >
                {ActiveComponent && (
                  <ActiveComponent 
                    language={language} 
                    onComplete={() => {}} 
                    onBack={() => setCurrentActivity(null)} 
                    onScore={handleScore}
                    score={score}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
