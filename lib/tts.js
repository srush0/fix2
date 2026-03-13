// lib/tts.js — Text-to-Speech Utility for Fixoo

export const LANG_LOCALE_MAP = {
  en: 'en-IN',
  hi: 'hi-IN',
  mr: 'mr-IN',
  ta: 'ta-IN',
  bn: 'bn-IN',
};

let currentUtterance = null;

export function isSupported() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

export function speak(text, langCode = 'en', options = {}) {
  if (!isSupported() || !text) return;

  // Cancel any ongoing speech
  stopSpeaking();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = LANG_LOCALE_MAP[langCode] || 'en-IN';
  utterance.rate = options.rate || 0.9;
  utterance.pitch = options.pitch || 1.0;
  utterance.volume = options.volume || 1.0;

  // Try to find a matching voice
  const voices = window.speechSynthesis.getVoices();
  const locale = utterance.lang;
  const matchedVoice = voices.find(
    (v) => v.lang === locale || v.lang.startsWith(locale.split('-')[0])
  );
  if (matchedVoice) {
    utterance.voice = matchedVoice;
  }

  currentUtterance = utterance;
  window.speechSynthesis.speak(utterance);

  return new Promise((resolve, reject) => {
    utterance.onend = resolve;
    utterance.onerror = reject;
  });
}

export function stopSpeaking() {
  if (!isSupported()) return;
  window.speechSynthesis.cancel();
  currentUtterance = null;
}

export function isSpeaking() {
  if (!isSupported()) return false;
  return window.speechSynthesis.speaking;
}

// Preload voices (required in some browsers)
export function loadVoices() {
  if (!isSupported()) return;
  window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    window.speechSynthesis.getVoices();
  };
}
