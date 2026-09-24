import { useEffect, useState } from "react"
import { getCoordinates } from "../api/getCoordinates.jsx"
export default function useCountry(){
    const [country,setCountry]= useState('');

    useEffect(()=>{
        
        async function featchCountry  () {
            try{
            const data = await getCoordinates.getCountry();
            setCountry(data);
            }catch(err){
                console.error(err);
            }
        }
        featchCountry();
    },[])

    return country

}