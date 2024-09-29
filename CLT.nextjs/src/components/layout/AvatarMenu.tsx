"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { DoorClosed, HomeIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar } from "@radix-ui/react-avatar";
import { AvatarFallback, AvatarImage } from "../ui/avatar";
import { Switch } from "../ui/switch";
import { useMenuItems } from "./useSideMenuItems";
import fetchWithAuth from "@/utils/fetchWithAuth";

export function AvatarMenu() {
  const { setTheme, theme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full overflow-hidden"
        >
          <Avatar>
            <AvatarImage
              src="https://github.com/MatheusSouSoa.png"
              alt="@MatheusSouSoa"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56"
        align="end"
      >
        <DropdownMenuItem>Perfil</DropdownMenuItem>
        <DropdownMenuItem>Configurações</DropdownMenuItem>
        <DropdownMenuItem className="w-full  flex justify-between">
          Modo escuro
          <Switch
            checked={theme == "dark"}
            onCheckedChange={toggleTheme}
          />
        </DropdownMenuItem>
        <DropdownMenuItem className="flex justify-between" onClick={async () => {
          const response = await fetchWithAuth("http://localhost:8000/api/v1/auth/logout", {
            method: "POST",
            credentials: "include"
          })

          if (response && response.ok) {
            window.location.href = "/";
            localStorage.removeItem("matricula");
          }
        }}>
          <span>Sair</span>
          <DoorClosed className="text-zinc-400"/>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
