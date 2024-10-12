"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDownIcon, CopyIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { FunnelSimple } from "phosphor-react";
import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ProjetoFinal } from "./filters.dtypes";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthProvider";
import fetchWithAuth from "@/utils/fetchWithAuth";
import { Filters } from "./Filter";
import { ListTccs } from "./ListarTccs";

const startPeriod = 2000;
const years = Array.from(
  { length: new Date().getFullYear() - startPeriod + 1 },
  (_, i) => i + startPeriod
);

export default function Home() {
  return (
    <div>
      <section>
        <Filters />
      </section>
      <section className="">
        <ListTccs />
      </section>
    </div>
  );
}




