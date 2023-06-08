import { useEffect, useState } from "react";
import { Button, Card, Form, Spinner } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { Loading } from "../../components/Loading";
import {
  buildInLogin,
  login,
  selectIsLogged,
  selectUserError,
  selectUserStatus
} from "./userSlice";

const fsBuildIn = import.meta.env.VITE_FSBUILDIN === "true";

function LoginComponent() {
  const { t } = useTranslation();
  const userStatus = useAppSelector(selectUserStatus);

  const error = useAppSelector(selectUserError);

  const [validated, setValidated] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const isLogged = useAppSelector(selectIsLogged);
  useEffect(() => {
    if (isLogged) navigate("/");
  }, [isLogged, navigate]);

  const onClickLogin = () => {};

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const form = e.currentTarget;
    if (form.checkValidity()) {
      dispatch(login({ username, password }));
    }
    e.preventDefault();
    e.stopPropagation();

    setValidated(true);
  };

  return (
    <Card className="mw-300p mx-auto mt-3">
      <Card.Header className="bg-primary text-light bg-gradient">
        {t("Login.title")} (FSDN)
      </Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit} validated={validated} noValidate>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>{t("User name")}</Form.Label>
            <Form.Control
              onChange={(e) => setUsername(e.target.value)}
              required={true}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="password">
            <Form.Label>{t("FSDN Password")}</Form.Label>
            <Form.Control
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              required={true}
            />
          </Form.Group>
          {error && (
            <div className="form-group">
              <div className="alert alert-danger py-2" role="alert">
                {error}
              </div>
            </div>
          )}

          <Button
            variant="success"
            className="w-100"
            type="submit"
            disabled={userStatus === "loading"}
            onClick={onClickLogin}
          >
            {userStatus === "loading" && (
              <Spinner as="span" size="sm" role="status" aria-hidden="true" />
            )}{" "}
            {t("Login")}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}

function BuildInLogin() {
  const userStatus = useAppSelector(selectUserStatus);
  const dispatch = useAppDispatch();
  const error = useAppSelector(selectUserError);
  const navigate = useNavigate();

  const isLogged = useAppSelector(selectIsLogged);
  useEffect(() => {
    if (isLogged) navigate("/");
  }, [isLogged, navigate]);

  useEffect(() => {
    dispatch(buildInLogin());
  }, [dispatch]);

  if (userStatus !== "failed") return <Loading />;
  return (
    <>
      {error && (
        <div className="form-group">
          <div className="alert alert-danger py-2" role="alert">
            {error}
          </div>
        </div>
      )}
    </>
  );
}

const Login = fsBuildIn ? BuildInLogin : LoginComponent;

export default Login;
