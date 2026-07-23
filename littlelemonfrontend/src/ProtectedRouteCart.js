import { Navigate,Outlet } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

export default function ProtectedRoutCart (){
    const {isLoggedIn} = useAuth()
    
    if (!isLoggedIn){
        return <Navigate to='/login' replace />
    }
    return <Outlet />
}