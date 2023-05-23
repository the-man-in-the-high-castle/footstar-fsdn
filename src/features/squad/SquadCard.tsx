import { useState } from "react";
import { Card } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { SquadForumCode } from "./SquadForumCode";
import {
  SquadItem,
  changeMatchDate,
  selectAllMatches,
  selectCurrentMatchId
} from "./squadSlice";

import { SquadTable, selectOptionsFrom100 } from "./SquadTable";

export function SquadCard({ players }: { players: SquadItem[] }) {
  const matches = useAppSelector(selectAllMatches);
  const currentMatchId = useAppSelector(selectCurrentMatchId);

  const [minMorale, setMinMorale] = useState(90);
  const [minFitness, setMinFitness] = useState(90);
  const [minItems, setMinItems] = useState(0);

  const dispatch = useAppDispatch();
  return (
    <>
      <Card className="mb-3">
        <Card.Header className="bg-primary text-light">
          <SquadOptions />
        </Card.Header>

        <Card.Body className="px-0">
          <SquadTable
            players={players}
            minMorale={minMorale}
            minFitness={minFitness}
            minItems={minItems}
          />
        </Card.Body>
      </Card>

      <SquadForumCode
        players={players}
        minMorale={minMorale}
        minFitness={minFitness}
        minItems={minItems}
      />
    </>
  );

  function SquadOptions() {
    return (
      <div className="row justify-content-end gy-1 gx-3">
        <div className="col-auto hstack gap-1">
          <label className="ms-1">Fitness:</label>
          <select
            value={minFitness}
            onChange={(e) => setMinFitness(Number(e.target.value))}
            className="form-select w-auto"
          >
            {selectOptionsFrom100(30)}
          </select>
        </div>
        <div className="col-auto hstack gap-1">
          <label>Morale:</label>
          <select
            value={minMorale}
            onChange={(e) => setMinMorale(Number(e.target.value))}
            className="form-select w-auto"
          >
            {selectOptionsFrom100(30)}
          </select>
        </div>
        <div className="col-auto hstack gap-1">
          <label>Items:</label>
          <select
            value={minItems}
            onChange={(e) => setMinItems(Number(e.target.value))}
            className="form-select w-auto"
          >
            {[...Array(6)].map((_, index) => {
              const key = index * 2;
              return (
                <option value={key} key={key}>
                  +{key}
                </option>
              );
            })}
          </select>
        </div>

        <div className="col-auto">
          <select
            value={currentMatchId}
            onChange={(e) => dispatch(changeMatchDate(e.target.value))}
            className="form-select w-auto mw-100"
          >
            {matches.map((m) => (
              <option value={m.id} key={m.id}>
                {m.opponent} ({m.date})
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  }
}
