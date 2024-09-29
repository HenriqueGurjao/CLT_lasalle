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
import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { tags, moreTccs, ProjetoFinal } from "./filters.dtypes";
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
import { useAuth } from "@/contexts/AuthProvider";
import fetchWithAuth from "@/utils/fetchWithAuth";

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

interface FilterProps {
  nome: string;
  id: number;
}

const Filters = () => {
  const [selectedTags, setSelectedTags] = React.useState<FilterProps[]>([]);
  const [selectedCursos, setSelectedCursos] = React.useState<FilterProps[]>([]);
  const [selectedPeriods, setSelectedPeriods] = React.useState<FilterProps[]>([]);
  const [cursos, setCursos] = React.useState<FilterProps[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchWithAuth("http://localhost:8000/api/v1/cursos/resumido");

        // Atualize seu estado de cursos, se necessário
        const data = await response?.json();
        setCursos(data); 
      } catch (error) {
        console.error("Error fetching cursos:", error);
      }
    };

    fetchData();
  }, []);

  const handleRemoveFilter = (
    filter: FilterProps,
    type: "tag" | "curso" | "year"
  ) => {
    if (type === "tag") {
      setSelectedTags((tags) => tags.filter((t) => t.id !== filter.id));
    } else if (type === "year") {
      setSelectedPeriods((periods) => periods.filter((p) => p.id !== filter.id)); // Supondo que os períodos também são FilterProps
    } else {
      setSelectedCursos((cursos) => cursos.filter((c) => c.id !== filter.id));
    }
  };

  return (
    <div className="w-full h-full relative">
      <div className="flex relative w-full">
        <span className="absolute z-10 text-xs bg-zinc-100 dark:bg-gray-900 left-2 top-[-10px] px-2">
          Filtros
        </span>
        <ul className="flex gap-1 border p-1 w-full min-h-10 flex-wrap">
          {[...selectedTags, ...selectedCursos, ...selectedPeriods].map((filter) => (
            <li key={filter.id} className="relative select-none">
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
                {filter.nome} {/* Usando a propriedade 'nome' do FilterProps */}
              </Badge>
            </li>
          ))}
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
            {/* <DropdownFilterGroup
              label={"Tags"}
              options={tags} // Certifique-se de que 'tags' é um array de FilterProps
              selected={selectedTags}
              setSelected={setSelectedTags}
            /> */}
            <DropdownFilterGroup
              label={"Cursos"}
              options={cursos} // Certifique-se de que 'cursos' é um array de FilterProps
              selected={selectedCursos}
              setSelected={setSelectedCursos}
            />
            <DropdownFilterGroup
              label="Ano"
              options={years.toReversed().map((year) => ({ nome: year.toString(), id: year }))} // Atualize para usar FilterProps
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
  options: FilterProps[]; 
  selected: FilterProps[];
  setSelected: React.Dispatch<React.SetStateAction<FilterProps[]>>;
}

const DropdownFilterGroup = ({
  label,
  options,
  selected,
  setSelected,
}: DropdownFilterGroupProps) => {
  const handleSelect = (option: FilterProps) => {
    setSelected((prev) => {
      const isAlreadySelected = prev.some((item) => item.id === option.id);
      if (!isAlreadySelected) {
        return [...prev, option];
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
                    .filter((option) => !selected.some((selectedOption) => selectedOption.id === option.id))
                    .map((option) => (
                      <CommandItem
                        key={option.id} // Use o ID para a chave
                        value={option.nome} // Use o nome ou outro identificador relevante
                        onSelect={() => handleSelect(option)} // Passe o objeto FilterProps
                      >
                        {option.nome} {/* Renderize o nome ou outro atributo relevante */}
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
  const [projetos, setProjetos] = useState<ProjetoFinal[] | null>(null);

  const { user } = useAuth();

  const handleFlip = (index: number) => {
    setFlipped(flipped === index ? null : index);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchWithAuth("http://localhost:8000/api/v1/projetos");
        const data = await response?.json();

        setProjetos(data);
      } catch (error) {
        console.error("Error fetching tccs:", error);
      }
    }
    
    fetchData();
  }, [])

  return (
    <ul className="border p-4 grid grid-cols-4 gap-2">
      {projetos ? projetos.map((tcc, index) => (
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
      )) : (
        <div>
          carregando
        </div>
      )}
    </ul>
  );
};
