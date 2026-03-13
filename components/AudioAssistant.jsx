'use client';

import { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Mic, X } from 'lucide-react';
import { speak, stopSpeaking, isSpeaking, loadVoices, isSupported } from '@/lib/tts';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';

const TIPS = {
  en: [
    'Welcome to Fixoo! Your local service marketplace.',
    'Book electricians, plumbers, and more in seconds.',
    'Track your service provider in real time.',
    'Emergency services available 24/7.',
    'Rate your provider after every service.',
  ],
  hi: [
    'Fixoo में आपका स्वागत है! आपका स्थानीय सेवा बाज़ार।',
    'इलेक्ट्रीशियन, प्लम्बर और अधिक सेवाएं बुक करें।',
    'अपने सेवा प्रदाता को रियल टाइम में ट्रैक करें।',
    'आपातकालीन सेवाएं 24/7 उपलब्ध हैं।',
  ],
  mr: [
    'Fixoo मध्ये आपले स्वागत आहे! तुमचे स्थानिक सेवा बाज़ार.',
    'इलेक्ट्रिशियन, प्लंबर आणि बरेच काही बुक करा.',
    'आपत्कालीन सेवा 24/7 उपलब्ध आहे.',
  ],
  ta: [
    'Fixoo க்கு வரவேற்கிறோம்! உங்கள் உள்ளூர் சேவை சந்தை.',
    'எலக்ட்ரீஷியன், பம்பர் மற்றும் பலவற்றை புக் செய்யுங்கள்.',
  ],
  bn: [
    'Fixoo তে স্বাগতম! আপনার স্থানীয় সেবা বাজার।',
    'ইলেকট্রিশিয়ান, প্লাম্বার এবং আরও অনেক কিছু বুক করুন।',
  ],
};

export default function AudioAssistant() {
  const [active, setSpeakingActive] = useState(false);
  const [tipIndex, setTipIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const [supported, setSupported] = useState(false);
  const { lang, t } = useLanguage();
  const { user } = useAuth();
  const intervalRef = useRef(null);

  useEffect(() => {
    setSupported(isSupported());
    loadVoices();
  }, []);

  const tips = TIPS[lang] || TIPS['en'];

  const startSpeaking = () => {
    if (!supported) return;
    setSpeakingActive(true);
    const text = tips[tipIndex % tips.length];
    speak(text, lang).then(() => {
      setSpeakingActive(false);
    }).catch(() => setSpeakingActive(false));
    setTipIndex((prev) => (prev + 1) % tips.length);
  };

  const stopAll = () => {
    stopSpeaking();
    setSpeakingActive(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const speakWelcome = () => {
    if (!supported) return;
    const greeting = user
      ? `${t('welcomeBack')} ${user.name}! ${tips[0]}`
      : tips[0];
    setSpeakingActive(true);
    speak(greeting, lang).then(() => setSpeakingActive(false)).catch(() => setSpeakingActive(false));
  };

  if (!supported) return null;

  return (
    <div className="fixed bottom-24 right-5 z-50 flex flex-col items-end space-y-2">
      {/* Expanded panel */}
      {open && (
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-72 p-5 mb-2 animate-fadeIn">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 fixoo-gradient rounded-lg flex items-center justify-center">
                <Mic className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-semibold text-[#111827] text-sm">Audio Assistant</h3>
            </div>
            <button onClick={() => { setOpen(false); stopAll(); }} className="text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-gray-500 mb-4">
            {tips[tipIndex % tips.length]}
          </p>

          <div className="flex space-x-2">
            <button
              onClick={active ? stopAll : startSpeaking}
              className={`flex-1 flex items-center justify-center space-x-2 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? 'bg-red-50 text-red-600 border border-red-200'
                  : 'bg-gradient-to-r from-[#2D4FE0] to-[#8C3CFF] text-white shadow-md hover:shadow-lg'
              }`}
            >
              {active ? (
                <>
                  <VolumeX className="w-4 h-4" />
                  <span>Stop</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4" />
                  <span>Play Tip</span>
                </>
              )}
            </button>

            <button
              onClick={speakWelcome}
              className="px-3 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm text-gray-600 transition"
            >
              👋
            </button>
          </div>

          {active && (
            <div className="mt-3 flex items-center space-x-1">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-1.5 bg-[#2D4FE0] rounded-full animate-bounce"
                  style={{ height: `${8 + i * 4}px`, animationDelay: `${i * 0.1}s` }}
                />
              ))}
              <span className="text-xs text-gray-500 ml-2">Speaking...</span>
            </div>
          )}
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        className={`w-14 h-14 rounded-2xl shadow-xl flex items-center justify-center transition-all hover:scale-110 ${
          active
            ? 'bg-red-500 animate-pulse'
            : 'bg-gradient-to-br from-[#2D4FE0] to-[#8C3CFF]'
        }`}
      >
        {active ? (
          <Volume2 className="w-6 h-6 text-white" />
        ) : (
          <Mic className="w-6 h-6 text-white" />
        )}
      </button>
    </div>
  );
}
