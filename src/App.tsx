import { useEffect } from "react";
import { Container } from "react-bootstrap";
import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import "./App.css";
import { ClubAgeCategoryDTO } from "./api/contracts";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import Header from "./components/Header";
import MainPage from "./components/MainPage";
import ErrorPage from "./components/error-page";
import { Squad } from "./features/squad/Squad";
import { fetchUser, selectUserStatus } from "./features/user/userSlice";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Layout />,
      errorElement: <ErrorPage />,
      children: [
        { path: "/", element: <MainPage /> },
        { path: "squad/:clubId", element: <Squad /> },
        {
          path: "youth/:clubId",
          element: <Squad ageCategory={ClubAgeCategoryDTO.U19} />
        }
      ]
    }
  ],
  { basename: "/community/fsdn" }
);

let dev_tmp_initialized = false;

function App() {
  return <RouterProvider router={router} />;
}

export default App;

function Layout() {
  const dispatch = useAppDispatch();

  const userStatus = useAppSelector(selectUserStatus);

  useEffect(() => {
    if (userStatus === "idle" && !dev_tmp_initialized) {
      dev_tmp_initialized = true;
      dispatch(fetchUser());
    }
  }, [userStatus, dispatch]);
  return (
    <>
      <Header />
      <Container className="mt-3">
        <Outlet />
      </Container>
    </>
  );
}
