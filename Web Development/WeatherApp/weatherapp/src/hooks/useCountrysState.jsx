import { useEffect, useState } from "react"
import { getCoordinates } from "../api/getCoordinates.jsx"
export default function useCountryState(country_id){
    const [countryState,setCountryState]= useState('');

    useEffect(()=>{
        if (country_id==-1) return ;
        async function featchCountryState () {
            try{
            const data = await getCoordinates.getState(country_id);
            setCountryState(data);
            }catch(err){
                console.error(err);
            }
        }
        featchCountryState();
    },[country_id])

    return countryState;

}