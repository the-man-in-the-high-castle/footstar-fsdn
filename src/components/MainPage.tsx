import { Fragment } from "react";
import { Card, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import {
  selectManagerClubs,
  selectUserError
} from "../features/user/userSlice";

export default function MainPage() {
  const clubs = useAppSelector(selectManagerClubs);
  const userError = useAppSelector(selectUserError);

  return (
    <Card>
      <Card.Header className="bg-primary bg-gradient text-light">
        Footstrar FSDN
      </Card.Header>
      <Card.Body>
        {userError && (
          <div className="alert alert-danger m-3">
            {userError}
            <small>
              {" "}
              -{" "}
              <a href="/" className="text-decoration-none">
                Back to footstar
              </a>
            </small>
          </div>
        )}
        <Nav>
          {clubs &&
            clubs.map((c) => (
              <Fragment key={c.clubId}>
                <Nav.Link as={Link} to={`/squad/${c.clubId}`}>
                  {c.clubName}
                </Nav.Link>
                <Nav.Link as={Link} to={`/youth/${c.clubId}`}>
                  {c.clubName} U19
                </Nav.Link>
              </Fragment>
            ))}
        </Nav>
      </Card.Body>
    </Card>
  );
}
