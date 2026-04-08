import { Language } from '../types';

export let isMuted = false;

export const toggleMute = () => {
  isMuted = !isMuted;
  if (isMuted && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
  return isMuted;
};

export const playAudio = (text: string, lang: Language) => {
  if (isMuted || !window.speechSynthesis) return;
  
  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  
  const voices = window.speechSynthesis.getVoices();
  const langVoices = voices.filter(v => v.lang.startsWith(lang.split('-')[0]));
  
  // Try to find a high-quality, natural female voice
  const femaleVoice = langVoices.find(v => {
    const name = v.name.toLowerCase();
    return name.includes('natural') ||
           name.includes('premium') ||
           name.includes('samantha') || 
           name.includes('victoria') ||
           name.includes('zira') ||
           name.includes('aria') ||
           name.includes('jenny') ||
           name.includes('swara') ||
           name.includes('dhwani') ||
           name.includes('veena') ||
           name.includes('lekha') ||
           (name.includes('google') && name.includes('female'));
  });

  if (femaleVoice) {
    utterance.voice = femaleVoice;
  } else if (langVoices.length > 0) {
    // Fallback: often the second voice is female if the first is male
    const googleVoice = langVoices.find(v => v.name.includes('Google'));
    utterance.voice = googleVoice || (langVoices.length > 1 ? langVoices[1] : langVoices[0]);
  }

  utterance.rate = 0.9; // Slightly slower for kids, but not too slow to sound robotic
  utterance.pitch = 1.2; // Slightly higher pitch for a friendly tone, but not squeaky

  window.speechSynthesis.speak(utterance);
};
