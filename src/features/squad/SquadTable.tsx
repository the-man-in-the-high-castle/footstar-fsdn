import {
  faMitten,
  faShirt,
  faShoePrints
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  SortingFnOption,
  SortingState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable
} from "@tanstack/react-table";
import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { MatchItemDTO, MatchItemsDTO } from "../../api/contracts";
import { MatchOrders } from "./MatchOrders";
import { SquadItem } from "./squadSlice";

export function SquadTable({
  players,
  minMorale,
  minFitness,
  minItems
}: {
  players: SquadItem[];
  minMorale: number;
  minFitness: number;
  minItems: number;
}) {
  const columnHelper = createColumnHelper<TablePlayer>();

  const [sorting, setSorting] = React.useState<SortingState>([]);

  const columns = useMemo(
    () => columnsDef(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [minMorale, minFitness, minItems, players]
  );

  //const data = useMemo(() => players, [players]);
  const table = useReactTable({
    data: players,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel()
  });

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

  function columnsDef() {
    return [
      columnHelper.accessor("positionId", {
        header: "Position",
        cell: (info) => info.row.original.position
      }),
      columnHelper.accessor("name", {
        header: "Name",
        cell: (info) => (
          <PlayerLink
            player={{ name: info.getValue(), id: info.row.original.id }}
          />
        )
      }),
      columnHelper.accessor("age", { header: "Age" }),
      columnHelper.accessor("lastLoginDays", {
        header: "Last Login",
        sortUndefined: 1,
        cell: (info) => <LastLogin player={info.row.original} />
      }),
      columnHelper.accessor("experience", { header: "Experience" }),
      columnHelper.accessor("adaptability", {
        header: "Adaptability",
        cell: (info) => `${info.getValue()}%`
      }),
      columnHelper.accessor("clubLoyalty", {
        header: "Loyalty",
        cell: (info) => `${info.getValue()}%`
      }),
      columnHelper.accessor("morale", {
        header: "Morale",
        cell: (info) => <MarkedValue value={info.getValue()} min={minMorale} />
      }),
      columnHelper.accessor("confidenceId", {
        header: "Confidence",
        cell: (info) => (
          <span
            className={info.row.original.confidenceProblem ? "text-danger" : ""}
          >
            {info.row.original.confidence}
          </span>
        )
      }),
      columnHelper.group({
        header: "Iteams",
        columns: [
          columnHelper.accessor((row) => row.items.shoes, {
            id: "shoes",
            sortingFn: sortingItemsFn,
            header: () => <FontAwesomeIcon icon={faShoePrints} />,
            cell: (info) => <MatchItem item={info.getValue()} />
          }),
          columnHelper.accessor((row) => row.items.shirt, {
            id: "shirt",
            sortingFn: sortingItemsFn,
            header: () => <FontAwesomeIcon icon={faShirt} />,
            cell: (info) => <MatchItem item={info.getValue()} />
          }),
          columnHelper.accessor((row) => row.items.gloves, {
            id: "gloves",
            sortingFn: sortingItemsFn,
            header: () => <FontAwesomeIcon icon={faMitten} />,
            cell: (info) => <MatchItem item={info.getValue()} />
          })
        ]
      }),
      columnHelper.accessor("matchOrders", {
        header: "Match Orders",
        cell: (info) => <MatchOrders status={info.getValue()} />
      }),
      columnHelper.accessor("fitness", {
        header: "Fitness",
        cell: (info) => `${info.getValue()}%`
      }),
      columnHelper.accessor("fitnessBeforeMatch", {
        header: "Fitness BM",
        cell: (info) => <MarkedValue value={info.getValue()} min={minFitness} />
      })
    ];
  }

  function MatchItem({ item }: { item: MatchItemDTO | undefined }) {
    if (item) {
      return (
        <span
          className={item.bonus < minItems ? "text-danger" : ""}
          title={item.desc}
        >
          +{item.bonus}
        </span>
      );
    }

    if (minItems > 0) return <span className={"text-danger"}>-</span>;
    return <></>;
  }
}
type TablePlayer = SquadItem;
const MIN_LOGIN_DAYS_WARNING = 7;

const sortingItemsFn: SortingFnOption<TablePlayer> = (a, b, col) =>
  (a.original.items[col as keyof MatchItemsDTO]?.bonus ?? 0) -
  (b.original.items[col as keyof MatchItemsDTO]?.bonus ?? 0);

function LastLogin({ player }: { player: TablePlayer }) {
  //console.log("LastLogin", player.lastLoginDays, typeof player.lastLoginDays);
  return (
    <span
      title={player.lastLogin}
      className={
        (player.lastLoginDays ?? 0) > MIN_LOGIN_DAYS_WARNING
          ? "text-danger"
          : ""
      }
    >
      {player.lastLoginDaysText}
    </span>
  );
}

function MarkedValue({ value, min }: { value?: number; min: number }) {
  return value !== undefined ? (
    <span className={value < min ? "text-danger" : ""}>{value}%</span>
  ) : (
    <></>
  );
}
export function selectOptionsFrom100(count: number) {
  return [...Array(count)].map((_, index) => {
    const key = 100 - index;
    return (
      <option value={key} key={key}>
        {key}
      </option>
    );
  });
}
function PlayerLink({ player }: { player: { id: number; name: string } }) {
  return (
    <Link
      to={`https://www.footstar.org/player/ver_jogador.asp?jog_id=${player.id}`}
      className="text-decoration-none"
      target="_blank"
    >
      {player.name}
    </Link>
  );
}
