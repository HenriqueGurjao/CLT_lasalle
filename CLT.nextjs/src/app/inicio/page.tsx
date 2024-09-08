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
import React from "react";
import { Badge } from "@/components/ui/badge";

export const LoggedMenu = () => {
  return (
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
  );
};

const ListTccMenu = () => {
  return (
    <section className="w-full flex">
      <div className="flex w-full gap-2">
        <Input
          className="w-72"
          placeholder="Buscar TCC"
        />
      </div>
    </section>
  );
};

const labels = [
  "feature",
  "bug",
  "enhancement",
  "documentation",
  "design",
  "question",
  "maintenance",
];
const cursos = [
  "Sistemas de Informação",
  "Arquitetura",
  "Engenharia de Software",
  "Ciência da Computação",
  "Engenharia de Computação",
  "Engenharia de Produção",
  "Engenharia Mecânica",
  "Engenharia Civil",
  "Engenharia Elétrica",
  "Engenharia Química",
  "Engenharia de Alimentos",
  "Engenharia Ambiental",
];

const startPeriod = 2000;
const years = Array.from(
  { length: new Date().getFullYear() - startPeriod + 1 },
  (_, i) => i + startPeriod
);

export default function Home() {
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
              options={labels}
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
}

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
