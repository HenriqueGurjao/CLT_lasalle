'use client'

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { FilterProps } from "./Filter";
import { DropdownMenuGroup, DropdownMenuPortal, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger } from "@/components/ui/dropdown-menu";

interface DropdownFilterGroupProps {
  label: string;
  options: FilterProps[];
  selected: FilterProps[];
  setSelected: React.Dispatch<React.SetStateAction<FilterProps[]>>;
}

export const DropdownFilterGroup = ({
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
                    .filter(
                      (option) =>
                        !selected.some(
                          (selectedOption) => selectedOption.id === option.id
                        )
                    )
                    .map((option) => (
                      <CommandItem
                        key={option.id} // Use o ID para a chave
                        value={option.nome} // Use o nome ou outro identificador relevante
                        onSelect={() => handleSelect(option)} // Passe o objeto FilterProps
                      >
                        {option.nome}{" "}
                        {/* Renderize o nome ou outro atributo relevante */}
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