"use client";

import { usePathname } from "next/navigation";
import { AvatarMenu } from "./AvatarMenu";
import Link from "next/link";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { MagnifyingGlass } from "phosphor-react";

export const Header = () => {
  const path = usePathname();
  return (
    <header className="w-full border-b  dark:bg-slate-950 h-14 flex items-center border-white">
      <div className="pr-3 sm:pr-14 w-full flex justify-between items-center">
        <h1 className="text-3xl font-bold text-yellow-400 dark:text-white px-6">
          CLT(Logo)
        </h1>
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
              <div className="flex items-center gap-2">
                <Input
                  className="h-8"
                  placeholder="Campo de buscas"
                />
                <Button
                  variant={"outline"}
                  className="p-0 flex rounded-full w-12"
                >
                  <MagnifyingGlass size={16} className="" />
                </Button>
              </div>
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
