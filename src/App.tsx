import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Language } from './types';
import { playAudio } from './lib/audio';
import { Star, X, ShoppingBag } from 'lucide-react';

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
import WordMatch from './activities/WordMatch';
import Colors from './activities/Colors';
import SizeSorting from './activities/SizeSorting';
import SillySentences from './activities/SillySentences';
import Tracing from './activities/Tracing';
import Emotions from './activities/Emotions';

const ACTIVITIES = [
  { id: 'counting', emoji: '🔢', color: 'bg-rose-400', en: 'Counting', hi: 'गिनती', gu: 'ગણતરી', component: Counting },
  { id: 'colornum', emoji: '🎨', color: 'bg-blue-400', en: 'Color by Number', hi: 'नंबर से रंग', gu: 'નંબર દ્વારા રંગ', component: ColorByNumber },
  { id: 'shapes', emoji: '🔺', color: 'bg-emerald-400', en: 'Shapes', hi: 'आकार', gu: 'આકાર', component: Shapes },
  { id: 'animals', emoji: '🦁', color: 'bg-amber-400', en: 'Animals', hi: 'जानवर', gu: 'પ્રાણીઓ', component: Animals },
  { id: 'alphabet', emoji: '🔤', color: 'bg-fuchsia-400', en: 'Alphabet', hi: 'वर्णमाला', gu: 'મૂળાક્ષરો', component: Alphabet },
  { id: 'silly', emoji: '🤪', color: 'bg-orange-400', en: 'Silly Sentences', hi: 'मजेदार वाक्य', gu: 'રમુજી વાક્યો', component: SillySentences },
  { id: 'tracing', emoji: '✍️', color: 'bg-pink-500', en: 'Tracing', hi: 'लिखना', gu: 'લખવું', component: Tracing },
  { id: 'emotions', emoji: '🎭', color: 'bg-yellow-400', en: 'Emotions', hi: 'भावनाएं', gu: 'લાગણીઓ', component: Emotions },
  { id: 'math', emoji: '➕', color: 'bg-indigo-400', en: 'Math', hi: 'गणित', gu: 'ગણિત', component: MathActivity },
  { id: 'patterns', emoji: '🧩', color: 'bg-teal-400', en: 'Patterns', hi: 'पैटर्न', gu: 'પેટર્ન', component: Patterns },
  { id: 'odd', emoji: '🔍', color: 'bg-orange-400', en: 'Odd One Out', hi: 'सबसे अलग', gu: 'સૌથી अलग', component: OddOneOut },
  { id: 'memory', emoji: '🧠', color: 'bg-cyan-400', en: 'Memory', hi: 'याददाश्त', gu: 'યાદશક્તિ', component: Memory },
  { id: 'maze', emoji: '🗺️', color: 'bg-lime-400', en: 'Maze', hi: 'भूलभुलैया', gu: 'ભૂલભુલામણી', component: Maze },
  { id: 'jigsaw', emoji: '🖼️', color: 'bg-sky-400', en: 'Jigsaw', hi: 'जिगसॉ', gu: 'જીગ્સૉ', component: Jigsaw },
  { id: 'music', emoji: '🎵', color: 'bg-violet-400', en: 'Music', hi: 'संगीत', gu: 'સંગીત', component: MusicMaker },
  { id: 'wordmatch', emoji: '📖', color: 'bg-yellow-500', en: 'Word Match', hi: 'शब्द मिलान', gu: 'શબ્દ મેળવો', component: WordMatch },
  { id: 'colors', emoji: '🌈', color: 'bg-red-400', en: 'Colors', hi: 'रंग', gu: 'રંગ', component: Colors },
  { id: 'sizes', emoji: '📏', color: 'bg-indigo-500', en: 'Size Sorting', hi: 'आकार छाँटें', gu: 'કદ પ્રમાણે ગોઠવો', component: SizeSorting },
];

const STICKERS = [
  { id: 's1', emoji: '🦖', price: 20 },
  { id: 's2', emoji: '🦄', price: 50 },
  { id: 's3', emoji: '🚀', price: 30 },
  { id: 's4', emoji: '👑', price: 100 },
  { id: 's5', emoji: '🎸', price: 40 },
  { id: 's6', emoji: '🍦', price: 10 },
  { id: 's7', emoji: '🎈', price: 15 },
  { id: 's8', emoji: '💎', price: 200 },
  { id: 's9', emoji: '🐶', price: 25 },
  { id: 's10', emoji: '🧚‍♀️', price: 75 },
  { id: 's11', emoji: '🏎️', price: 60 },
  { id: 's12', emoji: '🍕', price: 15 },
  { id: 's13', emoji: '🦸‍♂️', price: 80 },
  { id: 's14', emoji: '🦋', price: 35 },
  { id: 's15', emoji: '🎮', price: 90 },
  { id: 's16', emoji: '🏆', price: 150 },
  { id: 's17', emoji: '🌈', price: 45 },
  { id: 's18', emoji: '🎨', price: 25 },
];

export default function App() {
  const [language, setLanguage] = useState<Language>('en-IN');
  const [currentActivity, setCurrentActivity] = useState<string | null>(null);
  const [showCompletion, setShowCompletion] = useState(false);
  const [showRewards, setShowRewards] = useState(false);
  const [unlockedStickers, setUnlockedStickers] = useState<string[]>(() => {
    const saved = localStorage.getItem('edufun_stickers');
    return saved ? JSON.parse(saved) : [];
  });
  const [placedStickers, setPlacedStickers] = useState<{id: string, emoji: string, x: number, y: number}[]>(() => {
    const saved = localStorage.getItem('edufun_placed');
    return saved ? JSON.parse(saved) : [];
  });
  const [rewardTab, setRewardTab] = useState<'shop' | 'board'>('shop');
  const [score, setScore] = useState<number>(() => {
    const saved = localStorage.getItem('edufun_score');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [dailyDate, setDailyDate] = useState(() => localStorage.getItem('edufun_date') || '');
  const [dailyChallenges, setDailyChallenges] = useState<string[]>(() => {
    const saved = localStorage.getItem('edufun_challenges');
    return saved ? JSON.parse(saved) : [];
  });
  const [completedChallenges, setCompletedChallenges] = useState<string[]>(() => {
    const saved = localStorage.getItem('edufun_completed');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('edufun_score', score.toString());
  }, [score]);

  useEffect(() => {
    localStorage.setItem('edufun_stickers', JSON.stringify(unlockedStickers));
  }, [unlockedStickers]);

  useEffect(() => {
    localStorage.setItem('edufun_placed', JSON.stringify(placedStickers));
  }, [placedStickers]);

  const buySticker = (sticker: typeof STICKERS[0]) => {
    if (unlockedStickers.includes(sticker.id)) return;
    if (score >= sticker.price) {
      setScore(prev => prev - sticker.price);
      setUnlockedStickers(prev => [...prev, sticker.id]);
      playAudio('Yay! New sticker!', language);
      import('canvas-confetti').then((confetti) => {
        confetti.default({ particleCount: 100, spread: 60, origin: { y: 0.5 } });
      });
    } else {
      playAudio('Not enough stars yet! Keep playing!', language);
    }
  };

  useEffect(() => {
    const today = new Date().toDateString();
    if (dailyDate !== today) {
      const shuffled = [...ACTIVITIES].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 3).map(a => a.id);
      setDailyDate(today);
      setDailyChallenges(selected);
      setCompletedChallenges([]);
      localStorage.setItem('edufun_date', today);
      localStorage.setItem('edufun_challenges', JSON.stringify(selected));
      localStorage.setItem('edufun_completed', JSON.stringify([]));
    }
  }, [dailyDate]);

  const handleScore = (points: number) => {
    setScore(prev => prev + points);
  };

  const handleActivitySelect = (id: string, name: string) => {
    playAudio(`Let's play ${name}`, language);
    setCurrentActivity(id);
    setShowCompletion(false);
  };

  const handleComplete = () => {
    let bonus = false;
    if (currentActivity && dailyChallenges.includes(currentActivity) && !completedChallenges.includes(currentActivity)) {
      const newCompleted = [...completedChallenges, currentActivity];
      setCompletedChallenges(newCompleted);
      localStorage.setItem('edufun_completed', JSON.stringify(newCompleted));
      if (newCompleted.length === 3) {
        bonus = true;
        handleScore(50);
      }
    }

    import('canvas-confetti').then((confetti) => {
      confetti.default({
        particleCount: bonus ? 500 : 300,
        spread: bonus ? 160 : 100,
        origin: { y: 0.3 },
        colors: ['#fde047', '#a78bfa', '#f472b6', '#38bdf8', '#4ade80']
      });
    });
    playAudio(bonus ? 'Daily challenges completed! Amazing!' : 'Activity Completed! Great job!', language);
    setShowCompletion(true);
  };

  const ActiveComponent = ACTIVITIES.find(a => a.id === currentActivity)?.component;

  return (
    <div className="min-h-screen bg-sky-100 font-sans selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">
      {/* Kid-friendly background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Rainbows */}
        <div className="absolute top-[-5%] left-[-5%] text-[20rem] opacity-30 rotate-12">🌈</div>
        <div className="absolute bottom-[-10%] right-[-5%] text-[25rem] opacity-20 -rotate-12">🌈</div>
        
        {/* Unicorns */}
        <div className="absolute top-[15%] right-[10%] text-8xl opacity-40 animate-bounce" style={{ animationDuration: '4s' }}>🦄</div>
        <div className="absolute bottom-[20%] left-[5%] text-9xl opacity-30 animate-bounce" style={{ animationDuration: '5s', animationDelay: '1s' }}>🦄</div>
        
        {/* Clouds & Stars */}
        <div className="absolute top-[30%] left-[20%] text-7xl opacity-50 animate-pulse">☁️</div>
        <div className="absolute top-[40%] right-[25%] text-6xl opacity-50 animate-pulse" style={{ animationDelay: '2s' }}>☁️</div>
        <div className="absolute bottom-[30%] left-[30%] text-5xl opacity-60 animate-pulse">✨</div>
        <div className="absolute top-[20%] left-[40%] text-4xl opacity-60 animate-pulse" style={{ animationDelay: '1s' }}>⭐</div>
        <div className="absolute bottom-[40%] right-[20%] text-5xl opacity-60 animate-pulse" style={{ animationDelay: '1.5s' }}>🌟</div>
      </div>

      <div className="relative max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 min-h-screen flex flex-col">
        <header className="flex flex-wrap items-center justify-center sm:justify-between gap-4 mb-8 bg-white/80 backdrop-blur-md p-4 rounded-3xl shadow-sm border border-white">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 rotate-3">
              <span className="text-2xl">🌟</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
              Edu<span className="text-indigo-500">Fun</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowRewards(true)}
              className="flex items-center gap-2 bg-pink-100 px-4 py-2 rounded-xl border-2 border-pink-200 text-pink-600 font-bold shadow-sm"
            >
              <ShoppingBag size={20} />
              <span className="hidden sm:inline">{language === 'en-IN' ? 'Rewards' : language === 'hi-IN' ? 'इनाम' : 'ઇનામ'}</span>
            </motion.button>
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
                className="flex flex-col gap-8 pb-12"
              >
                {/* Daily Challenges */}
                <div className="bg-white/60 backdrop-blur-md rounded-3xl p-4 sm:p-6 border-4 border-white/50 shadow-lg">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                    📅 {language === 'en-IN' ? 'Daily Challenges' : language === 'hi-IN' ? 'आज की चुनौतियां' : 'આજના પડકારો'}
                    {completedChallenges.length === 3 && ' ✨'}
                  </h2>
                  <div className="flex flex-wrap gap-3 sm:gap-4">
                    {dailyChallenges.map(id => {
                      const activity = ACTIVITIES.find(a => a.id === id);
                      if (!activity) return null;
                      const isCompleted = completedChallenges.includes(id);
                      const title = language === 'en-IN' ? activity.en : language === 'hi-IN' ? activity.hi : activity.gu;
                      return (
                        <div key={id} className={`flex items-center gap-2 sm:gap-3 px-3 py-2 sm:px-4 sm:py-2 rounded-2xl border-2 ${isCompleted ? 'bg-green-100 border-green-300 opacity-70' : 'bg-white border-indigo-100 shadow-sm'}`}>
                          <span className="text-xl sm:text-2xl">{isCompleted ? '✅' : activity.emoji}</span>
                          <span className={`font-bold text-sm sm:text-base ${isCompleted ? 'text-green-700 line-through' : 'text-slate-700'}`}>{title}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                  {ACTIVITIES.map((activity, index) => {
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
                      className={`${activity.color} aspect-square rounded-[2rem] p-4 sm:p-6 flex flex-col items-center justify-center gap-2 sm:gap-4 text-white shadow-lg hover:shadow-xl transition-all border-4 border-white/30 relative overflow-hidden group`}
                    >
                      <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />
                      <span className="text-5xl sm:text-6xl drop-shadow-md transition-transform group-hover:scale-110 group-hover:rotate-6">
                        {activity.emoji}
                      </span>
                      <span className="font-bold text-lg sm:text-xl text-center drop-shadow-md leading-tight">
                        {title}
                      </span>
                    </motion.button>
                  );
                })}
                </div>
              </motion.div>
            ) : showCompletion ? (
              <motion.div
                key="completion"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex-1 bg-white/90 backdrop-blur-xl rounded-[3rem] p-8 shadow-2xl border-4 border-yellow-300 flex flex-col items-center justify-center text-center min-h-[500px]"
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 10, 0], scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="text-8xl mb-8"
                >
                  🏆
                </motion.div>
                <h2 className="text-4xl sm:text-5xl font-black text-indigo-600 mb-4">
                  {language === 'en-IN' ? 'Activity Completed!' : language === 'hi-IN' ? 'गतिविधि पूरी हुई!' : 'પ્રવૃત્તિ પૂર્ણ!'}
                </h2>
                <p className="text-2xl text-slate-600 mb-12 font-bold">
                  {language === 'en-IN' ? 'You earned stars!' : language === 'hi-IN' ? 'आपको सितारे मिले!' : 'તમે સ્ટાર્સ કમાવ્યા!'}
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setShowCompletion(false);
                    setCurrentActivity(null);
                  }}
                  className="bg-indigo-500 text-white px-8 py-4 rounded-full text-2xl font-bold shadow-lg hover:bg-indigo-600 hover:shadow-xl transition-all"
                >
                  {language === 'en-IN' ? 'Play More' : language === 'hi-IN' ? 'और खेलें' : 'વધુ રમો'}
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key="activity"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, y: 20 }}
                className="flex-1 bg-white/80 backdrop-blur-xl rounded-[2rem] sm:rounded-[3rem] p-4 sm:p-8 shadow-2xl border-4 border-white flex flex-col min-h-[500px] sm:min-h-[600px]"
              >
                {ActiveComponent && (
                  <ActiveComponent 
                    language={language} 
                    onComplete={handleComplete} 
                    onBack={() => setCurrentActivity(null)} 
                    onScore={handleScore}
                    score={score}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        <AnimatePresence>
          {showRewards && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-white rounded-[3rem] p-6 sm:p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto border-4 border-pink-300 shadow-2xl"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-3xl sm:text-4xl font-black text-pink-500 flex items-center gap-3">
                    🛍️ {language === 'en-IN' ? 'Sticker Shop' : language === 'hi-IN' ? 'स्टिकर की दुकान' : 'સ્ટીકર દુકાન'}
                  </h2>
                  <button onClick={() => setShowRewards(false)} className="text-slate-400 hover:text-slate-600 bg-slate-100 p-2 rounded-full">
                    <X size={32} />
                  </button>
                </div>

                <div className="flex gap-4 mb-6">
                  <button
                    onClick={() => setRewardTab('shop')}
                    className={`flex-1 py-3 rounded-2xl font-bold text-lg border-4 transition-all ${
                      rewardTab === 'shop' 
                        ? 'bg-pink-100 border-pink-300 text-pink-600' 
                        : 'bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100'
                    }`}
                  >
                    {language === 'en-IN' ? 'Shop' : language === 'hi-IN' ? 'दुकान' : 'દુકાન'}
                  </button>
                  <button
                    onClick={() => setRewardTab('board')}
                    className={`flex-1 py-3 rounded-2xl font-bold text-lg border-4 transition-all ${
                      rewardTab === 'board' 
                        ? 'bg-indigo-100 border-indigo-300 text-indigo-600' 
                        : 'bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100'
                    }`}
                  >
                    {language === 'en-IN' ? 'My Board' : language === 'hi-IN' ? 'मेरा बोर्ड' : 'મારું બોર્ડ'}
                  </button>
                </div>

                {rewardTab === 'shop' ? (
                  <>
                    <div className="bg-amber-50 rounded-2xl p-4 mb-8 flex items-center justify-center gap-3 border-2 border-amber-200">
                      <span className="text-lg font-bold text-amber-700">
                        {language === 'en-IN' ? 'You have' : language === 'hi-IN' ? 'आपके पास हैं' : 'તમારી પાસે છે'}
                      </span>
                      <div className="flex items-center gap-1 bg-white px-3 py-1 rounded-full shadow-sm">
                        <Star className="text-amber-500 fill-amber-500" size={20} />
                        <span className="font-bold text-amber-700 text-xl">{score}</span>
                      </div>
                      <span className="text-lg font-bold text-amber-700">
                        {language === 'en-IN' ? 'stars to spend!' : language === 'hi-IN' ? 'सितारे खर्च करने के लिए!' : 'ખર્ચવા માટે સ્ટાર્સ!'}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                      {STICKERS.map(sticker => {
                        const isUnlocked = unlockedStickers.includes(sticker.id);
                        const canAfford = score >= sticker.price;
                        
                        return (
                          <motion.button
                            key={sticker.id}
                            whileHover={!isUnlocked ? { scale: 1.05 } : {}}
                            whileTap={!isUnlocked ? { scale: 0.95 } : {}}
                            onClick={() => buySticker(sticker)}
                            className={`relative aspect-square rounded-2xl flex flex-col items-center justify-center gap-2 border-4 transition-all ${
                              isUnlocked 
                                ? 'bg-gradient-to-br from-green-100 to-emerald-50 border-green-300 shadow-inner' 
                                : canAfford
                                  ? 'bg-white border-pink-200 shadow-md hover:border-pink-400 hover:shadow-lg cursor-pointer'
                                  : 'bg-slate-50 border-slate-200 opacity-70 cursor-not-allowed'
                            }`}
                          >
                            <span className={`text-4xl sm:text-5xl ${!isUnlocked && 'grayscale opacity-50'}`}>
                              {sticker.emoji}
                            </span>
                            
                            {!isUnlocked && (
                              <div className={`absolute -bottom-3 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm border-2 ${
                                canAfford ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-slate-200 text-slate-500 border-slate-300'
                              }`}>
                                <Star size={12} className={canAfford ? 'fill-amber-500 text-amber-500' : 'fill-slate-400 text-slate-400'} />
                                {sticker.price}
                              </div>
                            )}
                            
                            {isUnlocked && (
                              <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold shadow-sm border-2 border-white">
                                ✓
                              </div>
                            )}
                          </motion.button>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col gap-4">
                    <div className="flex gap-2 overflow-x-auto p-2 bg-slate-100 rounded-2xl border-2 border-slate-200">
                      {unlockedStickers.length === 0 ? (
                        <p className="text-slate-500 p-2 text-center w-full">
                          {language === 'en-IN' ? 'Buy stickers from the shop first!' : language === 'hi-IN' ? 'पहले दुकान से स्टिकर खरीदें!' : 'પહેલા દુકાનમાંથી સ્ટીકર ખરીદો!'}
                        </p>
                      ) : (
                        unlockedStickers.map(id => {
                          const sticker = STICKERS.find(s => s.id === id);
                          if (!sticker) return null;
                          return (
                            <button
                              key={id}
                              onClick={() => {
                                setPlacedStickers(prev => [
                                  ...prev,
                                  { id: Math.random().toString(), emoji: sticker.emoji, x: 0, y: 0 }
                                ]);
                              }}
                              className="text-4xl bg-white p-2 rounded-xl border-2 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all shrink-0"
                            >
                              {sticker.emoji}
                            </button>
                          );
                        })
                      )}
                    </div>
                    
                    <div className="relative w-full h-[400px] bg-sky-100 rounded-3xl border-4 border-sky-300 overflow-hidden shadow-inner" style={{ backgroundImage: 'radial-gradient(#bae6fd 2px, transparent 2px)', backgroundSize: '20px 20px' }}>
                      {placedStickers.map((sticker) => (
                        <motion.div
                          key={sticker.id}
                          drag
                          dragMomentum={false}
                          initial={{ scale: 0, x: 150, y: 150 }}
                          animate={{ scale: 1 }}
                          className="absolute text-6xl cursor-grab active:cursor-grabbing drop-shadow-md"
                          style={{ x: sticker.x, y: sticker.y }}
                          onDragEnd={(_, info) => {
                            setPlacedStickers(prev => prev.map(s => 
                              s.id === sticker.id 
                                ? { ...s, x: s.x + info.offset.x, y: s.y + info.offset.y }
                                : s
                            ));
                          }}
                        >
                          {sticker.emoji}
                        </motion.div>
                      ))}
                      {placedStickers.length > 0 && (
                        <button
                          onClick={() => setPlacedStickers([])}
                          className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-sm text-slate-500 px-4 py-2 rounded-full text-sm font-bold border-2 border-slate-200 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all"
                        >
                          {language === 'en-IN' ? 'Clear Board' : language === 'hi-IN' ? 'बोर्ड साफ़ करें' : 'બોર્ડ સાફ કરો'}
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
