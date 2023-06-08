import { faCircleUser } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Fragment } from "react";
import {
  Container,
  Dropdown,
  Image,
  Nav,
  NavDropdown,
  NavItem,
  NavLink,
  Navbar
} from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ClubAgeCategoryDTO } from "../api/contracts";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  logout,
  selectIsLogged,
  selectManagerClubs
} from "../features/user/userSlice";
import i18n from "../i18n";
import "./Header.scss";

const fsBuildIn = import.meta.env.VITE_FSBUILDIN === "true";

type LangItem = { nativeName: string; img: string };

const langs: Record<string, LangItem> = {
  en: { nativeName: "English", img: fsFlagSm(4) },
  pl: { nativeName: "Polski", img: fsFlagSm(68) }
};

function fsFlagSm(id: number) {
  return `https://www.footstar.org/img/bandeiras-small/${id}.gif`;
}

export default function Header() {
  const clubs = useAppSelector(selectManagerClubs);
  const club = useAppSelector((state) => state.squad.club);
  const isLogged = useAppSelector(selectIsLogged);
  const { t } = useTranslation();

  const dispatch = useAppDispatch();

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
        <Navbar.Collapse
          id="basic-navbar-nav"
          className="justify-content-between"
        >
          <Nav className="me-auto">
            {isLogged && (
              <NavDropdown title={t("Clubs")} id="clubs-nav-dropdown">
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
          <Nav>
            <LanguageDropdown />
            {!fsBuildIn && (
              <Dropdown id="profile-nav-dropdown" as={NavItem}>
                <Dropdown.Toggle as={NavLink}>
                  <FontAwesomeIcon icon={faCircleUser} />
                </Dropdown.Toggle>
                <Dropdown.Menu className="dropdown-menu-end">
                  <Dropdown.Item onClick={() => dispatch(logout())}>
                    {t("Logout")}
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

function LanguageDropdown() {
  return (
    <Dropdown id="lang-nav-dropdown" className="dropdown-menu-end ">
      <Dropdown.Toggle as={NavLink}>
        <LangImgForKey lngKey={i18n.resolvedLanguage} />
      </Dropdown.Toggle>
      <Dropdown.Menu className="dropdown-menu-end">
        {Object.keys(langs).map((lngKey) => {
          const lng = langs[lngKey as keyof typeof langs];
          return (
            <Dropdown.Item
              key={lngKey}
              active={i18n.resolvedLanguage === lngKey}
              onClick={() => i18n.changeLanguage(lngKey)}
            >
              <LangImg lng={lng} /> {lng.nativeName}
            </Dropdown.Item>
          );
        })}
      </Dropdown.Menu>
    </Dropdown>
  );
}

function LangImgForKey({ lngKey }: { lngKey: string | undefined }) {
  if (!lngKey) return <></>;
  const lng = langs[lngKey as keyof typeof langs];
  if (!lng) return <></>;
  return <LangImg lng={lng} />;
}

function LangImg({ lng }: { lng: LangItem }) {
  return <img src={lng.img} alt={lng.nativeName} className="align-baseline" />;
}
