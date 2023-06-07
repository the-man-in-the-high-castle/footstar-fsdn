import { Fragment } from "react";
import { Container, Image, Nav, NavDropdown, Navbar } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ClubAgeCategoryDTO } from "../api/contracts";
import { useAppSelector } from "../app/hooks";
import { selectIsLogged, selectManagerClubs } from "../features/user/userSlice";

export default function Header() {
  const clubs = useAppSelector(selectManagerClubs);
  const club = useAppSelector((state) => state.squad.club);
  const isLogged = useAppSelector(selectIsLogged);
  const { t } = useTranslation();

  return (
    <Navbar bg="primary" variant="dark" expand="sm" className="bg-gradient">
      <Container>
        <Navbar.Brand href="/">
          <Image src="/img/logo_footstar.png" height={40} />
        </Navbar.Brand>
        <Navbar.Brand as={Link} to="/">
          FSDN <small>(Beta)</small>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {isLogged && (
              <NavDropdown title={t("Clubs")} id="basic-nav-dropdown">
                {clubs.map((c) => (
                  <Fragment key={c.clubId}>
                    <NavDropdown.Item
                      as={Link}
                      to={`/squad/${c.clubId}`}
                      active={
                        club.clubId === c.clubId &&
                        club.ageCategory === ClubAgeCategoryDTO.Main
                      }
                    >
                      {c.clubName}
                    </NavDropdown.Item>
                    <NavDropdown.Item
                      as={Link}
                      to={`/youth/${c.clubId}`}
                      active={
                        club.clubId === c.clubId &&
                        club.ageCategory === ClubAgeCategoryDTO.U19
                      }
                    >
                      {c.clubName} U19
                    </NavDropdown.Item>
                  </Fragment>
                ))}
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
