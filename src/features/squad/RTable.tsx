import { RowData, Table, flexRender } from "@tanstack/react-table";

export function RTable<TData extends RowData>({
  table
}: {
  table: Table<TData>;
}) {
  return (
    <div className="table-responsive">
      <table className="table table-sm small table-hover table-striped text-center">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="align-middle">
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  colSpan={header.colSpan}
                  className={
                    !header.isPlaceholder && header.column.getCanSort()
                      ? `sorting ${
                          { asc: "sorting_asc", desc: "sorting_desc" }[
                            header.column.getIsSorted() as string
                          ] ?? ""
                        }`
                      : ""
                  }
                  onClick={header.column.getToggleSortingHandler()}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
