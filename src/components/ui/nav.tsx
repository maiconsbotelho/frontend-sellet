"use client";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import React from "react";

export default function Nav() {
  const router = useRouter();
  const path = usePathname();
  return (
    <div className="w-screen fixed left-0 bottom-0 pt-4 pb-12 px-4 bg-[rgba(255,255,255,.6)] backdrop-blur-sm tracking-tighter">
      <div className="w-full grid grid-cols-[1fr_1fr_1fr] relative text-xs text-[#9E9E9E]">
        <div
          onClick={() => router.push("/admin")}
          className="grid justify-center justify-items-center content-end gap-1"
        >
          <Image src={`/ui/home${path == "/favorita" ? "-selected" : ""}.svg`} width={28} height={28} alt="Início" />
          <p className={`text-center ${path == "/favorita" ? "text-principal" : ""}`}>Início</p>
        </div>
        <div
          onClick={() => router.push("/admin/cliente")}
          className="grid justify-center justify-items-center content-end gap-1"
        >
          <Image src={`/ui/ranking${path == "/ranking" ? "-selected" : ""}.svg`} width={28} height={24} alt="Ranking" />
          <p className={`text-center ${path == "/ranking" ? "text-principal" : ""}`}>Ranking</p>
        </div>
        <div onClick={() => router.push("/")} className="grid justify-center justify-items-center content-end gap-1">
          <Image src={`/ui/lucros${path == "/lucros" ? "-selected" : ""}.svg`} width={26} height={28} alt="Lucros" />
          <p className={`text-center ${path == "/lucros" ? "text-principal" : ""}`}>Lucros</p>
        </div>
      </div>
    </div>
  );
}
