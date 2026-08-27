import { useState,useEffect } from "react";

export default function useOnlineStatus(){
    const [isOnline,setIsOnline]= useState(navigator.onLine ? 'idel':'offline');

    useEffect(()=>{
        let timer;
        function handleOnline (){
            setIsOnline("online");
            //hides online notification after 5 seconds
            timer = setTimeout(()=>{
            setIsOnline('idel')
        },5000)
        }
        function handleOffline(){
            //Clear any existing timer when going offline
            clearTimeout(timer);
            setIsOnline("offline");
        }

        window.addEventListener('online',handleOnline);
        window.addEventListener('offline', handleOffline);
        return ()=>{
            window.removeEventListener('online',handleOnline);
            window.removeEventListener('offline',handleOffline);
            clearTimeout(timer);
        }

    },[]);

    return isOnline;
}