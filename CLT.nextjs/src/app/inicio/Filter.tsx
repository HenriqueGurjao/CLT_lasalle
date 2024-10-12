import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import fetchWithAuth from "@/utils/fetchWithAuth";
import { ChevronDownIcon, XIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { FunnelSimple } from "phosphor-react";
import React, { useEffect } from "react";
import { DropdownFilterGroup } from "./DropdownFilterGroup";

export interface FilterProps {
  nome: string;
  id: number;
}
const startPeriod = 2000;
const years = Array.from(
  { length: new Date().getFullYear() - startPeriod + 1 },
  (_, i) => i + startPeriod
);

export const Filters = () => {
  const [selectedTags, setSelectedTags] = React.useState<FilterProps[]>([]);
  const [selectedCursos, setSelectedCursos] = React.useState<FilterProps[]>([]);
  const [selectedPeriods, setSelectedPeriods] = React.useState<FilterProps[]>(
    []
  );
  const [cursos, setCursos] = React.useState<FilterProps[]>([]);

  useEffect(() => {
    const fetchCursoData = async () => {
      try {
        const response = await fetchWithAuth(
          "http://localhost:8000/api/v1/cursos/resumido"
        );

        const data = await response?.json();
        setCursos(data);
      } catch (error) {
        console.error("Error fetching cursos:", error);
      }
    };
    const fetchTagsData = async () => {
      try {
        const response = await fetchWithAuth(
          "http://localhost:8000/api/v1/cursos/resumido"
        );

        // Atualize seu estado de cursos, se necessário
        const data = await response?.json();
        setCursos(data);
      } catch (error) {
        console.error("Error fetching cursos:", error);
      }
    };

    fetchCursoData();
  }, []);

  const handleRemoveFilter = (
    filter: FilterProps,
    type: "tag" | "curso" | "year"
  ) => {
    if (type === "tag") {
      setSelectedTags((tags) => tags.filter((t) => t.id !== filter.id));
    } else if (type === "year") {
      setSelectedPeriods((periods) =>
        periods.filter((p) => p.id !== filter.id)
      ); // Supondo que os períodos também são FilterProps
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
          {[...selectedTags, ...selectedCursos, ...selectedPeriods].map(
            (filter) => (
              <li
                key={filter.id}
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
                  {filter.nome}
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
            {/* <DropdownFilterGroup
              label={"Tags"}
              options={tags} // Certifique-se de que 'tags' é um array de FilterProps
              selected={selectedTags}
              setSelected={setSelectedTags}
            /> */}
            <DropdownFilterGroup
              label={"Cursos"}
              options={cursos}
              selected={selectedCursos}
              setSelected={setSelectedCursos}
            />
            <DropdownFilterGroup
              label="Ano"
              options={years
                .toReversed()
                .map((year) => ({ nome: year.toString(), id: year }))}
              selected={selectedPeriods}
              setSelected={setSelectedPeriods}
            />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};