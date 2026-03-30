import { Language } from '../types';

export const playAudio = (text: string, lang: Language) => {
  if (!window.speechSynthesis) return;
  
  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  
  // Try to find a good voice for the language
  const voices = window.speechSynthesis.getVoices();
  const langVoices = voices.filter(v => v.lang.startsWith(lang.split('-')[0]));
  if (langVoices.length > 0) {
    utterance.voice = langVoices[0];
  }

  utterance.rate = 0.9; // Slightly slower for kids
  utterance.pitch = 1.2; // Slightly higher pitch for a friendly tone

  window.speechSynthesis.speak(utterance);
};
