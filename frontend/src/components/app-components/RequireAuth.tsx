import { Navigate, useLocation } from "react-router-dom";
import type { JSX } from "react";
import { useUser } from "@/contexts/UserContext";

interface Props {
  children: JSX.Element;
}

export default function RequireAuth({ children }: Props) {
  const { isLoggedIn } = useUser();
  const location = useLocation();

  if (!isLoggedIn) {
    // Push them to /login and remember where they wanted to go
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}