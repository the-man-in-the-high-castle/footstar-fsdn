import React from "react";
import { createBrowserRouter } from "react-router-dom";
import { Layout } from "./App";
import { ClubAgeCategoryDTO } from "./api/contracts";
import Header from "./components/Header";
import MainPage from "./components/MainPage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import ErrorPage from "./components/error-page";
import Login from "./features/user/Login";

const Squad = React.lazy(() => import("./features/squad/Squad"));

export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: (
        <ProtectedRoute redirectPath="/login" isAllowed={false}>
          <Layout />
        </ProtectedRoute>
      ),
      errorElement: <ErrorPage />,
      children: [
        { path: "/", element: <MainPage /> },
        {
          path: "squad/:clubId",
          element: <Squad />
        },
        {
          path: "youth/:clubId",
          element: <Squad ageCategory={ClubAgeCategoryDTO.U19} />
        }
      ]
    },
    {
      path: "/login",
      element: (
        <>
          <Header />
          <Login />
        </>
      )
    }
  ],
  { basename: "/community/fsdn" }
);
