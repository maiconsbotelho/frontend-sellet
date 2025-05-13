'use client';

import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation'; // No longer needed
import Image from 'next/image';
import clsx from 'clsx';
import SplashImage from '@/../public/splash.png';

interface SplashProps {
  onComplete: () => void;
}

// ...existing code...
export default function Splash({ onComplete }: SplashProps) {
  const [fadeOut, setFadeOut] = useState(false);
  // const router = useRouter(); // No longer needed
  // const [visible, setVisible] = useState(true); // No longer needed

  useEffect(() => {
    const initialDelayTimer = setTimeout(() => {
      setFadeOut(true); // Trigger fade-out animation

      // Wait for the fade-out animation (2000ms) to complete
      const animationCompleteTimer = setTimeout(() => {
        onComplete();
      }, 1000); // This duration should match your CSS transition duration (duration-2000)

      return () => clearTimeout(animationCompleteTimer);
    }, 2000); // Initial delay before fade-out starts

    return () => {
      clearTimeout(initialDelayTimer);
    };
  }, [onComplete]);

  // if (!visible) return null; // No longer needed, parent will unmount

  return (
    <div
      className={clsx(
        'h-screen w-full flex flex-col items-center justify-center bg-gradient-to-b from-pink-100 to-pink-200 text-center px-6 transition-opacity duration-1000 ease-in-out',
        fadeOut ? 'opacity-0' : 'opacity-100'
      )}
    >
      {/* ...existing code... */}
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
