"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Banner from "/public/img/hero-banner.png";

export default function HeroBanner() {
  const [isMounted, setIsMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);

    // Verifica o token apenas no cliente
    const token = localStorage.getItem("token");
    setIsLoggedIn(Boolean(token));
  }, []);

  const handleScheduleClick = () => {
    if (!isMounted) return;

    if (isLoggedIn) {
      router.push("/agendamento");
    } else {
      router.push("/login");
    }
  };

  return (
    <div className="relative h-[336px] sm:h-full">
      <Image src={Banner} alt="Hero Banner" className="w-full h-full sm:h-auto object-cover" />
      <button
        onClick={handleScheduleClick}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[var(--bg-primary)] text-[var(--text-secondary)] px-6 py-3 rounded-lg shadow-lg hover:bg-[#380c18]"
      >
        Agendar Agora
      </button>
    </div>
  );
}
