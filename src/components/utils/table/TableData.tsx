"use client";

import * as React from "react";
import { flexRender, HeaderGroup, Row, Cell, Column, ColumnMeta } from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTable } from "@/hooks/useTable";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface DataTableDataProps {
  isLoading?: boolean;
  withFooter?: {
    withRowsSelected?: boolean;
    withPagination?: boolean;
  };
  dataTableClassName?: string;
}

export interface ExtendedColumnMeta<TData> extends ColumnMeta<TData, any> {
  ofData?: boolean;
}

export function DataTableData<TData>({
  withFooter,
  isLoading,
  dataTableClassName,
}: DataTableDataProps) {
  const { table } = useTable();

  const visibleColumnsCount = table
  .getAllColumns()
  .filter((column: Column<TData, any>) => {
    const meta = column.columnDef.meta as ExtendedColumnMeta<TData> | undefined;
    return column.getIsVisible() && !(meta?.ofData);
  })
  .length;


return (
  <>
    {isLoading ? (
      <div className={`rounded-md border max-h-[30rem] overflow-hidden w-full h-full relative  ${dataTableClassName}`}>
        <Table className="flex-1">
          <TableHeader className="sticky top-0 z-10">
            <TableRow className="">
              {Array.from({ length: visibleColumnsCount }).map((_, index) => (
                <TableHead
                  key={index}
                  className="p-1 lg:p-2"
                >
                  <Skeleton className={`${index % 2 != 0 ? "w-full h-5" : "w-2/3 h-5"}`} />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody className="">
            {Array.from({ length: 20 }).map((_, index) => (
              <TableRow
                key={index}
              >
                {Array.from({ length: visibleColumnsCount }).map((_, index2) => (
                  <TableCell
                    className="p-1 lg:p-2"
                    key={index2}
                  >
                    <Skeleton className={`${index % 2 == 0 ? (
                      index2 % 2 != 0 ? "w-full h-5" : "w-2/3 h-5"	
                    ) : (
                      index2 % 2 == 0 ? "w-full h-5" : "w-2/3 h-5"
                    )}`}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      ) : (
        <div className={`rounded-md border h-[30rem] overflow-auto w-full relative ${dataTableClassName}`}>
          <Table className=" flex-1">
            <TableHeader className="sticky top-0 z-10">
              {table
                .getHeaderGroups()
                .map((headerGroup: HeaderGroup<TData>) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        className="p-1 lg:p-2"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
            </TableHeader>
            <TableBody className="">
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row: Row<TData>) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell: Cell<TData, unknown>) => (
                      <TableCell
                        className="p-1 lg:p-2"
                        key={cell.id}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={table.getAllColumns().length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
      {withFooter && (
        <div className="flex items-center justify-end space-x-2 py-4">
          {withFooter.withRowsSelected && (
            <div className="flex-1 text-sm text-muted-foreground">
              {table.getFilteredSelectedRowModel().rows.length} de{" "}
              {table.getFilteredRowModel().rows.length} linha(s) selecionada(s).
            </div>
          )}
          {withFooter.withPagination && (
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Próxima
              </Button>
            </div>
          )}
        </div>
      )}
    </>
  );
}