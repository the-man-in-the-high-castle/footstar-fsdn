import { Suspense, useEffect } from "react";
import { Container } from "react-bootstrap";
import { Outlet, RouterProvider } from "react-router-dom";
import "./App.css";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import Header from "./components/Header";
import { Loading } from "./components/Loading";
import { fetchUser, selectUserStatus } from "./features/user/userSlice";
import { router } from "./router";

let dev_tmp_initialized = false;

function App() {
  return <RouterProvider router={router} />;
}

export default App;

export function Layout() {
  const dispatch = useAppDispatch();

  const userStatus = useAppSelector(selectUserStatus);

  useEffect(() => {
    if (userStatus === "idle" && !dev_tmp_initialized) {
      dev_tmp_initialized = true;
      dispatch(fetchUser());
    }
  }, [userStatus, dispatch]);
  return (
    <Suspense fallback={<Loading />}>
      <Header />
      <Container className="mt-3">
        <Outlet />
      </Container>
    </Suspense>
  );
}
