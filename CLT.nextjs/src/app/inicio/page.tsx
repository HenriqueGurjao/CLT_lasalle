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
import { FilterProps, Filters } from "./Filter";
import { ListTccs } from "./ListarTccs";
import { LoggedMenu } from "@/components/layout/LoggedMenu";

const startPeriod = 2000;
const years = Array.from(
  { length: new Date().getFullYear() - startPeriod + 1 },
  (_, i) => i + startPeriod
);

export default function Home() {
  const [projetos, setProjetos] = useState<ProjetoFinal[] | null>(null);
  const [pagina, setPagina] = useState<number>(1);
  const [itensPorPagina, setItensPorPagina] = useState<number>(20);
  const [anoSelecionado, setAnoSelecionado] = useState<number[] | null>(null);

  const [selectedTags, setSelectedTags] = useState<FilterProps[]>([]);
  const [selectedCursos, setSelectedCursos] = useState<FilterProps[]>([]);
  const [selectedPeriods, setSelectedPeriods] = useState<FilterProps[]>([]);
  const [cursos, setCursos] = useState<FilterProps[]>([]);
  const [pesquisa, setpesquisa] = useState<string | null>(null);
  const [searchBtn, setSearchBtn] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");

  const fetchData = async () => {
    try {
      let endpoint = `http://localhost:8000/api/v1/projetos?pagina=${pagina}&itens_por_pagina=${itensPorPagina}`;
      if (searchText.length > 0) endpoint += `&pesquisa=${searchText}`;

      console.log(selectedPeriods);
      if (selectedPeriods && selectedPeriods.length > 0) {
        const anos = selectedPeriods.map((periodo) => periodo.id).join("-");
        endpoint += `&periodos=${anos}`;
      }

      if (selectedCursos && selectedCursos.length > 0) {
        const cursosIds = selectedCursos.map((curso) => curso.id).join("-");
        endpoint += `&cursos_id=${cursosIds}`;
      }

      if (pesquisa && pesquisa != "") {
        endpoint += `&pesquisa=${pesquisa}`;
      }

      console.log(endpoint)
      const response = await fetchWithAuth(endpoint);
      const data = await response?.json();
      setProjetos(data);
      console.log(data);
    } catch (error) {
      console.error("Error fetching tccs:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="rounded-md overflow-hidden">
      <LoggedMenu
        searchInput={searchText}
        setSearchInput={setSearchText}
        fetchProjetos={fetchData}
      />
      <section>
        <Filters
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
          selectedCursos={selectedCursos}
          setSelectedCursos={setSelectedCursos}
          selectedPeriods={selectedPeriods}
          setSelectedPeriods={setSelectedPeriods}
          cursos={cursos}
          setCursos={setCursos}
        />
      </section>
      <section className="">
        <ListTccs
          itens_por_pagina={itensPorPagina}
          pagina={pagina}
          projetos={projetos}
          anos={anoSelecionado}
          cursos={["ADS", "SI"]}
        />
      </section>
    </div>
  );
}
