import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import { selectIsLogged } from "../features/user/userSlice";

export const ProtectedRoute = ({
  isAllowed = false,
  redirectPath = "/login",
  children
}: {
  isAllowed?: boolean;
  redirectPath?: string;
  children?: JSX.Element;
}) => {
  const isLogged = useAppSelector(selectIsLogged);
  let location = useLocation();
  if (!isAllowed && !isLogged) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  return children ?? <></>;
};
