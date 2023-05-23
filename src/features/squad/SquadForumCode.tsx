import Card from "react-bootstrap/Card";
import { SquadItem } from "./squadSlice";

import { faCopy } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMemo } from "react";
import { Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import forumCodeBuilder from "./model/ForumCodeBuilder";

type SquadForumCodeProps = {
  players: SquadItem[];
  minMorale: number;
  minFitness: number;
  minItems: number;
};

export function SquadForumCode({
  players,
  minMorale,
  minFitness,
  minItems
}: SquadForumCodeProps) {
  const forumCode = useMemo(
    () =>
      players &&
      forumCodeBuilder.build({ players, minMorale, minFitness, minItems }),
    [players, minMorale, minFitness, minItems]
  );
  const copyToClipboard = () => {
    navigator.clipboard.writeText(forumCode);
  };
  console.log("SquadForumCode render", players?.length);
  if (!players) return <></>;
  return (
    <Card className="mb-3 ">
      <Card.Header className="bg-primary text-light">
        Forum code{" "}
        <Button onClick={copyToClipboard} variant="primary" size="sm">
          <FontAwesomeIcon icon={faCopy} />
        </Button>
      </Card.Header>
      <Card.Body>
        <Form.Control as="textarea" rows={10} defaultValue={forumCode} />
      </Card.Body>
    </Card>
  );
}
