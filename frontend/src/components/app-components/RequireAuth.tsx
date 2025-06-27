import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import type { JSX } from "react";

interface Props {
  children: JSX.Element;
}

export default function RequireAuth({ children }: Props) {
  const { firebaseUser, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;

  if (!firebaseUser) {
    // Push them to /login and remember where they wanted to go
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
