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
import { Input } from "@/components/ui/input";
import { ChevronDownIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { FunnelSimple } from "phosphor-react";
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { cursos, tags, moreTccs } from "./filters.dtypes";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { usePathname } from "next/navigation";

export const LoggedMenu = () => {
  const path = usePathname();

  return (
    <>
      {
        (path != "/auth" && path != "/" && (
          <div className="w-ful border p-2">
            <ul className="flex gap-3">
              <li>
                <Link
                  className="hover:underline"
                  href={"/meus-tcc"}
                >
                  Meus TCC
                </Link>
              </li>
              <li>
                <Link
                  className="hover:underline"
                  href={"/meus-tcc"}
                >
                  Catalogo
                </Link>
              </li>
            </ul>
          </div>
        ))}
    </>
  );
};

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

const Filters = () => {
  const [selectedTags, setSelectedTags] = React.useState<string[]>([]);
  const [selectedCursos, setSelectedCursos] = React.useState<string[]>([]);
  const [selectedPeriods, setSelectedPeriods] = React.useState<string[]>([]);

  const handleRemoveFilter = (
    filter: string,
    type: "tag" | "curso" | "year"
  ) => {
    if (type === "tag") {
      setSelectedTags((tags) => tags.filter((t) => t !== filter));
    } else if (type === "year") {
      setSelectedPeriods((periods) => periods.filter((p) => p !== filter));
    } else {
      setSelectedCursos((cursos) => cursos.filter((c) => c !== filter));
    }
  };
  return (
    <div className="w-full h-full relative">
      <div className="flex relative w-full">
        <span className="absolute z-10 text-xs bg-zinc-100 dark:bg-gray-900 left-2 top-[-10px] px-2">
          Filtros
        </span>
        <ul className="flex gap-1 border p-1 w-full min-h-10 flex-wrap">
          {[...selectedTags, ...selectedCursos, ...selectedPeriods].map(
            (filter) => (
              <li
                key={filter}
                className="relative select-none"
              >
                <Button
                  onClick={() =>
                    handleRemoveFilter(
                      filter,
                      selectedTags.includes(filter)
                        ? "tag"
                        : selectedCursos.includes(filter)
                        ? "curso"
                        : "year"
                    )
                  }
                  className="absolute w-3 h-3 p-0 right-0 bg-yellow-500 hover:bg-yellow-700"
                >
                  <XIcon size={10} />
                </Button>
                <Badge className="bg-blue-900 hover:bg-blue-800 whitespace-nowrap">
                  {filter}
                </Badge>
              </li>
            )
          )}
        </ul>
      </div>
      <div className="absolute right-0 top-0">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"outline"}>
              <FunnelSimple />
              <ChevronDownIcon size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>
              <span>Filtros</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownFilterGroup
              label={"Tags"}
              options={tags}
              selected={selectedTags}
              setSelected={setSelectedTags}
            />
            <DropdownFilterGroup
              label={"Cursos"}
              options={cursos}
              selected={selectedCursos}
              setSelected={setSelectedCursos}
            />
            <DropdownFilterGroup
              label="Ano"
              options={years.toReversed().map((year) => year.toString())}
              selected={selectedPeriods}
              setSelected={setSelectedPeriods}
            />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

interface DropdownFilterGroupProps {
  label: string;
  options: string[];
  selected: string[];
  setSelected: React.Dispatch<React.SetStateAction<string[]>>;
}

const DropdownFilterGroup = ({
  label,
  options,
  selected,
  setSelected,
}: DropdownFilterGroupProps) => {
  const handleSelect = (value: string) => {
    // ts-ignore
    setSelected((prev: string[]) => {
      const isAlreadySelected = prev.includes(value);
      if (!isAlreadySelected) {
        return [...prev, value];
      }
      return prev;
    });
  };

  return (
    <DropdownMenuGroup>
      <DropdownMenuSub>
        <DropdownMenuSubTrigger>{label}</DropdownMenuSubTrigger>
        <DropdownMenuPortal>
          <DropdownMenuSubContent>
            <Command>
              <CommandInput
                placeholder={`Selecionar ${label.toLowerCase()}...`}
                autoFocus={true}
                className="h-9"
              />
              <CommandList className="max-h-56">
                <CommandEmpty>Sem resultados.</CommandEmpty>
                <CommandGroup>
                  {options
                    .filter((option) => !selected.includes(option))
                    .map((option) => (
                      <CommandItem
                        key={option}
                        value={option}
                        onSelect={() => handleSelect(option)}
                      >
                        {option}
                      </CommandItem>
                    ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </DropdownMenuSubContent>
        </DropdownMenuPortal>
      </DropdownMenuSub>
    </DropdownMenuGroup>
  );
};

const ListTccs = () => {
  const [flipped, setFlipped] = useState<number | null>(null);

  const handleFlip = (index: number) => {
    setFlipped(flipped === index ? null : index);
  };

  return (
    <ul className="border p-4 grid grid-cols-4 gap-2">
      {moreTccs.map((tcc, index) => (
        <li key={index}>
          <Card className="min-h-full flex flex-col justify-between pb-2 ">
            <CardHeader className="h-28 overflow-y-auto">
              <CardTitle>{tcc.titulo}</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center bg-[url('/Untitled.jpg')] h-72 bg-cover bg-center border">
            </CardContent>
            <CardFooter className="flex items-center justify-center gap-2 pt-5">
              <Button>Download</Button>
              <Button>Informações</Button>
            </CardFooter>
            {/* <CardFooter className="overflow-x-auto max-h-20 p-4">
              <ul>
                <li>
                  <span className="font-bold">Ano:</span>
                  {tcc.ano}
                </li>
                <li>
                  <span className="font-bold">Curso:</span>
                  {tcc.curso}
                </li>
                <li className="overflow-x-auto">
                  <span className="font-bold">Tags:</span>
                  {tcc.tags.map((tag, index) => (
                    <Badge key={index} className="ml-2">
                      {tag}
                    </Badge>
                  ))}
                </li>
              </ul>
            </CardFooter> */}
          </Card>
        </li>
      ))}
    </ul>
  );
};
