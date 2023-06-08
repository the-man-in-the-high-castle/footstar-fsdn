import { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { SquadClubKey } from "../../api/contracts";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { Loading } from "../../components/Loading";
import PageHeader from "../../components/PageHeader";
import { SquadCard } from "./SquadCard";
import {
  fetchPlayersCombo,
  selectPlayers,
  selectSquadStatus
} from "./squadSlice";

//let dev_tmp_initialized = false;
let tmpClub: SquadClubKey | undefined;

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
      (clubId !== tmpClub?.clubId || ageCategory !== tmpClub?.ageCategory) &&
      (clubId !== currentClub.clubId || ageCategory !== currentClub.ageCategory)
    ) {
      tmpClub = { clubId, ageCategory };
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
        return <Loading />;
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

export default Squad;
