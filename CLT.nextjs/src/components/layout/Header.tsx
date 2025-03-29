"use client";

import { usePathname, useRouter } from "next/navigation";
import { AvatarMenu } from "./AvatarMenu";
import Link from "next/link";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { MagnifyingGlass } from "phosphor-react";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthProvider";
import fetchWithAuth from "@/utils/fetchWithAuth";
import Image from "next/image";

export const Header = () => {
  const path = usePathname();
  const { setUser } = useAuth();

  const matriculaLocalStorage = localStorage.getItem("matricula");

  useEffect(() => {
    const fetchData = async () => {

      const redirectUrl = matriculaLocalStorage == '00500500' ? 'professor' : matriculaLocalStorage?.startsWith('005') ? 'aluno' : 'aluno';
      const endpoint = `http://localhost:8000/api/v1/${redirectUrl}/${matriculaLocalStorage}`
      if (path === "/" || path === "/auth") return;
      try {
        const response  = await fetchWithAuth (endpoint, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        })

        const data = await response?.json();
       
        setUser(data);
      } catch (error) {
        console.error("Fetch failed:", error);
      }

    }

    fetchData();
  }, [matriculaLocalStorage, path, setUser]);

  return (
    <header className="w-full border-b  dark:bg-slate-950 h-14 flex items-center border-white bg-gray-200 overflow-hidden pl-6">
      <div className="pr-3 sm:pr-14 w-full flex justify-between items-center">
        <a href="http://localhost:3000" className="text-3xl font-bold text-yellow-400 dark:text-white">
          <Image
            src="/imagem/logo/Central Lasalle de TCCs/WordPress/wordpress_logo_transparent_512x512.png"
            alt="imagem tela de login" 
            width={300}   
            height={300} 
          />
        </a>
        {/* <ul>
          <li className=" flex gap-5 font-bold">
            <Link
              href={"/#QuemSomos"}
              className="text-zinc-700 hover:text-yellow-500 hover:underline"
            >
              Quem somos?
            </Link>
            <Link
              href={"/#Qualidade"}
              className="text-zinc-700 hover:text-yellow-500 hover:underline"
            >
              Ver Projetos
            </Link>
          </li>
        </ul> */}
        <div>
          {path != "/auth" && path != "/" ? (
            <div className="flex gap-2 items-center">
              <div>
                <AvatarMenu />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 h-full">
              <Link
                href="/auth"
                className="hover:underline bg-blue-500 text-white px-3 py-1 rounded-md"
              >
                Acessar
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
