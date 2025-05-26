"use client"

import { useAuth } from "@/contexts/AuthProvider";
import { CircleNotch } from "phosphor-react";
import { useEffect, useState } from "react";

export default function Home() {

  const { loading, user } = useAuth();

  useEffect(() => {
    console.log(user)
    if (!loading) {
      // Redirect to the dashboard or another page after loading
      window.location.href = "/inicio";
    }
  }, [user])

  return (
    <div className="h-full w-full flex items-center justify-center">
      <CircleNotch className="text-yellow-500 size-10 animate-spin" />
    </div>
  );
}
