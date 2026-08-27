import { Navigate } from "react-router";
import { useAuth } from "./context/AuthContext";

//This route will navigate the childrens to homepage if user is already loggedin
export default function PublicRoute({ children }) {
  const { isLoggedIn } = useAuth();

  return isLoggedIn ? <Navigate to="/" replace /> : children;
}