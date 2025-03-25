"use client"

import { useAuth } from "@/contexts/AuthProvider";
import { CircleNotch } from "phosphor-react";
import { useState } from "react";

export default function Home() {

  const { loading } = useAuth();

  if (loading) {
    <div className="h-full w-full flex items-center justify-center">
      <CircleNotch className="text-yellow-500 size-10 animate-spin" />
    </div>;
  }

  return (
    <main className="flex flex-col gap-2">
      <section id="#QuemSomos" className="bg-cyan-800 w-full h-96 rounded-br-[150px]">
        oi
      </section>
      <section id="#QuemSomos" className="bg-blue-200 w-full h-96 rounded-tr-[150px]">
        oi
      </section>
    </main>
  );
}
