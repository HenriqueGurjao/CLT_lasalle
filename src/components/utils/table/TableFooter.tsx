import { useTable } from "@/hooks/useTable";

export function DataTableFooter<TData> () {
  const { table } = useTable();

  return (
    <div className="flex-1 text-sm text-muted-foreground">
      {table.getFilteredSelectedRowModel().rows.length} of{" "}
      {table.getFilteredRowModel().rows.length} row(s) selected.
    </div>
  );
};
