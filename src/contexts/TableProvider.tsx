"use client";

import { createContext, ReactNode, useState } from "react";
import {
  useReactTable,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";

export const TableContext = createContext<any>(null);

interface TableProviderProps {
  data: any[];
  columns: any[];
  children: ReactNode;
}

export function TableProvider({ data, columns, children }: TableProviderProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>();
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [pageSize, setPageSize] = useState(10);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
      // pagination: {pageIndex: 0, pageSize},
    },
  });

  return (
    <TableContext.Provider
      value={{
        table,
        sorting,
        setSorting,
        pageSize,
        setPageSize,
        columnFilters,
        columnVisibility,
        setColumnFilters,
        setColumnVisibility,
        rowSelection,
        setRowSelection,
        globalFilter,
        setGlobalFilter,
      }}
    >
      {children}
    </TableContext.Provider>
  );
}
