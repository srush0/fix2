'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Wrench } from 'lucide-react';

export default function SplashPage() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => router.push('/landing'), 500);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [router]);

  return (
    <div className="min-h-screen fixoo-gradient flex flex-col items-center justify-center">
      <div className="text-center space-y-8 animate-float">
        <div className="w-24 h-24 bg-white rounded-3xl shadow-2xl flex items-center justify-center mx-auto">
          <Wrench className="w-14 h-14 text-[#2D4FE0]" />
        </div>

        <div>
          <h1 className="text-5xl font-bold text-white mb-3">Fixoo</h1>
          <p className="text-xl text-white/90 font-medium">Your Local Problem Solver</p>
        </div>

        <div className="w-64 h-2 bg-white/30 rounded-full overflow-hidden mx-auto">
          <div
            className="h-full bg-white rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className="absolute bottom-10 text-white/70 text-sm">
        <p>Connecting you with trusted local services</p>
      </div>
    </div>
  );
}
