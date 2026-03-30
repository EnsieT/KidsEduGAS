export type Language = 'en-IN' | 'hi-IN' | 'gu-IN';

export interface ActivityProps {
  language: Language;
  onComplete: () => void;
  onBack: () => void;
}
