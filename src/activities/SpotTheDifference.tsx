import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { ActivityProps } from '../types';
import { ActivityHeader } from '../components/ActivityHeader';
import { playAudio } from '../lib/audio';

const TRANSLATIONS = {
  'en-IN': { title: 'Spot the Difference', instruction: 'Find 3 differences in the second picture!' },
  'hi-IN': { title: 'अंतर पहचानें', instruction: 'दूसरे चित्र में 3 अंतर खोजें!' },
  'gu-IN': { title: 'તફાવત શોધો', instruction: 'બીજા ચિત્રમાં 3 તફાવતો શોધો!' },
};

const LEVELS = [
  {
    id: 'space',
    renderLeft: () => (
      <svg viewBox="0 0 200 200" className="w-full h-full rounded-2xl">
        <rect width="200" height="200" fill="#1e1b4b" />
        <circle cx="100" cy="100" r="40" fill="#fde047" />
        <circle cx="40" cy="40" r="5" fill="#fff" />
        <circle cx="160" cy="150" r="5" fill="#fff" />
        <rect x="80" y="150" width="40" height="50" fill="#ef4444" rx="5" />
        <polygon points="80,150 100,120 120,150" fill="#ef4444" />
      </svg>
    ),
    renderRight: () => (
      <svg viewBox="0 0 200 200" className="w-full h-full rounded-2xl">
        <rect width="200" height="200" fill="#1e1b4b" />
        <circle cx="100" cy="100" r="40" fill="#fde047" />
        {/* Difference 1: Missing star */}
        <circle cx="160" cy="150" r="5" fill="#fff" />
        {/* Difference 2: Blue rocket instead of red */}
        <rect x="80" y="150" width="40" height="50" fill="#3b82f6" rx="5" />
        <polygon points="80,150 100,120 120,150" fill="#3b82f6" />
        {/* Difference 3: Alien on moon */}
        <circle cx="100" cy="100" r="10" fill="#22c55e" />
        <circle cx="95" cy="95" r="2" fill="#000" />
        <circle cx="105" cy="95" r="2" fill="#000" />
      </svg>
    ),
    differences: [
      { id: 'star', cx: 40, cy: 40, r: 20 },
      { id: 'rocket', cx: 100, cy: 160, r: 30 },
      { id: 'alien', cx: 100, cy: 100, r: 20 },
    ]
  },
  {
    id: 'beach',
    renderLeft: () => (
      <svg viewBox="0 0 200 200" className="w-full h-full rounded-2xl">
        <rect width="200" height="120" fill="#38bdf8" />
        <rect y="120" width="200" height="80" fill="#fde047" />
        <circle cx="40" cy="40" r="25" fill="#facc15" />
        <path d="M 120 100 L 160 100 L 140 130 Z" fill="#ef4444" />
        <rect x="135" y="100" width="10" height="30" fill="#b45309" />
        <circle cx="60" cy="160" r="15" fill="#f87171" /> {/* Crab */}
      </svg>
    ),
    renderRight: () => (
      <svg viewBox="0 0 200 200" className="w-full h-full rounded-2xl">
        <rect width="200" height="120" fill="#38bdf8" />
        <rect y="120" width="200" height="80" fill="#fde047" />
        <circle cx="40" cy="40" r="25" fill="#facc15" />
        {/* Difference 1: Sun has sunglasses */}
        <rect x="25" y="35" width="30" height="10" fill="#000" rx="2" />
        {/* Difference 2: Boat missing sail */}
        <rect x="135" y="100" width="10" height="30" fill="#b45309" />
        {/* Difference 3: Crab is green (turtle) */}
        <circle cx="60" cy="160" r="15" fill="#22c55e" />
      </svg>
    ),
    differences: [
      { id: 'sunglasses', cx: 40, cy: 40, r: 25 },
      { id: 'sail', cx: 140, cy: 115, r: 25 },
      { id: 'turtle', cx: 60, cy: 160, r: 20 },
    ]
  },
  {
    id: 'forest',
    renderLeft: () => (
      <svg viewBox="0 0 200 200" className="w-full h-full rounded-2xl">
        <rect width="200" height="200" fill="#86efac" />
        {/* Tree 1 */}
        <rect x="30" y="80" width="20" height="120" fill="#78350f" />
        <circle cx="40" cy="70" r="40" fill="#166534" />
        <circle cx="20" cy="60" r="5" fill="#ef4444" />
        <circle cx="50" cy="80" r="5" fill="#ef4444" />
        <circle cx="45" cy="40" r="5" fill="#ef4444" />
        {/* Tree 2 */}
        <rect x="140" y="100" width="15" height="100" fill="#78350f" />
        <polygon points="147,40 110,120 185,120" fill="#15803d" />
        <polygon points="147,20 120,80 175,80" fill="#16a34a" />
        {/* Bird */}
        <path d="M 100 40 Q 110 30 120 40 Q 110 50 100 40 Z" fill="#3b82f6" />
      </svg>
    ),
    renderRight: () => (
      <svg viewBox="0 0 200 200" className="w-full h-full rounded-2xl">
        <rect width="200" height="200" fill="#86efac" />
        {/* Tree 1 */}
        <rect x="30" y="80" width="20" height="120" fill="#78350f" />
        <circle cx="40" cy="70" r="40" fill="#166534" />
        <circle cx="20" cy="60" r="5" fill="#ef4444" />
        <circle cx="50" cy="80" r="5" fill="#ef4444" />
        {/* Difference 1: Missing apple */}
        {/* Tree 2 */}
        <rect x="140" y="100" width="15" height="100" fill="#78350f" />
        {/* Difference 2: Extra branch on Tree 2 */}
        <rect x="120" y="130" width="30" height="8" fill="#78350f" transform="rotate(-20 140 130)" />
        <polygon points="147,40 110,120 185,120" fill="#15803d" />
        <polygon points="147,20 120,80 175,80" fill="#16a34a" />
        {/* Difference 3: Bird is red */}
        <path d="M 100 40 Q 110 30 120 40 Q 110 50 100 40 Z" fill="#ef4444" />
      </svg>
    ),
    differences: [
      { id: 'apple', cx: 45, cy: 40, r: 15 },
      { id: 'branch', cx: 130, cy: 130, r: 20 },
      { id: 'bird', cx: 110, cy: 40, r: 20 },
    ]
  },
  {
    id: 'city',
    renderLeft: () => (
      <svg viewBox="0 0 200 200" className="w-full h-full rounded-2xl">
        <rect width="200" height="200" fill="#1e293b" />
        <circle cx="160" cy="40" r="20" fill="#cbd5e1" />
        {/* Building 1 */}
        <rect x="20" y="80" width="50" height="120" fill="#475569" />
        <rect x="30" y="100" width="10" height="15" fill="#fef08a" />
        <rect x="50" y="100" width="10" height="15" fill="#fef08a" />
        <rect x="30" y="130" width="10" height="15" fill="#1e293b" />
        {/* Building 2 */}
        <rect x="80" y="50" width="60" height="150" fill="#334155" />
        <rect x="95" y="70" width="10" height="10" fill="#fef08a" />
        <rect x="115" y="70" width="10" height="10" fill="#1e293b" />
        {/* Car */}
        <rect x="10" y="180" width="30" height="10" fill="#ef4444" rx="3" />
        <circle cx="15" cy="190" r="4" fill="#000" />
        <circle cx="35" cy="190" r="4" fill="#000" />
      </svg>
    ),
    renderRight: () => (
      <svg viewBox="0 0 200 200" className="w-full h-full rounded-2xl">
        <rect width="200" height="200" fill="#1e293b" />
        {/* Difference 1: Missing moon */}
        {/* Building 1 */}
        <rect x="20" y="80" width="50" height="120" fill="#475569" />
        <rect x="30" y="100" width="10" height="15" fill="#fef08a" />
        {/* Difference 2: Window light off */}
        <rect x="50" y="100" width="10" height="15" fill="#1e293b" />
        <rect x="30" y="130" width="10" height="15" fill="#1e293b" />
        {/* Building 2 */}
        <rect x="80" y="50" width="60" height="150" fill="#334155" />
        <rect x="95" y="70" width="10" height="10" fill="#fef08a" />
        <rect x="115" y="70" width="10" height="10" fill="#1e293b" />
        {/* Difference 3: Car is blue */}
        <rect x="10" y="180" width="30" height="10" fill="#3b82f6" rx="3" />
        <circle cx="15" cy="190" r="4" fill="#000" />
        <circle cx="35" cy="190" r="4" fill="#000" />
      </svg>
    ),
    differences: [
      { id: 'moon', cx: 160, cy: 40, r: 25 },
      { id: 'window', cx: 55, cy: 107, r: 15 },
      { id: 'car', cx: 25, cy: 185, r: 20 },
    ]
  },
  {
    id: 'farm',
    renderLeft: () => (
      <svg viewBox="0 0 200 200" className="w-full h-full rounded-2xl">
        <rect width="200" height="100" fill="#60a5fa" />
        <rect y="100" width="200" height="100" fill="#84cc16" />
        {/* Barn */}
        <rect x="20" y="60" width="80" height="60" fill="#dc2626" />
        <polygon points="10,60 60,20 110,60" fill="#991b1b" />
        <rect x="50" y="90" width="20" height="30" fill="#fef08a" />
        {/* Sun */}
        <circle cx="160" cy="40" r="20" fill="#facc15" />
        {/* Fence */}
        <rect x="120" y="100" width="80" height="5" fill="#d97706" />
        <rect x="120" y="115" width="80" height="5" fill="#d97706" />
        <rect x="130" y="95" width="5" height="30" fill="#b45309" />
        <rect x="170" y="95" width="5" height="30" fill="#b45309" />
        {/* Pig */}
        <circle cx="150" cy="150" r="15" fill="#f472b6" />
        <circle cx="145" cy="145" r="2" fill="#000" />
        <circle cx="155" cy="145" r="2" fill="#000" />
      </svg>
    ),
    renderRight: () => (
      <svg viewBox="0 0 200 200" className="w-full h-full rounded-2xl">
        <rect width="200" height="100" fill="#60a5fa" />
        <rect y="100" width="200" height="100" fill="#84cc16" />
        {/* Barn */}
        <rect x="20" y="60" width="80" height="60" fill="#dc2626" />
        <polygon points="10,60 60,20 110,60" fill="#991b1b" />
        {/* Difference 1: Barn door is blue */}
        <rect x="50" y="90" width="20" height="30" fill="#3b82f6" />
        {/* Difference 2: Sun is missing */}
        {/* Fence */}
        <rect x="120" y="100" width="80" height="5" fill="#d97706" />
        <rect x="120" y="115" width="80" height="5" fill="#d97706" />
        <rect x="130" y="95" width="5" height="30" fill="#b45309" />
        <rect x="170" y="95" width="5" height="30" fill="#b45309" />
        {/* Difference 3: Pig is green */}
        <circle cx="150" cy="150" r="15" fill="#22c55e" />
        <circle cx="145" cy="145" r="2" fill="#000" />
        <circle cx="155" cy="145" r="2" fill="#000" />
      </svg>
    ),
    differences: [
      { id: 'door', cx: 60, cy: 105, r: 20 },
      { id: 'sun', cx: 160, cy: 40, r: 25 },
      { id: 'pig', cx: 150, cy: 150, r: 20 },
    ]
  },
  {
    id: 'desert',
    renderLeft: () => (
      <svg viewBox="0 0 200 200" className="w-full h-full rounded-2xl">
        <rect width="200" height="120" fill="#fde047" />
        <rect y="120" width="200" height="80" fill="#fef08a" />
        <circle cx="160" cy="40" r="20" fill="#f97316" />
        <rect x="40" y="80" width="15" height="60" fill="#22c55e" rx="5" />
        <rect x="25" y="100" width="15" height="10" fill="#22c55e" rx="3" />
        <rect x="55" y="90" width="15" height="10" fill="#22c55e" rx="3" />
        <polygon points="120,120 150,60 180,120" fill="#fbbf24" />
      </svg>
    ),
    renderRight: () => (
      <svg viewBox="0 0 200 200" className="w-full h-full rounded-2xl">
        <rect width="200" height="120" fill="#fde047" />
        <rect y="120" width="200" height="80" fill="#fef08a" />
        <circle cx="160" cy="40" r="20" fill="#f97316" />
        {/* Diff 1: Cactus missing left arm */}
        <rect x="40" y="80" width="15" height="60" fill="#22c55e" rx="5" />
        <rect x="55" y="90" width="15" height="10" fill="#22c55e" rx="3" />
        {/* Diff 2: Pyramid is taller */}
        <polygon points="120,120 150,40 180,120" fill="#fbbf24" />
        {/* Diff 3: Extra cloud */}
        <circle cx="60" cy="30" r="10" fill="#fff" />
        <circle cx="75" cy="30" r="15" fill="#fff" />
        <circle cx="90" cy="30" r="10" fill="#fff" />
      </svg>
    ),
    differences: [
      { id: 'arm', cx: 30, cy: 105, r: 15 },
      { id: 'pyramid', cx: 150, cy: 50, r: 20 },
      { id: 'cloud', cx: 75, cy: 30, r: 25 },
    ]
  },
  {
    id: 'snow',
    renderLeft: () => (
      <svg viewBox="0 0 200 200" className="w-full h-full rounded-2xl">
        <rect width="200" height="200" fill="#bae6fd" />
        <rect y="140" width="200" height="60" fill="#fff" />
        <circle cx="100" cy="130" r="25" fill="#fff" />
        <circle cx="100" cy="90" r="18" fill="#fff" />
        <circle cx="100" cy="60" r="14" fill="#fff" />
        <circle cx="95" cy="55" r="2" fill="#000" />
        <circle cx="105" cy="55" r="2" fill="#000" />
        <polygon points="100,60 115,65 100,65" fill="#f97316" />
        <rect x="85" y="40" width="30" height="10" fill="#1e293b" />
        <rect x="90" y="20" width="20" height="20" fill="#1e293b" />
        <polygon points="30,140 50,80 70,140" fill="#166534" />
      </svg>
    ),
    renderRight: () => (
      <svg viewBox="0 0 200 200" className="w-full h-full rounded-2xl">
        <rect width="200" height="200" fill="#bae6fd" />
        <rect y="140" width="200" height="60" fill="#fff" />
        <circle cx="100" cy="130" r="25" fill="#fff" />
        <circle cx="100" cy="90" r="18" fill="#fff" />
        <circle cx="100" cy="60" r="14" fill="#fff" />
        <circle cx="95" cy="55" r="2" fill="#000" />
        <circle cx="105" cy="55" r="2" fill="#000" />
        {/* Diff 1: Carrot nose points other way */}
        <polygon points="100,60 85,65 100,65" fill="#f97316" />
        {/* Diff 2: Hat is red */}
        <rect x="85" y="40" width="30" height="10" fill="#ef4444" />
        <rect x="90" y="20" width="20" height="20" fill="#ef4444" />
        {/* Diff 3: Tree is taller */}
        <polygon points="30,140 50,60 70,140" fill="#166534" />
      </svg>
    ),
    differences: [
      { id: 'nose', cx: 90, cy: 65, r: 15 },
      { id: 'hat', cx: 100, cy: 30, r: 25 },
      { id: 'tree', cx: 50, cy: 70, r: 20 },
    ]
  },
  {
    id: 'castle',
    renderLeft: () => (
      <svg viewBox="0 0 200 200" className="w-full h-full rounded-2xl">
        <rect width="200" height="200" fill="#7dd3fc" />
        <rect y="160" width="200" height="40" fill="#4ade80" />
        <rect x="60" y="80" width="80" height="80" fill="#94a3b8" />
        <rect x="50" y="60" width="30" height="100" fill="#64748b" />
        <rect x="120" y="60" width="30" height="100" fill="#64748b" />
        <polygon points="50,60 65,30 80,60" fill="#ef4444" />
        <polygon points="120,60 135,30 150,60" fill="#ef4444" />
        <rect x="85" y="120" width="30" height="40" fill="#475569" rx="15" />
        <circle cx="30" cy="40" r="15" fill="#fff" />
      </svg>
    ),
    renderRight: () => (
      <svg viewBox="0 0 200 200" className="w-full h-full rounded-2xl">
        <rect width="200" height="200" fill="#7dd3fc" />
        <rect y="160" width="200" height="40" fill="#4ade80" />
        <rect x="60" y="80" width="80" height="80" fill="#94a3b8" />
        <rect x="50" y="60" width="30" height="100" fill="#64748b" />
        <rect x="120" y="60" width="30" height="100" fill="#64748b" />
        {/* Diff 1: Left roof is blue */}
        <polygon points="50,60 65,30 80,60" fill="#3b82f6" />
        <polygon points="120,60 135,30 150,60" fill="#ef4444" />
        {/* Diff 2: Door is taller */}
        <rect x="85" y="100" width="30" height="60" fill="#475569" rx="15" />
        {/* Diff 3: Cloud moved right */}
        <circle cx="170" cy="40" r="15" fill="#fff" />
      </svg>
    ),
    differences: [
      { id: 'roof', cx: 65, cy: 45, r: 20 },
      { id: 'door', cx: 100, cy: 110, r: 15 },
      { id: 'cloud', cx: 170, cy: 40, r: 25 },
    ]
  },
  {
    id: 'undersea',
    renderLeft: () => (
      <svg viewBox="0 0 200 200" className="w-full h-full rounded-2xl">
        <rect width="200" height="200" fill="#0284c7" />
        <rect y="170" width="200" height="30" fill="#fcd34d" />
        <circle cx="100" cy="100" r="30" fill="#facc15" />
        <rect x="130" y="90" width="20" height="20" fill="#facc15" />
        <circle cx="110" cy="90" r="5" fill="#0ea5e9" />
        <path d="M 30 200 Q 40 150 30 120" stroke="#22c55e" strokeWidth="5" fill="none" />
        <path d="M 50 200 Q 60 160 50 140" stroke="#22c55e" strokeWidth="5" fill="none" />
        <circle cx="150" cy="50" r="4" fill="#fff" opacity="0.5" />
        <circle cx="160" cy="30" r="6" fill="#fff" opacity="0.5" />
      </svg>
    ),
    renderRight: () => (
      <svg viewBox="0 0 200 200" className="w-full h-full rounded-2xl">
        <rect width="200" height="200" fill="#0284c7" />
        <rect y="170" width="200" height="30" fill="#fcd34d" />
        {/* Diff 1: Submarine is orange */}
        <circle cx="100" cy="100" r="30" fill="#f97316" />
        <rect x="130" y="90" width="20" height="20" fill="#f97316" />
        <circle cx="110" cy="90" r="5" fill="#0ea5e9" />
        <path d="M 30 200 Q 40 150 30 120" stroke="#22c55e" strokeWidth="5" fill="none" />
        {/* Diff 2: Missing seaweed */}
        {/* Diff 3: Extra bubble */}
        <circle cx="150" cy="50" r="4" fill="#fff" opacity="0.5" />
        <circle cx="160" cy="30" r="6" fill="#fff" opacity="0.5" />
        <circle cx="140" cy="70" r="5" fill="#fff" opacity="0.5" />
      </svg>
    ),
    differences: [
      { id: 'sub', cx: 100, cy: 100, r: 35 },
      { id: 'seaweed', cx: 50, cy: 170, r: 20 },
      { id: 'bubble', cx: 140, cy: 70, r: 15 },
    ]
  },
  {
    id: 'park',
    renderLeft: () => (
      <svg viewBox="0 0 200 200" className="w-full h-full rounded-2xl">
        <rect width="200" height="200" fill="#bbf7d0" />
        <path d="M 0 100 Q 100 120 200 100 L 200 200 L 0 200 Z" fill="#86efac" />
        <rect x="40" y="120" width="60" height="10" fill="#b45309" />
        <rect x="45" y="130" width="5" height="20" fill="#78350f" />
        <rect x="90" y="130" width="5" height="20" fill="#78350f" />
        <circle cx="150" cy="140" r="30" fill="#3b82f6" />
        <circle cx="150" cy="140" r="20" fill="#60a5fa" />
        <polygon points="150,140 145,110 155,110" fill="#bfdbfe" />
        <circle cx="30" cy="40" r="20" fill="#fef08a" />
      </svg>
    ),
    renderRight: () => (
      <svg viewBox="0 0 200 200" className="w-full h-full rounded-2xl">
        <rect width="200" height="200" fill="#bbf7d0" />
        <path d="M 0 100 Q 100 120 200 100 L 200 200 L 0 200 Z" fill="#86efac" />
        <rect x="40" y="120" width="60" height="10" fill="#b45309" />
        <rect x="45" y="130" width="5" height="20" fill="#78350f" />
        {/* Diff 1: Missing bench leg */}
        <circle cx="150" cy="140" r="30" fill="#3b82f6" />
        <circle cx="150" cy="140" r="20" fill="#60a5fa" />
        {/* Diff 2: Fountain water is taller */}
        <polygon points="150,140 140,90 160,90" fill="#bfdbfe" />
        {/* Diff 3: Sun is orange */}
        <circle cx="30" cy="40" r="20" fill="#fb923c" />
      </svg>
    ),
    differences: [
      { id: 'leg', cx: 92, cy: 140, r: 15 },
      { id: 'water', cx: 150, cy: 100, r: 20 },
      { id: 'sun', cx: 30, cy: 40, r: 25 },
    ]
  }
];

export default function SpotTheDifference({ language, onComplete, onBack, onScore }: ActivityProps) {
  const [selectedLevelId, setSelectedLevelId] = useState<string | null>(null);
  const [levelIdx, setLevelIdx] = useState(0);
  const [found, setFound] = useState<string[]>([]);
  const t = TRANSLATIONS[language];

  const level = LEVELS[levelIdx];

  useEffect(() => {
    if (selectedLevelId) {
      playAudio(t.instruction, language);
    }
  }, [selectedLevelId, levelIdx, language, t.instruction]);

  const handleLevelSelect = (id: string) => {
    const idx = LEVELS.findIndex(l => l.id === id);
    setLevelIdx(idx);
    setSelectedLevelId(id);
    setFound([]);
  };

  const handleDiffClick = (id: string) => {
    if (found.includes(id)) return;
    
    const newFound = [...found, id];
    setFound(newFound);
    playAudio('Ding', 'en-IN');
    
    if (newFound.length === level.differences.length) {
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
      playAudio('You spotted them all!', 'en-IN');
      if (onScore) onScore(15);
      
      setTimeout(() => {
        setSelectedLevelId(null); // Go back to menu
      }, 3000);
    }
  };

  const handleMissClick = () => {
    playAudio('Boing', 'en-IN');
  };

  if (!selectedLevelId) {
    return (
      <div className="flex flex-col h-full">
        <ActivityHeader title={t.title} instruction="Select a level" language={language} onBack={onBack} />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl w-full">
            {LEVELS.map((l) => (
              <motion.button
                key={l.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleLevelSelect(l.id)}
                className="bg-white p-4 rounded-3xl shadow-xl border-4 border-rose-200 flex flex-col items-center gap-4 hover:border-rose-400 transition-colors"
              >
                <div className="w-full aspect-square rounded-2xl overflow-hidden pointer-events-none">
                  {l.renderLeft()}
                </div>
                <span className="font-bold text-rose-800 uppercase tracking-wider">{l.id}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <ActivityHeader title={t.title} instruction={t.instruction} language={language} onBack={() => setSelectedLevelId(null)} />
      
      <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-4 sm:gap-8 mt-4 p-4">
        
        {/* Left Image (Original) */}
        <div className="relative w-full max-w-sm aspect-square bg-white rounded-3xl shadow-lg border-4 border-slate-200">
          {level.renderLeft()}
        </div>

        {/* Right Image (Find differences here) */}
        <div 
          className="relative w-full max-w-sm aspect-square bg-white rounded-3xl shadow-lg border-4 border-rose-300 cursor-crosshair overflow-hidden"
          onClick={handleMissClick}
        >
          {level.renderRight()}
          
          {/* Clickable areas for differences */}
          <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full pointer-events-none">
            {level.differences.map(diff => (
              <g key={diff.id} className="pointer-events-auto">
                <circle
                  cx={diff.cx}
                  cy={diff.cy}
                  r={diff.r}
                  fill="transparent"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDiffClick(diff.id);
                  }}
                />
                <AnimatePresence>
                  {found.includes(diff.id) && (
                    <motion.circle
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      cx={diff.cx}
                      cy={diff.cy}
                      r={diff.r}
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="6"
                      strokeDasharray="8 4"
                      className="pointer-events-none"
                    />
                  )}
                </AnimatePresence>
              </g>
            ))}
          </svg>
        </div>

      </div>

      {/* Progress indicator */}
      <div className="flex justify-center gap-4 pb-8">
        {level.differences.map((diff, i) => (
          <div 
            key={i} 
            className={`w-8 h-8 rounded-full border-4 flex items-center justify-center transition-colors ${found.includes(diff.id) ? 'bg-rose-500 border-rose-500 text-white' : 'border-slate-300'}`}
          >
            {found.includes(diff.id) && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}>✓</motion.span>}
          </div>
        ))}
      </div>
    </div>
  );
}
