import { useEffect, useMemo } from "react";
import { Spinner } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import PageHeader from "../../components/PageHeader";
import { SquadCard } from "./SquadCard";
import {
  fetchPlayersCombo,
  selectPlayers,
  selectSquadStatus
} from "./squadSlice";

//let dev_tmp_initialized = false;

export const Squad = ({ ageCategory = 0 }: { ageCategory?: number }) => {
  let { clubId: clubIdArg } = useParams();
  const clubId = useMemo(() => toNumber(clubIdArg), [clubIdArg]);
  const dispatch = useAppDispatch();

  const players = useAppSelector((state) =>
    selectPlayers(state, { clubId, ageCategory })
  );

  const squadStatus = useAppSelector(selectSquadStatus);
  const currentClub = useAppSelector((state) => state.squad.club);
  const error = useAppSelector((state) => state.squad.error);

  useEffect(() => {
    if (
      clubId &&
      (clubId !== currentClub.clubId || ageCategory !== currentClub.ageCategory)
    ) {
      dispatch(fetchPlayersCombo(clubId, ageCategory));
    }
  }, [clubId, currentClub, dispatch, ageCategory]);

  const content = getContent();

  return (
    <>
      <PageHeader title={"Squad"}></PageHeader>
      <div>{content}</div>
    </>
  );

  function getContent() {
    switch (squadStatus) {
      case "idle":
      case "loading":
        return (
          <div className="text-center">
            <Spinner className="my-3" />
          </div>
        );
      case "succeeded":
        return (
          <>
            <SquadCard
              players={players}
              clubId={clubId}
              ageCategory={ageCategory}
            />
          </>
        );
      default:
        return <div className="alert alert-danger">{error}</div>;
    }
  }
};

export function toNumber(text: string | number | undefined | null) {
  const result = Number(text);
  return isNaN(result) ? undefined : result;
}
