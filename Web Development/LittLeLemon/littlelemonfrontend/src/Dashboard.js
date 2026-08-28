
import { Outlet } from "react-router";
import Sidebar from "./Sidebar";
export default function Dashboard (){
    return <div className="dashboard">
        <Sidebar />
        <main className="content-area">
        <Outlet />
        </main>

    </div>
    
}
