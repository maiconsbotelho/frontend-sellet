'use client';

import { useEffect, useState } from 'react';
import LandingPage from '@/components/landing/landingPage';
import Splash from '@/components/landing/splash';

export default function Home() {
  const [showSplashComponent, setShowSplashComponent] = useState(true);
  const [showHomeComponent, setShowHomeComponent] = useState(false);

  useEffect(() => {
    const alreadyShown = sessionStorage.getItem('splashShown');

    if (alreadyShown) {
      setShowSplashComponent(false);
      setShowHomeComponent(true); // Show home immediately if splash was already shown
    } else {
      sessionStorage.setItem('splashShown', 'true');
    }
  }, []);

  const handleSplashComplete = () => {
    setShowSplashComponent(false);
    setShowHomeComponent(true); // Trigger home component to show (and fade in)
  };

  return (
    <>
      {showSplashComponent && <Splash onComplete={handleSplashComplete} />}
      {showHomeComponent && (
        <div className="animate-fade-in-slow">
          {' '}
          {/* Add your fade-in animation class here */}
          <LandingPage />
        </div>
      )}
    </>
  );
}
