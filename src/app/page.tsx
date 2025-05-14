import LandingPage from '@/components/landing/landingPage';
import SplashScreenManager from '@/components/landing/splashScreen/SplashScreenManager';

export default function Home() {
  return (
    <SplashScreenManager>
      <LandingPage />
    </SplashScreenManager>
  );
}
