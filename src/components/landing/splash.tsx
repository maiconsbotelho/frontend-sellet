'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import SplashImage from '@/../public/splash.png';

interface SplashProps {
  onComplete: () => void;
}

export default function Splash({ onComplete }: SplashProps) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const initialDelayTimer = setTimeout(() => {
      setFadeOut(true);

      const animationCompleteTimer = setTimeout(() => {
        onComplete();
      }, 1000);

      return () => clearTimeout(animationCompleteTimer);
    }, 2000);

    return () => {
      clearTimeout(initialDelayTimer);
    };
  }, [onComplete]);

  return (
    <div
      className={clsx(
        'h-screen w-full flex flex-col items-center justify-center bg-gradient-to-b from-pink-100 to-pink-200 text-center px-6 transition-opacity duration-1000 ease-in-out',
        fadeOut ? 'opacity-0' : 'opacity-100'
      )}
    >
      <Image
        src={SplashImage}
        alt="Esmalteria"
        fill
        className="object-cover animate-fade-in"
        priority
      />
    </div>
  );
}
