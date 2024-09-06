"use client";

import * as React from "react";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Column, Row } from "@tanstack/react-table";
import { useTable } from "@/hooks/useTable";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FilterFn } from "@tanstack/react-table";
import { EyeSlash, ListPlus, MagnifyingGlass, Sliders } from "phosphor-react";

export const multiValueFilterFn: FilterFn<any> = (
  row,
  columnId,
  filterValue
) => {
  const rowValue = String(row.getValue(columnId)).toLowerCase(); 
  const normalizedFilterValue = filterValue.map((val: any) =>
    String(val).toLowerCase()
  );

  return Array.isArray(filterValue) && normalizedFilterValue.includes(rowValue);
};


interface DataTableProps<TData> {
  withFilters?: string[];
  withSearchInput?: string | boolean;
  withVisibilityColumns?: boolean;
  withPageSize?: boolean;
}

export function DataTableHeader<TData>({
  withFilters,
  withSearchInput,
  withVisibilityColumns,
  withPageSize,
}: DataTableProps<TData>) {
  const { table, pageSize, setPageSize, globalFilter, setGlobalFilter } = useTable();

  const [uniqueValuesFilters, setFilters] = React.useState<
    Record<string, any[]>
  >({});

  const updateFilters = (key: string, checked: boolean, value: any) => {
    const currentFilters =
      (table.getColumn(key)?.getFilterValue() as any[]) || [];
    let newFilters:any [] | undefined = checked
      ? Array.from(new Set([...currentFilters, value]))
      : currentFilters.filter((v) => v !== value);
  
    if (newFilters.length === 0) {
      newFilters = undefined;
    }
  
    table.getColumn(key)?.setFilterValue(newFilters);
  };

  const clearAllFilters = () => {
    withFilters?.forEach((key) => {
      table.getColumn(key)?.setFilterValue(undefined);
    });
  };

  const clearFilter = (key: string) => {
    table.getColumn(key)?.setFilterValue(undefined);
  };
  
  React.useEffect(() => {
    const getUniqueColumnValues = (keys: string[]) => {
      const uniqueValues: Record<string, any[]> = {};

      table.getRowModel().rows.forEach((row: Row<TData>) => {
        keys.forEach((key) => {
          const value = row.getValue(key);
          if (value !== undefined && value !== null) {
            if (!uniqueValues[key]) {
              uniqueValues[key] = [];
            }
            if (!uniqueValues[key].includes(value)) {
              uniqueValues[key].push(value);
            }
          }
        });
      });

      return uniqueValues;
    };

    setFilters(withFilters ? getUniqueColumnValues(withFilters) : {});
  }, [table, withFilters]);

  return (
    <div className="flex items-center pb-4 gap-2 justify-between">
      <div className="flex flex-col sm:flex-row gap-2 items-start justify-between w-full sm:items-center">
        {withSearchInput && withSearchInput != true ?(
          <div className="w-full sm:max-w-xs relative">
            <Input
              placeholder={`Buscando por ${withSearchInput}`}	
              value={
                (table
                  .getColumn(withSearchInput)
                  ?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table
                  .getColumn(withSearchInput)
                  ?.setFilterValue(event.target.value)
              }
              className="w-full sm:max-w-xs active:ring-primary after:ring-primary focus:border-primary focus:ring-primary"
            />
            <MagnifyingGlass className="absolute right-3 bottom-3" />
          </div>
        ) : (
          <div className="w-full sm:max-w-xs relative">
            <Input
              placeholder="Buscar..."
              value={globalFilter}
              onChange={(event) => setGlobalFilter(event.target.value)}
              className="w-full sm:max-w-xs active:ring-primary after:ring-primary focus:border-primary focus:ring-primary"
            />
            <MagnifyingGlass className="absolute right-3 bottom-3" />
          </div>
        )}
        <div className="grid grid-cols-3 w-full sm:w-auto sm:flex gap-2">
        {withFilters && (
            <DropdownMenu>
              <DropdownMenuTrigger className="w-full" asChild>
                <Button variant="outline" className="ml-auto">
                  <span className="flex items-center gap-2 text-xs lg:text-sm">
                    Filtros
                    <Sliders />
                  </span>
                  <ChevronDownIcon className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={clearAllFilters}
                  className="text-red-500"
                >
                  Limpar Todos
                </DropdownMenuItem>
                {withFilters.map((key: string) => (
                  <DropdownMenuSub key={key}>
                    <DropdownMenuSubTrigger className="capitalize">
                      {key}
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem
                        onClick={() => clearFilter(key)}
                        className="text-red-500"
                      >
                        Limpar {key}
                      </DropdownMenuItem>
                      {uniqueValuesFilters[key]?.map((value) => (
                        <DropdownMenuCheckboxItem
                          key={value}
                          className="capitalize"
                          checked={
                            (table.getColumn(key)?.getFilterValue() as any[])?.includes(value) || false
                          }
                          onCheckedChange={(checked) => {
                            updateFilters(key, checked, value); 
                          }}
                        >
                          {value}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          {withVisibilityColumns && (
            <DropdownMenu>
              <DropdownMenuTrigger
                className="w-full"
                asChild
              >
                <Button
                  variant="outline"
                  className="ml-auto"
                >
                  <span className="flex gap-2 items-center text-xs lg:text-sm">
                    Colunas
                    <EyeSlash />
                  </span>
                  <ChevronDownIcon className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column: Column<TData, any>) => column.getCanHide())
                  .map((column: Column<TData, any>) => (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          {withPageSize && (
            <Select
              onValueChange={(value) => {
                const newPageSize = Number(value);
                setPageSize(newPageSize);
                table.setPageSize(newPageSize);
              }}
              defaultValue={`${pageSize}`}
            >
              <SelectTrigger className="w-auto">
                <SelectValue placeholder={`Linhas: ${pageSize}`} />
              </SelectTrigger>
              <SelectContent className="text-xs lg:text-sm">
                <SelectGroup>
                  <SelectLabel>Linhas</SelectLabel>
                  {[10, 20, 30, 40, 50].map((size) => (
                    <SelectItem
                      key={size}
                      value={String(size)}
                    >
                      <span className="flex items-center gap-2 text-xs lg:text-sm">
                        <ListPlus /> {size}
                      </span>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        </div>
      </div>
    </div>
  );
}
