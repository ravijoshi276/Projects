import { Outlet } from "react-router-dom";
import { useState,useEffect } from "react";
import { useAuth } from "./context/AuthContext";
import axios from "axios";

export default function ReservationOutletContext(){
    const [reservationData, setReservationData] = useState(null);
    const {token} =useAuth();
    useEffect(() => {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`,
                }
            };
            axios.get('http://localhost:8000/api/reservations', config)
                .then(res => setReservationData(res.data.results || res.data))
                .catch(err => console.error(err));
        }, [token])

        const cancleReservation = (id)=>{
            setReservationData(prev => 
                prev.map(item => item.id === id ? { ...item, status: "Cancelled" } : item)
            );
        }
        const modifyReservations = ({item})=>{
            setReservationData(prev =>prev.map(i=>i.id===item.id? {...item}:i))
        }
    
    return <Outlet context={{reservationData,cancleReservation,modifyReservations}} />
}