import { useEffect } from "react";
import { Spinner } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import PageHeader from "../../components/PageHeader";
import { SquadCard } from "./SquadCard";
import {
  fetchPlayersCombo,
  selectAllPlayers,
  selectPlayersStatus
} from "./squadSlice";

let dev_tmp_initialized = false;

export const PlayersList = () => {
  const dispatch = useAppDispatch();

  const players = useAppSelector(selectAllPlayers);
  const playersStatus = useAppSelector(selectPlayersStatus);
  const error = useAppSelector((state) => state.squad.error);

  useEffect(() => {
    if (playersStatus === "idle" && !dev_tmp_initialized) {
      dev_tmp_initialized = true;
      dispatch(fetchPlayersCombo());
    }
  }, [playersStatus, dispatch]);

  const content = getContent();

  return (
    <>
      <div className="container-lg">
        <PageHeader title={"Squad"}></PageHeader>
        <div>{content}</div>
      </div>
    </>
  );

  function getContent() {
    switch (playersStatus) {
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
            <SquadCard players={players} />
          </>
        );
      default:
        return <div className="alert alert-danger">{error}</div>;
    }
  }
};
