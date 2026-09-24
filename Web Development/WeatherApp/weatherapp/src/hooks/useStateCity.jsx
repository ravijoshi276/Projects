import { useEffect, useState } from "react";
import { getCoordinates } from "../api/getCoordinates"; 

export default function useStateCity(state_id) {
    const [stateCity, setStateCity] = useState('')

    useEffect(() => {
        
        if (state_id==-1) return;

        console.log('City is called');
        
        async function fetchStateCity() {
            try {
                const data = await getCoordinates.getStateCity(state_id);
                setStateCity(data);
            } catch (err) {
                console.error("Failed to fetch city data:", err);
            }
        }
        
        fetchStateCity();
    }, [state_id]);

    return stateCity;
}