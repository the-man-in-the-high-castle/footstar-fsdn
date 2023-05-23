import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import ErrorPage from "./components/error-page";
import { PlayersList } from "./features/squad/PlayersList";

const router = createBrowserRouter([
  {
    path: "/",
    element: <PlayersList />,
    errorElement: <ErrorPage />
  },
  {
    path: "/squad",
    element: <PlayersList />
  }
]);

function App() {
  return (
    <>
      <Header />
      <div>
        <RouterProvider router={router} />
      </div>
    </>
  );
}

export default App;
