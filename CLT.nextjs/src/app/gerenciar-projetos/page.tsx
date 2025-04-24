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
import { LoggedMenu } from "@/components/layout/LoggedMenu";
import { FilterProps, Filters } from "../inicio/Filter";
import { ListProjectsFooter } from "../inicio/ListProjectsFooter";
import { ListTccs } from "../inicio/ListarTccs";
import { ProjetoFinal } from "../inicio/filters.dtypes";

const startPeriod = 2000;
const years = Array.from(
  { length: new Date().getFullYear() - startPeriod + 1 },
  (_, i) => i + startPeriod
);

export default function GerenciarProjetos() {
  const [projetos, setProjetos] = useState<ProjetoFinal[] | null>(null);
  const [pagina, setPagina] = useState<number>(1);
  // const [itensPorPagina, setItensPorPagina] = useState<number>(20);
  const [anoSelecionado, setAnoSelecionado] = useState<number[] | null>(null);

  const [selectedTags, setSelectedTags] = useState<FilterProps[]>([]);
  const [selectedCursos, setSelectedCursos] = useState<FilterProps[]>([]);
  const [selectedPeriods, setSelectedPeriods] = useState<FilterProps[]>([]);
  const [cursos, setCursos] = useState<FilterProps[]>([]);
  const [pesquisa, setpesquisa] = useState<string | null>(null);
  // const [searchBtn, setSearchBtn] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");
  const [pagesNumber, setPagesNumber] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPages, setItemsPerPages] = useState<number>(20);

  const handleItemsPerPageChange = (value: string) => {
    const itemsPerPage = parseInt(value, 10);
    setItemsPerPages(itemsPerPage); 
    setCurrentPage(1);
  };

  const fetchData = async () => {
    try {
      let endpoint = `http://localhost:8000/api/v1/projetos?pagina=${currentPage}&itens_por_pagina=${itemsPerPages}&ativos=0`;
      if (searchText.length > 0) endpoint += `&pesquisa=${searchText}`;

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

      const response = await fetchWithAuth(endpoint);
      const data = await response?.json();

      setProjetos(data.projetos);
      setPagesNumber(data.total_pages)
    } catch (error) {
      console.error("Error fetching tccs:", error);
    }
  };

  useEffect(() => {
    setProjetos(null);
    fetchData();
  }, [currentPage, itemsPerPages, pagesNumber]);

  return (
    <div className="rounded-md h-full relative">
      <div className="sticky top-[-20px] z-10 bg-gray-100 min-h-[20px]"></div>
      <div className="sticky top-0 bg-gray-200 z-20">
        <LoggedMenu
          searchInput={searchText}
          setSearchInput={setSearchText}
          fetchProjetos={fetchData}
          setCurrentPage={setCurrentPage}
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
          <ListProjectsFooter
            currentPage={currentPage}
            pagesNumber={pagesNumber}
            setCurrentPage={setCurrentPage}
            setPagesNumber={setPagesNumber}
            customizePagesNumber={handleItemsPerPageChange}
            currentPageSize={itemsPerPages}
          />
        </section>
      </div>
      <section className="h-full">
        <ListTccs
          itens_por_pagina={pagesNumber}
          pagina={pagina}
          projetos={projetos}
          anos={anoSelecionado}
          cursos={cursos}
        />
      </section>
    </div>
  );
}
