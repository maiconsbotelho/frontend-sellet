// filepath: /home/maiconbotelho/crisdulabs/workspace/projetos-pessoais/sellet/frontend-sellet/src/components/layout/SplashScreenManager.tsx
'use client';

import { useEffect, useState, ReactNode } from 'react';
import Splash from '@/components/landing/splashScreen/splash';

interface SplashScreenManagerProps {
  children: ReactNode;
}

export default function SplashScreenManager({
  children,
}: SplashScreenManagerProps) {
  const [showSplash, setShowSplash] = useState(true);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const alreadyShown = sessionStorage.getItem('splashShown');

    if (alreadyShown) {
      setShowSplash(false);
      setShowContent(true);
    } else {
      sessionStorage.setItem('splashShown', 'true');
      // O componente Splash chamará onComplete
    }
  }, []);

  const handleSplashComplete = () => {
    setShowSplash(false);
    setShowContent(true);
  };

  return (
    <>
      {showSplash && <Splash onComplete={handleSplashComplete} />}
      {showContent && <div className="animate-fade-in-slow">{children}</div>}
    </>
  );
}
