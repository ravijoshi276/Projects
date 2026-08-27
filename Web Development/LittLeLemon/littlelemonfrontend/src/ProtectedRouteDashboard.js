import { Navigate,Outlet, replace } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

export default function ProtectedRouteDashboard (){
    const {isLoggedIn,group} = useAuth()
    
    if (!isLoggedIn){
        return <Navigate to='/login' replace />
    }else if(group ==='user'){
        return <Navigate to='/' replace />
    }
    return <Outlet />
}