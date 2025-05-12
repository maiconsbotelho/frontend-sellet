'use client';

import { useEffect, useState } from 'react';
import Home2 from '@/components/home/home';
import Splash from '@/components/home/splash';

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const alreadyShown = sessionStorage.getItem('splashShown');

    if (alreadyShown) {
      setShowSplash(false);
    } else {
      sessionStorage.setItem('splashShown', 'true');
      const timer = setTimeout(() => setShowSplash(false), 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  if (showSplash) return <Splash />;

  return <Home2 />;
}
