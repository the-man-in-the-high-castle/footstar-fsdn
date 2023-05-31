import {
  faMitten,
  faShirt,
  faShoePrints
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Row,
  SortingFnOption,
  SortingState,
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable
} from "@tanstack/react-table";
import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  FsdnSquadPermissionsDTO,
  MatchItemDTO,
  MatchItemsDTO
} from "../../api/contracts";
import { MatchOrders } from "./MatchOrders";
import { RTable } from "./RTable";
import { SquadItem } from "./Squad.model";

const fsServerUrl = import.meta.env.VITE_FS_URL;

type SquadTableProps = {
  players: SquadItem[];
  minMorale: number;
  minFitness: number;
  minItems: number;
  permissions: FsdnSquadPermissionsDTO;
};

export function SquadTable({
  players,
  minMorale,
  minFitness,
  minItems,
  permissions
}: SquadTableProps) {
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
    initialState: {
      columnVisibility: {
        matchOrders: permissions.startingEleven,
        fitnessBeforeMatch: permissions.training
      }
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel()
  });

  //console.log("SquadTable", players?.length);

  return <RTable table={table} />;

  function columnsDef() {
    return [
      columnHelper.accessor("positionId", {
        header: "Position",
        cell: (info) => (
          <span className={`badge position-${info.getValue() ?? "none"}`}>
            {info.row.original.position}
          </span>
        )
      }),
      columnHelper.accessor("name", {
        header: "Name",
        cell: (info) => (
          <PlayerLink
            player={{
              name: info.getValue(),
              id: info.row.original.id,
              userId: info.row.original.userId
            }}
          />
        )
      }),
      columnHelper.accessor("age", { header: "Age" }),
      columnHelper.accessor("lastLoginDays", {
        header: "Last Login",
        sortUndefined: 1,
        cell: (info) => <LastLogin player={info.row.original} />
      }),
      columnHelper.accessor("experienceId", {
        header: "Experience",
        cell: (info) => (
          <span className={`level${info.getValue()}`}>
            {info.row.original.experience}
          </span>
        )
      }),
      columnHelper.accessor("adaptability", {
        header: () => <span title="Adaptability">Adapt</span>,
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
        header: "Items",
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
        cell: (info) => info.getValue() && `${info.getValue()}%`
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

const sortingItemsFn: SortingFnOption<TablePlayer> = (a, b, col) => {
  return bonus(a) - bonus(b);
  function bonus(row: Row<SquadItem>) {
    return row.original.items[col as keyof MatchItemsDTO]?.bonus ?? 0;
  }
};

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

function PlayerLink({
  player: { id, name, userId }
}: {
  player: { id: number; name: string; userId?: number };
}) {
  return (
    <Link
      to={`${fsServerUrl}/player/ver_jogador.asp?jog_id=${id}`}
      className={`text-decoration-none${!userId ? "" : " fw-bold"}`}
      target="_blank"
    >
      {name}
    </Link>
  );
}
